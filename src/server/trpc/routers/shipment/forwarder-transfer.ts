import { z } from "zod"
import { domesticAgentProcedure, protectedProcedure, router } from "../../trpc"
import {
  shipments,
  shipmentPackages,
  forwarderTransferShipments,
  packageStatusLogs,
  packages,
  users,
  vehicles,
  webpushSubscriptions,
  expopushTokens,
  assignedDrivers,
  assignedVehicles,
  warehouses,
} from "@/server/db/schema"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { TRPCError } from "@trpc/server"
import { and, count, eq, getTableColumns, inArray, like } from "drizzle-orm"
import { alias } from "drizzle-orm/mysql-core"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"
import { notifyByExpoPush, notifyByWebPush } from "@/server/notification"

export const forwarderTransferShipmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const shipmentColumns = getTableColumns(shipments)
    const { shipmentId, ...forwarderTransferShipmentColumns } = getTableColumns(
      forwarderTransferShipments,
    )

    const agentUsers = alias(users, "agent_users")
    const driverUsers = alias(users, "driver_users")

    return await ctx.db
      .select({
        ...shipmentColumns,
        ...forwarderTransferShipmentColumns,
        agentDisplayName: agentUsers.displayName,
        driverDisplayName: driverUsers.displayName,
        warehouseDisplayName: warehouses.displayName,
      })
      .from(forwarderTransferShipments)
      .innerJoin(
        shipments,
        eq(forwarderTransferShipments.shipmentId, shipments.id),
      )
      .innerJoin(
        agentUsers,
        eq(forwarderTransferShipments.sentToAgentId, agentUsers.id),
      )
      .innerJoin(
        driverUsers,
        eq(forwarderTransferShipments.driverId, driverUsers.id),
      )
      .innerJoin(
        warehouses,
        eq(forwarderTransferShipments.departingWarehouseId, warehouses.id),
      )
  }),
  getAllForDomesticAgent: domesticAgentProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(forwarderTransferShipments)
      .innerJoin(
        shipments,
        eq(forwarderTransferShipments.shipmentId, shipments.id),
      )
      .where(eq(forwarderTransferShipments.sentToAgentId, ctx.user.id))

    return results.map(({ shipments, forwarder_transfer_shipments }) => {
      const { shipmentId, ...other } = forwarder_transfer_shipments

      return {
        ...shipments,
        ...other,
      }
    })
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(forwarderTransferShipments)
        .innerJoin(
          shipments,
          eq(forwarderTransferShipments.shipmentId, shipments.id),
        )
        .where(eq(shipments.id, input.id))

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      const { forwarder_transfer_shipments } = results[0]
      const { shipmentId, ...other } = forwarder_transfer_shipments

      return {
        ...results[0].shipments,
        ...other,
      }
    }),
  getPreparing: protectedProcedure
    .input(
      z.object({
        searchWith: z
          .literal("SHIPMENT_ID")
          .or(z.literal("PACKAGE_ID"))
          .or(z.literal("PACKAGE_PRE_ID")),
        searchTerm: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const agentUsers = alias(users, "agent_users")
      const driverUsers = alias(users, "driver_users")

      const shipmentColumns = getTableColumns(shipments)
      const { shipmentId, ...forwarderTransferShipmentColumns } =
        getTableColumns(forwarderTransferShipments)

      return await ctx.db
        .selectDistinct({
          ...shipmentColumns,
          ...forwarderTransferShipmentColumns,
          agentDisplayName: agentUsers.displayName,
          driverDisplayName: driverUsers.displayName,
          driverContactNumber: driverUsers.contactNumber,
          vehicleDisplayName: vehicles.displayName,
          vehicleType: vehicles.type,
        })
        .from(shipmentPackages)
        .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
        .innerJoin(
          forwarderTransferShipments,
          eq(
            shipmentPackages.shipmentId,
            forwarderTransferShipments.shipmentId,
          ),
        )
        .innerJoin(
          shipments,
          eq(forwarderTransferShipments.shipmentId, shipments.id),
        )
        .innerJoin(
          agentUsers,
          eq(forwarderTransferShipments.sentToAgentId, agentUsers.id),
        )
        .innerJoin(
          driverUsers,
          eq(forwarderTransferShipments.driverId, driverUsers.id),
        )
        .innerJoin(
          vehicles,
          eq(forwarderTransferShipments.vehicleId, vehicles.id),
        )
        .where(
          and(
            eq(shipments.status, "PREPARING"),
            input.searchTerm === ""
              ? undefined
              : input.searchWith === "SHIPMENT_ID"
                ? like(shipments.id, `%${input.searchTerm}%`)
                : input.searchWith === "PACKAGE_ID"
                  ? like(packages.id, `%${input.searchTerm}%`)
                  : like(packages.preassignedId, `%${input.searchTerm}%`),
          ),
        )
    }),
  getInTransit: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(forwarderTransferShipments)
      .innerJoin(
        shipments,
        eq(forwarderTransferShipments.shipmentId, shipments.id),
      )
      .where(eq(shipments.status, "IN_TRANSIT"))

    return results.map(({ shipments, forwarder_transfer_shipments }) => {
      const { shipmentId, ...other } = forwarder_transfer_shipments

      return {
        ...shipments,
        ...other,
      }
    })
  }),
  updateStatusToInTransitById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(shipments)
        .set({
          status: "IN_TRANSIT",
        })
        .where(eq(shipments.id, input.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "TRANSFER_FORWARDER_SHIPMENT",
        createdById: ctx.user.id,
      })

      return result
    }),
  updateStatusToCompletedById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const [forwarderTransferShipment] = await tx
          .select()
          .from(forwarderTransferShipments)
          .where(eq(forwarderTransferShipments.shipmentId, input.id))

        await tx
          .update(shipments)
          .set({
            status: "COMPLETED",
          })
          .where(eq(shipments.id, input.id))

        await tx
          .delete(assignedDrivers)
          .where(
            eq(assignedDrivers.driverId, forwarderTransferShipment.driverId),
          )

        await tx
          .delete(assignedVehicles)
          .where(
            eq(assignedVehicles.vehicleId, forwarderTransferShipment.vehicleId),
          )

        await createLog(tx, {
          verb: "UPDATE",
          entity: "TRANSFER_FORWARDER_SHIPMENT",
          createdById: ctx.user.id,
        })
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        departingWarehouseId: z.number(),
        sentToAgentId: z.string().length(28),
        driverId: z.string().length(28),
        vehicleId: z.number(),
        packageIds: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()
      const newPackageStatusLogs = input.packageIds.map((packageId) => ({
        packageId,
        createdById: ctx.user.id,
        description: getDescriptionForNewPackageStatusLog({
          status: "SORTING",
        }),
        status: "SORTING" as const,
        createdAt,
      }))

      await ctx.db.transaction(async (tx) => {
        const webPushSubscriptionResults = await tx
          .select()
          .from(webpushSubscriptions)
          .where(eq(webpushSubscriptions.userId, input.driverId))

        const expoPushTokenResults = await tx
          .select()
          .from(expopushTokens)
          .where(eq(expopushTokens.userId, input.driverId))

        const [{ insertId: shipmentId }] = await ctx.db
          .insert(shipments)
          .values({
            type: "TRANSFER_FORWARDER",
            status: "PREPARING",
          })

        await tx.insert(assignedDrivers).values({
          driverId: input.driverId,
          shipmentId,
        })

        await tx.insert(assignedVehicles).values({
          vehicleId: input.vehicleId,
          shipmentId,
        })

        await ctx.db.insert(forwarderTransferShipments).values({
          shipmentId,
          departingWarehouseId: input.departingWarehouseId,
          sentToAgentId: input.sentToAgentId,
          driverId: input.driverId,
          vehicleId: input.vehicleId,
          createdAt,
        })

        const newShipmentPackages = input.packageIds.map((packageId) => ({
          shipmentId,
          packageId,
          status: "PREPARING" as const,
          createdAt,
        }))

        await tx.insert(shipmentPackages).values(newShipmentPackages)

        await tx
          .update(packages)
          .set({
            status: "SORTING",
          })
          .where(inArray(packages.id, input.packageIds))
        await tx.insert(packageStatusLogs).values(newPackageStatusLogs)
        await createLog(tx, {
          verb: "CREATE",
          entity: "TRANSFER_FORWARDER_SHIPMENT",
          createdById: ctx.user.id,
        })

        if (webPushSubscriptionResults.length > 0)
          await notifyByWebPush({
            subscriptions: webPushSubscriptionResults,
            title: "New forwarder transfer assigned",
            body: `Forwarder transfer with ID ${shipmentId} has been assigned to you.`,
          })

        if (expoPushTokenResults.length > 0)
          await notifyByExpoPush({
            to: expoPushTokenResults.map((token) => token.data),
            title: "New forwarder transfer assigned",
            body: `Forwarder transfer with ID ${shipmentId} has been assigned to you.`,
          })
      })
    }),
  confirmTransferById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(forwarderTransferShipments)
        .set({
          isTransferConfirmed: 1,
        })
        .where(eq(forwarderTransferShipments.shipmentId, input.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "TRANSFER_FORWARDER_SHIPMENT",
        createdById: ctx.user.id,
      })

      return result
    }),
  getTotalInTransitSentToAgentId: protectedProcedure.query(async ({ ctx }) => {
    const [{ value }] = await ctx.db
      .select({
        value: count(),
      })
      .from(forwarderTransferShipments)
      .innerJoin(
        shipments,
        eq(forwarderTransferShipments.shipmentId, shipments.id),
      )
      .where(
        and(
          eq(forwarderTransferShipments.sentToAgentId, ctx.user.id),
          eq(shipments.status, "IN_TRANSIT"),
        ),
      )

    return {
      count: value,
    }
  }),
  updateDetailsById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        driverId: z.string(),
        sentToAgentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(forwarderTransferShipments)
        .set({
          driverId: input.driverId,
          sentToAgentId: input.sentToAgentId,
        })
        .where(eq(forwarderTransferShipments.shipmentId, input.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "TRANSFER_FORWARDER_SHIPMENT",
        createdById: ctx.user.id,
      })
    }),
})

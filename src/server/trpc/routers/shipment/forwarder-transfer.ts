import { z } from "zod"
import { protectedProcedure, router } from "../../trpc"
import {
  shipments,
  shipmentPackages,
  forwarderTransferShipments,
  packageStatusLogs,
  packages,
  users,
  vehicles,
} from "@/server/db/schema"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { TRPCError } from "@trpc/server"
import { and, count, eq } from "drizzle-orm"
import { alias } from "drizzle-orm/mysql-core"
import { createLog } from "@/utils/logging"

export const forwarderTransferShipmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(forwarderTransferShipments)
      .innerJoin(
        shipments,
        eq(forwarderTransferShipments.shipmentId, shipments.id),
      )

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

      if (results.length === 0) return null
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
  getPreparing: protectedProcedure.query(async ({ ctx }) => {
    const agentUsers = alias(users, "agent_users")
    const driverUsers = alias(users, "driver_users")
    const results = await ctx.db
      .select()
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
        vehicles,
        eq(forwarderTransferShipments.vehicleId, vehicles.id),
      )
      .where(eq(shipments.status, "PREPARING"))

    return results.map(
      ({
        shipments,
        forwarder_transfer_shipments,
        agent_users,
        driver_users,
        vehicles,
      }) => {
        const { shipmentId, ...other } = forwarder_transfer_shipments

        return {
          ...shipments,
          ...other,
          agentDisplayName: agent_users.displayName,
          driverDisplayName: driver_users.displayName,
          driverContactNumber: driver_users.contactNumber,
          vehicleDisplayName: vehicles.displayName,
          vehicleType: vehicles.type,
        }
      },
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
        createdById: ctx.user.uid,
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
      const result = await ctx.db
        .update(shipments)
        .set({
          status: "COMPLETED",
        })
        .where(eq(shipments.id, input.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "TRANSFER_FORWARDER_SHIPMENT",
        createdById: ctx.user.uid,
      })

      return result
    }),
  create: protectedProcedure
    .input(
      z.object({
        sentToAgentId: z.string().length(28),
        driverId: z.string().length(28),
        vehicleId: z.number(),
        packageIds: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [{ insertId: shipmentId }] = await ctx.db.insert(shipments).values({
        type: "TRANSFER_FORWARDER",
        status: "PREPARING",
      })

      await ctx.db.insert(forwarderTransferShipments).values({
        shipmentId,
        sentToAgentId: input.sentToAgentId,
        driverId: input.driverId,
        vehicleId: input.vehicleId,
      })

      for (const packageId of input.packageIds) {
        await ctx.db.insert(shipmentPackages).values({
          packageId,
          shipmentId,
          status: "PREPARING",
        })

        await ctx.db
          .update(packages)
          .set({
            status: "SORTING",
          })
          .where(eq(packages.id, packageId))

        await ctx.db.insert(packageStatusLogs).values({
          packageId,
          createdById: ctx.user.uid,
          status: "SORTING",
          description: getDescriptionForNewPackageStatusLog({
            status: "SORTING",
          }),
          createdAt: new Date(),
        })
      }

      await createLog(ctx.db, {
        verb: "CREATE",
        entity: "TRANSFER_FORWARDER_SHIPMENT",
        createdById: ctx.user.uid,
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
        createdById: ctx.user.uid,
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
          eq(forwarderTransferShipments.sentToAgentId, ctx.user.uid),
          eq(shipments.status, "IN_TRANSIT"),
        ),
      )

    return {
      count: value,
    }
  }),
})

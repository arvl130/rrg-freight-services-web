import { z } from "zod"
import { protectedProcedure, router } from "../../trpc"
import {
  shipments,
  shipmentPackages,
  warehouseTransferShipments,
  packageStatusLogs,
  packages,
  warehouses,
  users,
  vehicles,
  assignedDrivers,
  assignedVehicles,
  webpushSubscriptions,
  expopushTokens,
} from "@/server/db/schema"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { TRPCError } from "@trpc/server"
import { and, eq, getTableColumns, inArray, like } from "drizzle-orm"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"
import { notifyByExpoPush, notifyByWebPush } from "@/server/notification"
import { alias } from "drizzle-orm/mysql-core"

export const warehouseTransferShipmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const shipmentColumns = getTableColumns(shipments)
    const { shipmentId, ...warehouseTransferShipmentColumns } = getTableColumns(
      warehouseTransferShipments,
    )

    const originWarehouses = alias(warehouses, "origin_warehouses")
    const destinationWarehouses = alias(warehouses, "destination_warehouses")

    return await ctx.db
      .select({
        ...shipmentColumns,
        ...warehouseTransferShipmentColumns,
        originWarehouseDisplayName: originWarehouses.displayName,
        destinationWarehouseDisplayName: destinationWarehouses.displayName,
      })
      .from(warehouseTransferShipments)
      .innerJoin(
        shipments,
        eq(warehouseTransferShipments.shipmentId, shipments.id),
      )
      .innerJoin(
        originWarehouses,
        eq(
          warehouseTransferShipmentColumns.sentFromWarehouseId,
          originWarehouses.id,
        ),
      )
      .innerJoin(
        destinationWarehouses,
        eq(
          warehouseTransferShipmentColumns.sentToWarehouseId,
          destinationWarehouses.id,
        ),
      )
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
        .from(warehouseTransferShipments)
        .innerJoin(
          shipments,
          eq(warehouseTransferShipments.shipmentId, shipments.id),
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

      const { warehouse_transfer_shipments } = results[0]
      const { shipmentId, ...other } = warehouse_transfer_shipments

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
      const shipmentColumns = getTableColumns(shipments)
      const { shipmentId, ...warehouseTransferShipmentColumns } =
        getTableColumns(warehouseTransferShipments)

      return await ctx.db
        .selectDistinct({
          ...shipmentColumns,
          ...warehouseTransferShipmentColumns,
          warehouseDisplayName: warehouses.displayName,
          driverDisplayName: users.displayName,
          driverContactNumber: users.contactNumber,
          vehicleDisplayName: vehicles.displayName,
          vehicleType: vehicles.type,
        })
        .from(shipmentPackages)
        .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
        .innerJoin(
          warehouseTransferShipments,
          eq(
            shipmentPackages.shipmentId,
            warehouseTransferShipments.shipmentId,
          ),
        )
        .innerJoin(
          shipments,
          eq(warehouseTransferShipments.shipmentId, shipments.id),
        )
        .innerJoin(
          warehouses,
          eq(warehouseTransferShipments.sentToWarehouseId, warehouses.id),
        )
        .innerJoin(users, eq(warehouseTransferShipments.driverId, users.id))
        .innerJoin(
          vehicles,
          eq(warehouseTransferShipments.vehicleId, vehicles.id),
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
  getInTransit: protectedProcedure
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
      const shipmentColumns = getTableColumns(shipments)
      const { shipmentId, ...warehouseTransferShipmentColumns } =
        getTableColumns(warehouseTransferShipments)

      return await ctx.db
        .selectDistinct({
          ...shipmentColumns,
          ...warehouseTransferShipmentColumns,
          warehouseDisplayName: warehouses.displayName,
        })
        .from(shipmentPackages)
        .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
        .innerJoin(
          warehouseTransferShipments,
          eq(
            shipmentPackages.shipmentId,
            warehouseTransferShipments.shipmentId,
          ),
        )
        .innerJoin(
          shipments,
          eq(warehouseTransferShipments.shipmentId, shipments.id),
        )
        .innerJoin(
          warehouses,
          eq(warehouseTransferShipments.sentToWarehouseId, warehouses.id),
        )
        .where(
          and(
            eq(shipments.status, "IN_TRANSIT"),
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
        entity: "TRANSFER_WAREHOUSE_SHIPMENT",
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
        const [warehouseTransferShipment] = await tx
          .select()
          .from(warehouseTransferShipments)
          .where(eq(warehouseTransferShipments.shipmentId, input.id))

        await tx
          .update(shipments)
          .set({
            status: "COMPLETED",
          })
          .where(eq(shipments.id, input.id))

        await tx
          .delete(assignedDrivers)
          .where(
            eq(assignedDrivers.driverId, warehouseTransferShipment.driverId),
          )

        await tx
          .delete(assignedVehicles)
          .where(
            eq(assignedVehicles.vehicleId, warehouseTransferShipment.vehicleId),
          )

        await createLog(tx, {
          verb: "UPDATE",
          entity: "TRANSFER_WAREHOUSE_SHIPMENT",
          createdById: ctx.user.id,
        })
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        driverId: z.string().length(28),
        vehicleId: z.number(),
        sentToWarehouseId: z.number(),
        sentFromWarehouseId: z.number(),
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
            type: "TRANSFER_WAREHOUSE",
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

        await ctx.db.insert(warehouseTransferShipments).values({
          shipmentId,
          driverId: input.driverId,
          vehicleId: input.vehicleId,
          sentFromWarehouseId: input.sentFromWarehouseId,
          sentToWarehouseId: input.sentToWarehouseId,
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
          entity: "TRANSFER_WAREHOUSE_SHIPMENT",
          createdById: ctx.user.id,
        })

        if (webPushSubscriptionResults.length > 0)
          await notifyByWebPush({
            subscriptions: webPushSubscriptionResults,
            title: "New warehouse transfer assigned",
            body: `Warehouse transfer with ID ${shipmentId} has been assigned to you.`,
          })

        if (expoPushTokenResults.length > 0)
          await notifyByExpoPush({
            to: expoPushTokenResults.map((token) => token.data),
            title: "New warehouse transfer assigned",
            body: `Warehouse transfer with ID ${shipmentId} has been assigned to you.`,
          })
      })
    }),
  updateDetailsById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        driverId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(warehouseTransferShipments)
        .set({
          driverId: input.driverId,
        })
        .where(eq(warehouseTransferShipments.shipmentId, input.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "TRANSFER_WAREHOUSE_SHIPMENT",
        createdById: ctx.user.id,
      })
    }),
})

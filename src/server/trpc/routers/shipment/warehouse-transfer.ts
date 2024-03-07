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
} from "@/server/db/schema"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"

export const warehouseTransferShipmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(warehouseTransferShipments)
      .innerJoin(
        shipments,
        eq(warehouseTransferShipments.shipmentId, shipments.id),
      )

    return results.map(({ shipments, warehouse_transfer_shipments }) => {
      const { shipmentId, ...other } = warehouse_transfer_shipments

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
        .from(warehouseTransferShipments)
        .innerJoin(
          shipments,
          eq(warehouseTransferShipments.shipmentId, shipments.id),
        )
        .where(eq(shipments.id, input.id))

      if (results.length === 0) return null
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
  getPreparing: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(warehouseTransferShipments)
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
      .where(eq(shipments.status, "PREPARING"))

    return results.map(
      ({
        shipments,
        warehouse_transfer_shipments,
        warehouses,
        users,
        vehicles,
      }) => {
        const { shipmentId, ...other } = warehouse_transfer_shipments

        return {
          ...shipments,
          ...other,
          warehouseDisplayName: warehouses.displayName,
          driverDisplayName: users.displayName,
          driverContactNumber: users.contactNumber,
          vehicleDisplayName: vehicles.displayName,
          vehicleType: vehicles.type,
        }
      },
    )
  }),
  getInTransit: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(warehouseTransferShipments)
      .innerJoin(
        shipments,
        eq(warehouseTransferShipments.shipmentId, shipments.id),
      )
      .innerJoin(
        warehouses,
        eq(warehouseTransferShipments.sentToWarehouseId, warehouses.id),
      )
      .where(eq(shipments.status, "IN_TRANSIT"))

    return results.map(
      ({ shipments, warehouse_transfer_shipments, warehouses }) => {
        const { shipmentId, ...other } = warehouse_transfer_shipments

        return {
          ...shipments,
          ...other,
          warehouseDisplayName: warehouses.displayName,
        }
      },
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
        entity: "TRANSFER_WAREHOUSE_SHIPMENT",
        createdById: ctx.user.uid,
      })

      return result
    }),
  create: protectedProcedure
    .input(
      z.object({
        driverId: z.string().length(28),
        vehicleId: z.number(),
        sentToWarehouseId: z.number(),
        packageIds: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()
      const [{ insertId: shipmentId }] = await ctx.db.insert(shipments).values({
        type: "TRANSFER_WAREHOUSE",
        status: "PREPARING",
      })

      await ctx.db.insert(warehouseTransferShipments).values({
        shipmentId,
        driverId: input.driverId,
        vehicleId: input.vehicleId,
        sentToWarehouseId: input.sentToWarehouseId,
        createdAt,
      })

      for (const packageId of input.packageIds) {
        await ctx.db.insert(shipmentPackages).values({
          packageId,
          shipmentId,
          status: "PREPARING",
          createdAt,
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
          createdAt,
        })
      }

      await createLog(ctx.db, {
        verb: "CREATE",
        entity: "TRANSFER_WAREHOUSE_SHIPMENT",
        createdById: ctx.user.uid,
      })
    }),
})

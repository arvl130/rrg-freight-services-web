import { protectedProcedure, router } from "../../trpc"
import { deliveryShipmentRouter } from "./delivery"
import { incomingShipmentRouter } from "./incoming"
import { shipmentLocationRouter } from "./location"
import { forwarderTransferShipmentRouter } from "./forwarder-transfer"
import { warehouseTransferShipmentRouter } from "./warehouse-transfer"
import { shipmentPackageRouter } from "./shipment-package"
import { z } from "zod"
import { createLog } from "@/utils/logging"
import { eq, getTableColumns } from "drizzle-orm"
import {
  deliveryShipments,
  forwarderTransferShipments,
  incomingShipments,
  shipmentPackages,
  shipments,
  warehouseTransferShipments,
} from "@/server/db/schema"

export const shipmentRouter = router({
  delivery: deliveryShipmentRouter,
  incoming: incomingShipmentRouter,
  forwarderTransfer: forwarderTransferShipmentRouter,
  warehouseTransfer: warehouseTransferShipmentRouter,
  location: shipmentLocationRouter,
  package: shipmentPackageRouter,
  getAllTypesByPackageId: protectedProcedure
    .input(
      z.object({
        packageId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const shipmentColumns = getTableColumns(shipments)
      const { shipmentId: _, ...incomingShipmentColumns } =
        getTableColumns(incomingShipments)

      const { shipmentId: __, ...deliveryShipmentColumns } =
        getTableColumns(deliveryShipments)

      const { shipmentId: ___, ...forwarderTransferShipmentColumns } =
        getTableColumns(forwarderTransferShipments)

      const { shipmentId: ____, ...warehouseTransferShipmentColumns } =
        getTableColumns(warehouseTransferShipments)

      const incomingShipmentResults = await ctx.db
        .selectDistinct({
          ...shipmentColumns,
          ...incomingShipmentColumns,
        })
        .from(shipmentPackages)
        .innerJoin(shipments, eq(shipmentPackages.shipmentId, shipments.id))
        .innerJoin(
          incomingShipments,
          eq(shipmentPackages.shipmentId, incomingShipments.shipmentId),
        )
        .where(eq(shipmentPackages.packageId, input.packageId))

      const deliveryShipmentResults = await ctx.db
        .selectDistinct({
          ...shipmentColumns,
          ...deliveryShipmentColumns,
        })
        .from(shipmentPackages)
        .innerJoin(shipments, eq(shipmentPackages.shipmentId, shipments.id))
        .innerJoin(
          deliveryShipments,
          eq(shipmentPackages.shipmentId, deliveryShipments.shipmentId),
        )
        .where(eq(shipmentPackages.packageId, input.packageId))

      const forwarderTransferShipmentResults = await ctx.db
        .selectDistinct({
          ...shipmentColumns,
          ...forwarderTransferShipmentColumns,
        })
        .from(shipmentPackages)
        .innerJoin(shipments, eq(shipmentPackages.shipmentId, shipments.id))
        .innerJoin(
          forwarderTransferShipments,
          eq(
            shipmentPackages.shipmentId,
            forwarderTransferShipments.shipmentId,
          ),
        )
        .where(eq(shipmentPackages.packageId, input.packageId))

      const warehouseTransferShipmentResults = await ctx.db
        .selectDistinct({
          ...shipmentColumns,
          ...warehouseTransferShipmentColumns,
        })
        .from(shipmentPackages)
        .innerJoin(shipments, eq(shipmentPackages.shipmentId, shipments.id))
        .innerJoin(
          warehouseTransferShipments,
          eq(
            shipmentPackages.shipmentId,
            warehouseTransferShipments.shipmentId,
          ),
        )
        .where(eq(shipmentPackages.packageId, input.packageId))

      return {
        incomingShipments: incomingShipmentResults,
        deliveryShipments: deliveryShipmentResults,
        forwarderTransferShipments: forwarderTransferShipmentResults,
        warehouseTransferShipments: warehouseTransferShipmentResults,
      }
    }),
  archiveById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(shipments)
          .set({
            isArchived: 1,
          })
          .where(eq(shipments.id, input.id))

        await createLog(tx, {
          verb: "UPDATE",
          entity: "SHIPMENT",
          createdById: ctx.user.id,
        })
      })
    }),
  unarchiveById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(shipments)
          .set({
            isArchived: 0,
          })
          .where(eq(shipments.id, input.id))

        await createLog(tx, {
          verb: "UPDATE",
          entity: "SHIPMENT",
          createdById: ctx.user.id,
        })
      })
    }),
  getSentAgentIdByShipmentId: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const agentId = await ctx.db
        .select()
        .from(incomingShipments)
        .where(eq(incomingShipments.shipmentId, input.id))

      return agentId[0].sentByAgentId
    }),
})

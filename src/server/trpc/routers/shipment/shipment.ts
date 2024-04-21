import { protectedProcedure, router } from "../../trpc"
import { deliveryShipmentRouter } from "./delivery"
import { incomingShipmentRouter } from "./incoming"
import { shipmentLocationRouter } from "./location"
import { forwarderTransferShipmentRouter } from "./forwarder-transfer"
import { warehouseTransferShipmentRouter } from "./warehouse-transfer"
import { shipmentPackageRouter } from "./shipment-package"
import { z } from "zod"
import { createLog } from "@/utils/logging"
import { eq } from "drizzle-orm"
import { shipments } from "@/server/db/schema"

export const shipmentRouter = router({
  delivery: deliveryShipmentRouter,
  incoming: incomingShipmentRouter,
  forwarderTransfer: forwarderTransferShipmentRouter,
  warehouseTransfer: warehouseTransferShipmentRouter,
  location: shipmentLocationRouter,
  package: shipmentPackageRouter,
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
})

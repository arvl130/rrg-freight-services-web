import { eq, isNull, inArray } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { vehicles, shipments, deliveryShipments } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const vehicleRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(vehicles)
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
        .from(vehicles)
        .where(eq(vehicles.id, input.id))

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      return results[0]
    }),
  getAvailable: protectedProcedure.query(async ({ ctx }) => {
    // FIXME: This db query should also consider transfers in progress.
    const deliveriesInProgress = ctx.db
      .select()
      .from(shipments)
      .innerJoin(
        deliveryShipments,
        eq(shipments.id, deliveryShipments.shipmentId),
      )
      .where(inArray(shipments.status, ["PREPARING", "IN_TRANSIT"]))
      .as("deliveries_in_progress")

    const results = await ctx.db
      .select()
      .from(vehicles)
      .leftJoin(
        deliveriesInProgress,
        eq(vehicles.id, deliveriesInProgress.delivery_shipments.vehicleId),
      )
      .where(isNull(deliveriesInProgress.shipments.id))

    return results.map(({ vehicles }) => vehicles)
  }),
})

import { desc, eq, inArray } from "drizzle-orm"
import { publicProcedure, router } from "../../trpc"
import { shipmentLocations } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const shipmentLocationRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(shipmentLocations)
  }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(shipmentLocations)
        .where(eq(shipmentLocations.id, input.id))

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
  getByShipmentId: publicProcedure
    .input(
      z.object({
        shipmentId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(shipmentLocations)
        .where(eq(shipmentLocations.shipmentId, input.shipmentId))
        .orderBy(desc(shipmentLocations.createdAt))
    }),
  getByShipmentIds: publicProcedure
    .input(
      z.object({
        shipmentIds: z.number().array(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.shipmentIds.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "One or more shipment ids must be specified.",
        })
      }

      return await ctx.db
        .select()
        .from(shipmentLocations)
        .where(inArray(shipmentLocations.shipmentId, input.shipmentIds))
        .orderBy(desc(shipmentLocations.createdAt))
    }),
})

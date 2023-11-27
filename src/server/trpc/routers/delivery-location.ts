import { desc, eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { deliveryLocations } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const deliveryLocationRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(deliveryLocations)
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
        .from(deliveryLocations)
        .where(eq(deliveryLocations.id, input.id))

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
  getByDeliveryId: protectedProcedure
    .input(
      z.object({
        deliveryId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(deliveryLocations)
        .where(eq(deliveryLocations.deliveryId, input.deliveryId))
        .orderBy(desc(deliveryLocations.createdAt))
    }),
})

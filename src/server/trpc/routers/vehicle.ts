import { eq, isNull, inArray } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { vehicles, deliveries } from "@/server/db/schema"
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
    const deliveriesInProgress = ctx.db
      .select()
      .from(deliveries)
      .where(inArray(deliveries.status, ["PREPARING", "IN_TRANSIT"]))
      .as("deliveries_in_progress")

    const results = await ctx.db
      .select()
      .from(vehicles)
      .leftJoin(
        deliveriesInProgress,
        eq(vehicles.id, deliveriesInProgress.vehicleId),
      )
      .where(isNull(deliveriesInProgress.id))

    return results.map(({ vehicles }) => vehicles)
  }),
})

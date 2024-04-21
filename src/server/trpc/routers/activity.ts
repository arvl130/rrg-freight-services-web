import { eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { activities, users } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const activityRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(activities)
      .innerJoin(users, eq(activities.createdById, users.id))

    return results.map(({ activities, users }) => {
      return {
        ...activities,
        createdByDisplayName: users.displayName,
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
        .from(activities)
        .where(eq(activities.id, input.id))

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
  archiveById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(activities)
        .set({
          isArchived: 1,
        })
        .where(eq(activities.id, input.id))
    }),
  unarchiveById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(activities)
        .set({
          isArchived: 0,
        })
        .where(eq(activities.id, input.id))
    }),
})

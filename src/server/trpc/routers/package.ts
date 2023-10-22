import { and, eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { packageStatusLogs, packages } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const packageRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(packages)
  }),
  getLatestStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(packageStatusLogs)
        .where(eq(packageStatusLogs.packageId, input.id))

      if (results.length === 0) return null

      let latestStatus = results[0]
      for (const result of results) {
        if (result.createdAt.getTime() > latestStatus.createdAt.getTime())
          latestStatus = result
      }

      return latestStatus
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(packages)
        .where(eq(packages.id, input.id))

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
})

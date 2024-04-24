import { z } from "zod"
import { protectedProcedure, router } from "../trpc"
import { provinces } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

export const provinceRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(provinces)
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(provinces)
        .where(eq(provinces.provinceId, input.id))

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

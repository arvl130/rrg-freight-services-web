import { eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { cities } from "@/server/db/schema"
import { z } from "zod"

export const cityRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(cities)
  }),
  getByProvinceId: protectedProcedure
    .input(
      z.object({
        provinceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(cities)
        .where(eq(cities.provinceId, input.provinceId))
    }),
})

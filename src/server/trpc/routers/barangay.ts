import { and, eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { barangays } from "@/server/db/schema"
import { z } from "zod"

export const barangayRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(barangays)
  }),
  getByProvinceIdAndCityId: protectedProcedure
    .input(
      z.object({
        provinceId: z.string(),
        cityId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(barangays)
        .where(
          and(
            eq(barangays.provinceId, input.provinceId),
            eq(barangays.cityId, input.provinceId),
          ),
        )
    }),
})

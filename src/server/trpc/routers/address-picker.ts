import { and, eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { cities, provinces, barangays } from "@/server/db/schema"
import { z } from "zod"

export const addressPickerRouter = router({
  getAllProvinces: protectedProcedure.query(async ({ ctx, input }) => {
    const provinceResults = await ctx.db
      .select()
      .from(provinces)
      .orderBy(provinces.name)
    return provinceResults
  }),
  getAllCitiesByProvinceId: protectedProcedure
    .input(
      z.object({
        provinceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cityResults = await ctx.db
        .select()
        .from(cities)
        .orderBy(cities.name)
        .where(eq(cities.provinceId, input.provinceId))
      return cityResults
    }),
  getAllBarangayByCityId: protectedProcedure
    .input(
      z.object({
        cityId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const barangaysResults = await ctx.db
        .select()
        .from(barangays)
        .orderBy(barangays.name)
        .where(eq(barangays.cityId, input.cityId))
      return barangaysResults
    }),
})

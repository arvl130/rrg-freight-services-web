import { and, eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { barangays, cities, provinces } from "@/server/db/schema"
import { z } from "zod"
import { TRPCError } from "@trpc/server"

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
            eq(barangays.cityId, input.cityId),
          ),
        )
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
        .from(barangays)
        .where(eq(barangays.code, input.id))

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      const [matchedBarangay] = results
      const [matchedProvince] = await ctx.db
        .select()
        .from(provinces)
        .where(eq(provinces.provinceId, matchedBarangay.provinceId))

      const [matchedCity] = await ctx.db
        .select()
        .from(cities)
        .where(eq(cities.cityId, matchedBarangay.cityId))

      return {
        ...matchedBarangay,
        provinceName: matchedProvince.name,
        cityName: matchedCity.name,
      }
    }),
})

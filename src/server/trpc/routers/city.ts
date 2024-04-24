import { eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { cities, provinces } from "@/server/db/schema"
import { z } from "zod"
import { TRPCError } from "@trpc/server"

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
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(cities)
        .where(eq(cities.cityId, input.id))

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      const [matchedCity] = results
      const [matchedProvince] = await ctx.db
        .select()
        .from(provinces)
        .where(eq(provinces.provinceId, matchedCity.provinceId))

      return {
        ...matchedCity,
        provinceName: matchedProvince.name,
      }
    }),
})

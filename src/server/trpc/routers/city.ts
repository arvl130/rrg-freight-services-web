import { and, eq, sql } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { cities, packages, provinces } from "@/server/db/schema"
import { z } from "zod"
import { TRPCError } from "@trpc/server"
import type { PackageShippingType } from "@/utils/constants"
import { SUPPORTED_PACKAGE_SHIPPING_TYPES } from "@/utils/constants"

export const cityRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(cities)
      .orderBy(cities.name)
      .innerJoin(provinces, eq(provinces.provinceId, cities.provinceId))
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
  getHasPackagesToBeDelivered: protectedProcedure
    .input(
      z.object({
        warehouseId: z.number(),
        deliveryType: z.custom<PackageShippingType>((val) =>
          SUPPORTED_PACKAGE_SHIPPING_TYPES.includes(val as PackageShippingType),
        ),
      }),
    )
    .query(async ({ ctx, input }) => {
      const inWarehousePackageAreaCodes = await ctx.db
        .selectDistinct({
          areaCode: sql<string>`substring(${packages.areaCode},1,6)`,
          cityName: cities.name,
        })
        .from(packages)
        .innerJoin(
          cities,
          eq(sql<string>`substring(${packages.areaCode},1,6)`, cities.cityId),
        )
        .where(
          and(
            eq(packages.receptionMode, "DOOR_TO_DOOR"),
            eq(packages.lastWarehouseId, input.warehouseId),
            eq(packages.shippingType, input.deliveryType),
            eq(packages.isDeliverable, 1),
            eq(packages.status, "IN_WAREHOUSE"),
          ),
        )

      return inWarehousePackageAreaCodes
    }),
})

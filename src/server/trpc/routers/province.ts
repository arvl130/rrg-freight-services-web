import { z } from "zod"
import { protectedProcedure, router } from "../trpc"
import { packages, provinces } from "@/server/db/schema"
import { and, eq, sql } from "drizzle-orm"
import { TRPCError } from "@trpc/server"
import type { PackageShippingType } from "@/utils/constants"
import { SUPPORTED_PACKAGE_SHIPPING_TYPES } from "@/utils/constants"

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
          areaCode: sql<string>`substring(${packages.areaCode},1,4)`,
          provinceName: provinces.name,
        })
        .from(packages)
        .innerJoin(
          provinces,
          eq(
            sql<string>`substring(${packages.areaCode},1,4)`,
            provinces.provinceId,
          ),
        )
        .where(
          and(
            eq(packages.lastWarehouseId, input.warehouseId),
            eq(packages.shippingType, input.deliveryType),
            eq(packages.isDeliverable, 1),
            eq(packages.status, "IN_WAREHOUSE"),
          ),
        )

      return inWarehousePackageAreaCodes
    }),
})

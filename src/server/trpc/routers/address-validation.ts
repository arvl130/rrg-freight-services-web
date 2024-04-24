import { and, eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { cities, provinces, barangays } from "@/server/db/schema"
import { z } from "zod"

export const addressValidationRouter = router({
  getValidityByName: protectedProcedure
    .input(
      z.object({
        provinceName: z.string().trim(),
        cityName: z.string().trim(),
        barangayName: z.string().trim(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const provinceResults = await ctx.db
        .select()
        .from(provinces)
        .where(eq(provinces.name, input.provinceName))

      if (provinceResults.length === 0) {
        return {
          province: {
            isValid: false,
            matchedNames: [],
          },
          city: {
            isValid: false,
            matchedNames: [],
          },
          barangay: {
            isValid: false,
            matchedNames: [],
          },
        }
      }

      if (provinceResults.length > 1) {
        return {
          province: {
            isValid: false,
            matchedNames: provinceResults.map(({ name }) => name),
          },
          city: {
            isValid: false,
            matchedNames: [],
          },
          barangay: {
            isValid: false,
            matchedNames: [],
          },
        }
      }

      const provinceValidity = {
        isValid: true,
        matchedNames: provinceResults[0].name,
      }

      const cityResults = await ctx.db
        .select()
        .from(cities)
        .where(
          and(
            eq(cities.provinceId, provinceResults[0].provinceId),
            eq(cities.name, input.cityName),
          ),
        )

      if (cityResults.length === 0) {
        return {
          province: provinceValidity,
          city: {
            isValid: false,
            matchedNames: [],
          },
          barangay: {
            isValid: false,
            matchedNames: [],
          },
        }
      }

      if (cityResults.length > 1) {
        return {
          province: provinceValidity,
          city: {
            isValid: false,
            matchedNames: cityResults.map(({ name }) => name),
          },
          barangay: {
            isValid: false,
            matchedNames: [],
          },
        }
      }

      const cityValidity = {
        isValid: true,
        matchedNames: cityResults[0].name,
      }

      const barangayResults = await ctx.db
        .select()
        .from(barangays)
        .where(
          and(
            eq(barangays.provinceId, provinceResults[0].provinceId),
            eq(barangays.cityId, cityResults[0].cityId),
            eq(barangays.name, input.barangayName),
          ),
        )

      if (barangayResults.length === 0) {
        return {
          province: provinceValidity,
          city: cityValidity,
          barangay: {
            isValid: false,
            matchedNames: [],
          },
        }
      }

      if (barangayResults.length > 1) {
        return {
          province: provinceValidity,
          city: cityValidity,
          barangay: {
            isValid: false,
            matchedNames: barangayResults.map(({ name }) => name),
          },
        }
      }

      const barangayValidity = {
        isValid: true,
        matchedNames: barangayResults[0].name,
      }

      return {
        province: provinceValidity,
        city: cityValidity,
        barangay: barangayValidity,
      }
    }),
})

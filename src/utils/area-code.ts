import type { DbWithEntities } from "@/server/db/entities"
import { barangays, cities, provinces } from "@/server/db/schema"
import { and, eq } from "drizzle-orm"

export async function getAreaCode({
  db,
  provinceName,
  cityName,
  barangayName,
}: {
  db: DbWithEntities
  provinceName: string
  cityName: string
  barangayName: string
}) {
  const [matchedProvince] = await db
    .select()
    .from(provinces)
    .where(eq(provinces.name, provinceName))

  const [matchedCity] = await db
    .select()
    .from(cities)
    .where(
      and(
        eq(cities.provinceId, matchedProvince.provinceId),
        eq(cities.name, cityName),
      ),
    )

  const [matchedBarangay] = await db
    .select()
    .from(barangays)
    .where(
      and(
        eq(barangays.provinceId, matchedProvince.provinceId),
        eq(barangays.cityId, matchedCity.cityId),
        eq(barangays.name, barangayName),
      ),
    )

  return matchedBarangay.code
}

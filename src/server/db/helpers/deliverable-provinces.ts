import { getTableColumns } from "drizzle-orm"
import type { DbWithEntities } from "../entities"
import { deliverableProvinces } from "../schema"

export async function getDeliverableProvinceNames(options: {
  db: DbWithEntities
}) {
  const { displayName, ...other } = getTableColumns(deliverableProvinces)
  const results = await options.db
    .select({
      displayName,
    })
    .from(deliverableProvinces)

  return results.map(({ displayName }) => displayName.toUpperCase())
}

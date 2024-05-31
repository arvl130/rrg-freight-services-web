import { activities } from "@/server/db/schema"
import type { ActivityEntity, ActivityVerb } from "./constants"
import { DateTime } from "luxon"
import type { DbWithEntities } from "@/server/db/entities"

export async function createLog(
  db: DbWithEntities,
  options: { verb: ActivityVerb; entity: ActivityEntity; createdById: string },
) {
  await db.insert(activities).values({
    verb: options.verb,
    entity: options.entity,
    createdById: options.createdById,
    createdAt: DateTime.now().toISO(),
  })
}

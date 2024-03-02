import type * as schema from "@/server/db/schema"
import { activities } from "@/server/db/schema"
import type { MySql2Database } from "drizzle-orm/mysql2"
import type { ActivityEntity, ActivityVerb } from "./constants"
import { DateTime } from "luxon"

export async function createLog(
  db: MySql2Database<typeof schema>,
  options: { verb: ActivityVerb; entity: ActivityEntity; createdById: string },
) {
  await db.insert(activities).values({
    verb: options.verb,
    entity: options.entity,
    createdById: options.createdById,
    createdAt: DateTime.now().toISO(),
  })
}

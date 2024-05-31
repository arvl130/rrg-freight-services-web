import pg from "pg"
import { serverEnv } from "../env.mjs"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"
import type { DbWithEntities } from "./entities"

const poolConnection = new pg.Pool({
  connectionString:
    serverEnv.APP_ENV === "production"
      ? serverEnv.PROD_DATABASE_URL
      : serverEnv.DEV_DATABASE_URL,
})

const globalForDrizzle = globalThis as unknown as {
  db: DbWithEntities
}

export const db =
  globalForDrizzle.db ||
  drizzle(poolConnection, {
    schema,
  })

if (process.env.NODE_ENV !== "production") globalForDrizzle.db = db

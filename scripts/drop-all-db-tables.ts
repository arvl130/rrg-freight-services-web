import "dotenv/config"
import pg from "pg"
import { serverEnv } from "@/server/env.mjs"
import * as schema from "@/server/db/schema"

const pool = new pg.Pool({
  connectionString:
    serverEnv.APP_ENV === "production"
      ? serverEnv.PROD_DATABASE_URL
      : serverEnv.DEV_DATABASE_URL,
})

const tableNames = Object.keys(schema)
  // Filter out relations.
  .filter((key) => !key.endsWith("Relations"))
  // Convert camel case to snake case.
  .map((key) => key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`))

await Promise.all(
  tableNames.map((tableName) =>
    pool.query(`DROP TABLE IF EXISTS ${tableName}`),
  ),
)
await pool.end()

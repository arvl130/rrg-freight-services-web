import mysql from "mysql2/promise"
import { serverEnv } from "../env.mjs"
import { MySql2Database, drizzle } from "drizzle-orm/mysql2"
import * as schema from "./schema"

const poolConnection = mysql.createPool({
  uri:
    serverEnv.APP_ENV === "production"
      ? serverEnv.PROD_DATABASE_URL
      : serverEnv.DEV_DATABASE_URL,
})

const globalForDrizzle = globalThis as unknown as {
  db: MySql2Database<typeof schema>
}

export const db =
  globalForDrizzle.db ||
  drizzle(poolConnection, {
    mode:
      serverEnv.APP_ENV === "production"
        ? serverEnv.PROD_DATABASE_MODE
        : serverEnv.DEV_DATABASE_MODE,
    schema,
  })

if (process.env.NODE_ENV !== "production") globalForDrizzle.db = db

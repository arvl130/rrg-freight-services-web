import mysql from "mysql2/promise"
import { serverEnv } from "../env"
import { drizzle } from "drizzle-orm/mysql2"
import * as schema from "./schema"

const poolConnection = mysql.createPool({
  host: serverEnv.DATABASE_HOST,
  user: serverEnv.DATABASE_USER,
  password: serverEnv.DATABASE_PASS,
  database: serverEnv.DATABASE_NAME,
})

export const db = drizzle(poolConnection, {
  mode: "default",
  schema,
})

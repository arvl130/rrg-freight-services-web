import mysql from "mysql2/promise"
import { serverEnv } from "../env"
import { drizzle } from "drizzle-orm/mysql2"
import * as schema from "./schema"

const poolConnection = mysql.createPool({
  uri: serverEnv.DATABASE_URL,
})

export const db = drizzle(poolConnection, {
  mode: serverEnv.DATABASE_MODE,
  schema,
})

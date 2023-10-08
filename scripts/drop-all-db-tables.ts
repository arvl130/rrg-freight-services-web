import "dotenv/config"
import mysql from "mysql2/promise"
import { serverEnv } from "@/server/env"

const poolConnection = mysql.createPool({
  uri: serverEnv.DATABASE_URL,
})

const tables = ["packages", "manifests", "activities", "users"]

await Promise.all(
  tables.map((table) => poolConnection.execute(`DROP TABLE IF EXISTS ${table}`))
)
await poolConnection.end()

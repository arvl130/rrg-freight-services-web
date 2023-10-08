import "dotenv/config"
import mysql from "mysql2/promise"
import { serverEnv } from "@/server/env"

const poolConnection = mysql.createPool({
  uri: serverEnv.DATABASE_URL,
})

await poolConnection.execute(`DROP TABLE IF EXISTS packages`)
await poolConnection.execute(`DROP TABLE IF EXISTS manifests`)
await poolConnection.execute(`DROP TABLE IF EXISTS activities`)
await poolConnection.execute(`DROP TABLE IF EXISTS users`)
await poolConnection.end()

import "dotenv/config"
import mysql from "mysql2/promise"
import { serverEnv } from "@/server/env"

const connection = await mysql.createConnection({
  uri: serverEnv.DATABASE_URL,
})

await connection.execute(`DROP TABLE IF EXISTS packages`)
await connection.execute(`DROP TABLE IF EXISTS manifests`)
await connection.execute(`DROP TABLE IF EXISTS activities`)
await connection.execute(`DROP TABLE IF EXISTS users`)
await connection.end()

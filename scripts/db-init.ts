import "dotenv/config"
import mysql from "mysql2/promise"
import { serverEnv } from "@/server/env"

const dbUrl = new URL(serverEnv.DATABASE_URL)
const dbName = dbUrl.pathname.substring(1)
const connection = await mysql.createConnection({
  host: dbUrl.host,
  user: dbUrl.username,
  password: dbUrl.password,
})

console.log("Initializing database...")
await connection.execute(`DROP DATABASE IF EXISTS ${dbName}`)
await connection.execute(`CREATE DATABASE ${dbName}`)
await connection.end()

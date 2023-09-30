import "dotenv/config"
import mysql from "mysql2/promise"

async function main() {
  const dbUrl = new URL(process.env.DATABASE_URL)
  const dbName = dbUrl.pathname.substring(1)
  const connection = await mysql.createConnection({
    host: dbUrl.host,
    user: dbUrl.username,
    password: dbUrl.password,
  })

  console.log("Initializing...")
  await connection.execute(`DROP DATABASE IF EXISTS ${dbName}`)
  await connection.execute(`CREATE DATABASE ${dbName}`)
  await connection.end()
}

main()

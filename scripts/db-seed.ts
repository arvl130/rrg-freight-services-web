import "dotenv/config"
import { serverEnv } from "@/server/env.mjs"
import { seedEnv } from "./env.mjs"
import * as schema from "@/server/db/schema"
import mysql from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"
import { NewUser } from "@/server/db/entities"

const pool = mysql.createPool({
  uri: serverEnv.DATABASE_URL,
})

const db = drizzle(pool, {
  mode: serverEnv.DATABASE_MODE,
  schema,
})

const newUsers: NewUser[] = [
  {
    id: seedEnv.TEST_ADMIN_USER_ID,
    displayName: "Administrator",
    contactNumber: "+639123456789",
    emailAddress: seedEnv.TEST_ADMIN_EMAIL,
    role: "ADMIN",
    gender: "MALE",
    isEnabled: 1,
  },
  {
    id: seedEnv.TEST_WAREHOUSE_USER_ID,
    displayName: "Warehouse Staff",
    contactNumber: "+639987654321",
    emailAddress: seedEnv.TEST_WAREHOUSE_EMAIL,
    role: "WAREHOUSE",
    gender: "MALE",
    isEnabled: 1,
  },
  {
    id: seedEnv.TEST_DOMESTIC_USER_ID,
    displayName: "Domestic Agent",
    contactNumber: "+639112223333",
    emailAddress: seedEnv.TEST_DOMESTIC_EMAIL,
    role: "DOMESTIC_AGENT",
    gender: "MALE",
    isEnabled: 1,
  },
  {
    id: seedEnv.TEST_OVERSEAS_USER_ID,
    displayName: "Overseas Agent",
    contactNumber: "+1112223333",
    emailAddress: seedEnv.TEST_OVERSEAS_EMAIL,
    role: "OVERSEAS_AGENT",
    gender: "FEMALE",
    isEnabled: 1,
  },
]

await db.insert(schema.users).values(newUsers)
await pool
  .end()
  .then(() => console.log("[\x1b[32m%s\x1b[0m] Database seeded", "✓"))

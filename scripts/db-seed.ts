import "dotenv/config"
import { serverEnv } from "@/server/env"
import * as schema from "@/server/db/schema"
import mysql from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"
import { NewPackage, NewPackageStatusLog } from "@/server/db/entities"
import { DateTime } from "luxon"

const pool = mysql.createPool({
  uri: serverEnv.DATABASE_URL,
})

const db = drizzle(pool, {
  mode: serverEnv.DATABASE_MODE,
  schema,
})

const newPackages: NewPackage[] = [
  {
    id: 10_000,
    shipmentId: 20_000,
    shippingParty: "FIRST_PARTY",
    shippingMode: "SEA",
    shippingType: "STANDARD",
    receptionMode: "DOOR_TO_DOOR",
    weightInKg: 50,
    senderFullName: "Phineas Flynn",
    senderContactNumber: "+1123456789",
    senderEmailAddress: "phineasflynn@example.com",
    senderStreetAddress: "2308 Maple Drive",
    senderCity: "Tri-State Area",
    senderStateOrProvince: "Unknown State",
    senderCountryCode: "USA",
    senderPostalCode: 1111,
    receiverFullName: "Ferb Fletcher",
    receiverContactNumber: "+639123456789",
    receiverEmailAddress: "ferbfletcher@example.com",
    receiverStreetAddress: "123 Street",
    receiverBarangay: "San Bartolome",
    receiverCity: "Quezon City",
    receiverStateOrProvince: "National Capital Region",
    receiverCountryCode: "PHL",
    receiverPostalCode: 2222,
    createdById: serverEnv.TEST_USER_ID_WAREHOUSE,
    updatedById: serverEnv.TEST_USER_ID_WAREHOUSE,
  },
]

const now = DateTime.now()
const dateNow = now.toJSDate()
const dateFiveMinsAgo = now
  .minus({
    minutes: 5,
  })
  .toJSDate()

const newPackageStatusLogs: NewPackageStatusLog[] = [
  {
    id: 30_000,
    packageId: 10_000,
    status: "PENDING",
    description: "Package created.",
    createdAt: dateFiveMinsAgo,
  },
  {
    id: 30_001,
    packageId: 10_000,
    status: "PREPARED_BY_AGENT",
    description: "Package has been prepared by agent.",
    createdAt: dateNow,
  },
]

await db.insert(schema.packages).values(newPackages)
await db.insert(schema.packageStatusLogs).values(newPackageStatusLogs)
await pool
  .end()
  .then(() => console.log("[\x1b[32m%s\x1b[0m] Database seeded", "✓"))

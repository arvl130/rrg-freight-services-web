import "dotenv/config"
import { serverEnv } from "@/server/env.mjs"
import { seedEnv } from "./env.mjs"
import * as schema from "@/server/db/schema"
import mysql from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"
import {
  NewUser,
  NewPackage,
  NewPackageStatusLog,
  NewShipment,
  NewShipmentHub,
  NewShipmentStatusLog,
  NewShipmentHubAgent,
  NewShipmentPackage,
} from "@/server/db/entities"
import { DateTime } from "luxon"

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

const newShipmentHubs: NewShipmentHub[] = [
  {
    id: 1,
    displayName: "UAE Hub",
    streetAddress: "Villa 5 31st St.",
    city: "Dubai",
    stateOrProvince: "Dubai",
    countryCode: "ARE",
    postalCode: 5555,
    role: "SENDING",
    isMainHub: 0,
  },
  {
    id: 2,
    displayName: "Main Hub",
    streetAddress: "B1 L2 Sampaguita St.",
    city: "Quezon City",
    stateOrProvince: "National Capital Region",
    countryCode: "PHL",
    postalCode: 6666,
    role: "SENDING_RECEIVING",
    isMainHub: 1,
  },
  {
    id: 3,
    displayName: "Visayas Hub",
    streetAddress: "B5 L6 Kalachuchi St.",
    city: "Cebu City",
    stateOrProvince: "Cebu",
    countryCode: "PHL",
    postalCode: 7777,
    role: "RECEIVING",
    isMainHub: 0,
  },
]

const newShipmentHubAgents: NewShipmentHubAgent[] = [
  {
    shipmentHubId: 1,
    userId: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    shipmentHubId: 2,
    userId: seedEnv.TEST_ADMIN_USER_ID,
  },
  {
    shipmentHubId: 2,
    userId: seedEnv.TEST_WAREHOUSE_USER_ID,
  },
  {
    shipmentHubId: 3,
    userId: seedEnv.TEST_DOMESTIC_USER_ID,
  },
]

await db.insert(schema.users).values(newUsers)
await db.insert(schema.shipmentHubs).values(newShipmentHubs)
await db.insert(schema.shipmentHubAgents).values(newShipmentHubAgents)

await pool
  .end()
  .then(() => console.log("[\x1b[32m%s\x1b[0m] Database seeded", "✓"))

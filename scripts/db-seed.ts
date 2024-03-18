import "dotenv/config"
import { serverEnv } from "@/server/env.mjs"
import { seedEnv } from "./env.mjs"
import * as schema from "@/server/db/schema"
import mysql from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"
import type {
  NewPackageCategory,
  NewUser,
  NewVehicle,
  NewWarehouse,
} from "@/server/db/entities"
import { DateTime } from "luxon"
import { Scrypt } from "lucia"

const pool = mysql.createPool({
  uri:
    serverEnv.APP_ENV === "production"
      ? serverEnv.PROD_DATABASE_URL
      : serverEnv.DEV_DATABASE_URL,
})

const db = drizzle(pool, {
  mode:
    serverEnv.APP_ENV === "production"
      ? serverEnv.PROD_DATABASE_MODE
      : serverEnv.DEV_DATABASE_MODE,
  schema,
})

const scrypt = new Scrypt()
const adminPassword = await scrypt.hash(seedEnv.TEST_ADMIN_PASSWORD)
const warehousePassword = await scrypt.hash(seedEnv.TEST_WAREHOUSE_PASSWORD)
const domesticPassword = await scrypt.hash(seedEnv.TEST_DOMESTIC_PASSWORD)
const overseasPassword = await scrypt.hash(seedEnv.TEST_OVERSEAS_PASSWORD)
const driverPassword = await scrypt.hash(seedEnv.TEST_DRIVER_PASSWORD)
const createdAt = DateTime.now().toISO()

const newUsers: NewUser[] = [
  {
    id: seedEnv.TEST_ADMIN_USER_ID,
    displayName: "Administrator",
    contactNumber: "+639123456789",
    emailAddress: seedEnv.TEST_ADMIN_EMAIL,
    role: "ADMIN",
    gender: "MALE",
    isEnabled: 1,
    createdAt,
    hashedPassword: adminPassword,
  },
  {
    id: seedEnv.TEST_WAREHOUSE_USER_ID,
    displayName: "Warehouse Staff",
    contactNumber: "+639987654321",
    emailAddress: seedEnv.TEST_WAREHOUSE_EMAIL,
    role: "WAREHOUSE",
    gender: "MALE",
    isEnabled: 1,
    createdAt,
    hashedPassword: warehousePassword,
  },
  {
    id: seedEnv.TEST_DOMESTIC_USER_ID,
    displayName: "Domestic Agent",
    contactNumber: "+639112223333",
    emailAddress: seedEnv.TEST_DOMESTIC_EMAIL,
    role: "DOMESTIC_AGENT",
    gender: "MALE",
    isEnabled: 1,
    createdAt,
    hashedPassword: domesticPassword,
  },
  {
    id: seedEnv.TEST_OVERSEAS_USER_ID,
    displayName: "Overseas Agent",
    contactNumber: "+1112223333",
    emailAddress: seedEnv.TEST_OVERSEAS_EMAIL,
    role: "OVERSEAS_AGENT",
    gender: "FEMALE",
    isEnabled: 1,
    createdAt,
    hashedPassword: overseasPassword,
  },
  {
    id: seedEnv.TEST_DRIVER_USER_ID,
    displayName: "Driver 1",
    contactNumber: "+1112223333",
    emailAddress: seedEnv.TEST_DRIVER_EMAIL,
    role: "DRIVER",
    gender: "MALE",
    isEnabled: 1,
    createdAt,
    hashedPassword: driverPassword,
  },
]

const newWarehouses: NewWarehouse[] = [
  {
    id: 1,
    displayName: "Warehouse 1",
    createdAt,
  },
  {
    id: 2,
    displayName: "Warehouse 2",
    createdAt,
  },
]

const newVehicles: NewVehicle[] = [
  {
    id: 1,
    displayName: "Truck 1",
    type: "TRUCK",
    isExpressAllowed: 0,
    createdAt,
  },
  {
    id: 2,
    displayName: "Truck 2",
    type: "TRUCK",
    isExpressAllowed: 0,
    createdAt,
  },
  {
    id: 3,
    displayName: "Truck 3",
    type: "TRUCK",
    isExpressAllowed: 0,
    createdAt,
  },
  {
    id: 4,
    displayName: "Van 1",
    type: "VAN",
    isExpressAllowed: 1,
    createdAt,
  },
  {
    id: 5,
    displayName: "Van 2",
    type: "VAN",
    isExpressAllowed: 1,
    createdAt,
  },
]

const newPackageCategories: NewPackageCategory[] = [
  {
    id: 1,
    displayName: "Category 1",
    createdAt,
  },
  {
    id: 2,
    displayName: "Category 2",
    createdAt,
  },
  {
    id: 3,
    displayName: "Category 3",
    createdAt,
  },
]

await db.insert(schema.users).values(newUsers)
await db.insert(schema.vehicles).values(newVehicles)
await db.insert(schema.warehouses).values(newWarehouses)
await db.insert(schema.packageCategories).values(newPackageCategories)

await pool
  .end()
  .then(() => console.log("[\x1b[32m%s\x1b[0m] Database seeded", "✓"))

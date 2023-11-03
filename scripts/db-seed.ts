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

const newPackages: NewPackage[] = [
  {
    id: 10_000,
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
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
    updatedById: seedEnv.TEST_OVERSEAS_USER_ID,
    createdInHubId: 1,
  },
]

const now = DateTime.now()
const dateFiveMinsAgo = now
  .minus({
    minutes: 5,
  })
  .toJSDate()
const dateTenMinsAgo = now
  .minus({
    minutes: 10,
  })
  .toJSDate()
const dateFifteenMinsAgo = now
  .minus({
    minutes: 15,
  })
  .toJSDate()
const dateTwentyMinsAgo = now
  .minus({
    minutes: 20,
  })
  .toJSDate()

const dateTwentyFiveMinsAgo = now
  .minus({
    minutes: 25,
  })
  .toJSDate()

const dateThirtyMinsAgo = now
  .minus({
    minutes: 30,
  })
  .toJSDate()

const newPackageStatusLogs: NewPackageStatusLog[] = [
  {
    id: 30_000,
    packageId: 10_000,
    status: "IN_WAREHOUSE",
    description: "Package has been received in an overseas hub.",
    createdAt: dateThirtyMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30_001,
    packageId: 10_000,
    status: "SORTING",
    description:
      "Package has been added to a shipment and is being prepared by the agent.",
    createdAt: dateTwentyFiveMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30_003,
    packageId: 10_000,
    status: "SHIPPING",
    description:
      "Package has been prepared and is being currently being shipped.",
    createdAt: dateTwentyMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30_004,
    packageId: 10_000,
    status: "IN_WAREHOUSE",
    description: "Package has been received in a local hub.",
    createdAt: dateTenMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
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

const newShipments: NewShipment[] = [
  {
    id: 20_000,
    originHubId: 1,
    destinationHubId: 2,
  },
]

const newShipmentPackages: NewShipmentPackage[] = [
  {
    shipmentId: 20_000,
    packageId: 10_000,
  },
]

const newShipmentsStatusLogs: NewShipmentStatusLog[] = [
  {
    id: 30_000,
    shipmentId: 20_000,
    status: "PREPARING",
    description: "Shipment has been created and is waiting to be shipped.",
    createdAt: dateTwentyFiveMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30_001,
    shipmentId: 20_000,
    status: "IN_TRANSIT",
    description: "Shipment is being shipped to another hub.",
    createdAt: dateFifteenMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30_002,
    shipmentId: 20_000,
    status: "ARRIVED",
    description: "Shipment has arrived to its destination hub.",
    createdAt: dateFiveMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
]

await db.insert(schema.users).values(newUsers)
await db.insert(schema.shipmentHubs).values(newShipmentHubs)
await db.insert(schema.shipmentHubAgents).values(newShipmentHubAgents)
await db.insert(schema.packages).values(newPackages)
await db.insert(schema.packageStatusLogs).values(newPackageStatusLogs)
await db.insert(schema.shipments).values(newShipments)
await db.insert(schema.shipmentPackages).values(newShipmentPackages)
await db.insert(schema.shipmentStatusLogs).values(newShipmentsStatusLogs)

await pool
  .end()
  .then(() => console.log("[\x1b[32m%s\x1b[0m] Database seeded", "✓"))

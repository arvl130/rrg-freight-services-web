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
  {
    id: 10001,
    shippingParty: "FIRST_PARTY",
    shippingMode: "SEA",
    shippingType: "STANDARD",
    receptionMode: "DOOR_TO_DOOR",
    weightInKg: 50,
    senderFullName: "Chelsey Ford",
    senderContactNumber: "+1123456790",
    senderEmailAddress: "phineasflynn@example.com",
    senderStreetAddress: "2309 Maple Drive",
    senderCity: "Tri-State Area",
    senderStateOrProvince: "Unknown State",
    senderCountryCode: "USA",
    senderPostalCode: 1111,
    receiverFullName: "Delores Simmons",
    receiverContactNumber: "+639123456789",
    receiverEmailAddress: "ferbfletcher@example.com",
    receiverStreetAddress: "124 Street",
    receiverBarangay: "San Bartolome",
    receiverCity: "Quezon City",
    receiverStateOrProvince: "National Capital Region",
    receiverCountryCode: "PHL",
    receiverPostalCode: 2222,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
    updatedById: seedEnv.TEST_OVERSEAS_USER_ID,
    createdInHubId: 1,
  },
  {
    id: 10002,
    shippingParty: "FIRST_PARTY",
    shippingMode: "SEA",
    shippingType: "STANDARD",
    receptionMode: "DOOR_TO_DOOR",
    weightInKg: 50,
    senderFullName: "Grover Santana",
    senderContactNumber: "+1123456791",
    senderEmailAddress: "phineasflynn@example.com",
    senderStreetAddress: "2310 Maple Drive",
    senderCity: "Tri-State Area",
    senderStateOrProvince: "Unknown State",
    senderCountryCode: "USA",
    senderPostalCode: 1111,
    receiverFullName: "Isra Haynes",
    receiverContactNumber: "+639123456789",
    receiverEmailAddress: "ferbfletcher@example.com",
    receiverStreetAddress: "125 Street",
    receiverBarangay: "San Bartolome",
    receiverCity: "Quezon City",
    receiverStateOrProvince: "National Capital Region",
    receiverCountryCode: "PHL",
    receiverPostalCode: 2222,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
    updatedById: seedEnv.TEST_OVERSEAS_USER_ID,
    createdInHubId: 1,
  },
  {
    id: 10003,
    shippingParty: "FIRST_PARTY",
    shippingMode: "SEA",
    shippingType: "STANDARD",
    receptionMode: "DOOR_TO_DOOR",
    weightInKg: 50,
    senderFullName: "Seren Dotson",
    senderContactNumber: "+1123456792",
    senderEmailAddress: "phineasflynn@example.com",
    senderStreetAddress: "2311 Maple Drive",
    senderCity: "Tri-State Area",
    senderStateOrProvince: "Unknown State",
    senderCountryCode: "USA",
    senderPostalCode: 1111,
    receiverFullName: "Alisha Huffman",
    receiverContactNumber: "+639123456789",
    receiverEmailAddress: "ferbfletcher@example.com",
    receiverStreetAddress: "126 Street",
    receiverBarangay: "San Bartolome",
    receiverCity: "Quezon City",
    receiverStateOrProvince: "National Capital Region",
    receiverCountryCode: "PHL",
    receiverPostalCode: 2222,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
    updatedById: seedEnv.TEST_OVERSEAS_USER_ID,
    createdInHubId: 1,
  },
  {
    id: 10004,
    shippingParty: "FIRST_PARTY",
    shippingMode: "SEA",
    shippingType: "STANDARD",
    receptionMode: "DOOR_TO_DOOR",
    weightInKg: 50,
    senderFullName: "Regan Bowers",
    senderContactNumber: "+1123456793",
    senderEmailAddress: "phineasflynn@example.com",
    senderStreetAddress: "2312 Maple Drive",
    senderCity: "Tri-State Area",
    senderStateOrProvince: "Unknown State",
    senderCountryCode: "USA",
    senderPostalCode: 1111,
    receiverFullName: "Daniella Bryan",
    receiverContactNumber: "+639123456789",
    receiverEmailAddress: "ferbfletcher@example.com",
    receiverStreetAddress: "127 Street",
    receiverBarangay: "San Bartolome",
    receiverCity: "Quezon City",
    receiverStateOrProvince: "National Capital Region",
    receiverCountryCode: "PHL",
    receiverPostalCode: 2222,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
    updatedById: seedEnv.TEST_OVERSEAS_USER_ID,
    createdInHubId: 1,
  },
  {
    id: 10005,
    shippingParty: "FIRST_PARTY",
    shippingMode: "SEA",
    shippingType: "STANDARD",
    receptionMode: "DOOR_TO_DOOR",
    weightInKg: 50,
    senderFullName: "Aminah Pope",
    senderContactNumber: "+1123456794",
    senderEmailAddress: "phineasflynn@example.com",
    senderStreetAddress: "2313 Maple Drive",
    senderCity: "Tri-State Area",
    senderStateOrProvince: "Unknown State",
    senderCountryCode: "USA",
    senderPostalCode: 1111,
    receiverFullName: "John Nielsen",
    receiverContactNumber: "+639123456789",
    receiverEmailAddress: "ferbfletcher@example.com",
    receiverStreetAddress: "128 Street",
    receiverBarangay: "San Bartolome",
    receiverCity: "Quezon City",
    receiverStateOrProvince: "National Capital Region",
    receiverCountryCode: "PHL",
    receiverPostalCode: 2222,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
    updatedById: seedEnv.TEST_OVERSEAS_USER_ID,
    createdInHubId: 1,
  },
  {
    id: 10006,
    shippingParty: "FIRST_PARTY",
    shippingMode: "SEA",
    shippingType: "STANDARD",
    receptionMode: "DOOR_TO_DOOR",
    weightInKg: 50,
    senderFullName: "Raees Bruce",
    senderContactNumber: "+1123456795",
    senderEmailAddress: "phineasflynn@example.com",
    senderStreetAddress: "2314 Maple Drive",
    senderCity: "Tri-State Area",
    senderStateOrProvince: "Unknown State",
    senderCountryCode: "USA",
    senderPostalCode: 1111,
    receiverFullName: "Maryam Franklin",
    receiverContactNumber: "+639123456789",
    receiverEmailAddress: "ferbfletcher@example.com",
    receiverStreetAddress: "129 Street",
    receiverBarangay: "San Bartolome",
    receiverCity: "Quezon City",
    receiverStateOrProvince: "National Capital Region",
    receiverCountryCode: "PHL",
    receiverPostalCode: 2222,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
    updatedById: seedEnv.TEST_OVERSEAS_USER_ID,
    createdInHubId: 1,
  },
  {
    id: 10007,
    shippingParty: "FIRST_PARTY",
    shippingMode: "SEA",
    shippingType: "STANDARD",
    receptionMode: "DOOR_TO_DOOR",
    weightInKg: 50,
    senderFullName: "Karim Lucas",
    senderContactNumber: "+1123456796",
    senderEmailAddress: "phineasflynn@example.com",
    senderStreetAddress: "2315 Maple Drive",
    senderCity: "Tri-State Area",
    senderStateOrProvince: "Unknown State",
    senderCountryCode: "USA",
    senderPostalCode: 1111,
    receiverFullName: "Julius O'Quinn",
    receiverContactNumber: "+639123456789",
    receiverEmailAddress: "ferbfletcher@example.com",
    receiverStreetAddress: "130 Street",
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
  {
    id: 30005,
    packageId: 10001,
    status: "SHIPPING",
    description: "Package has been prepared and is currently being shipped.",
    createdAt: dateTwentyMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30006,
    packageId: 10002,
    status: "SHIPPING",
    description: "Package has been prepared and is currently being shipped.",
    createdAt: dateTwentyMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30007,
    packageId: 10003,
    status: "SHIPPING",
    description: "Package has been prepared and is currently being shipped.",
    createdAt: dateTwentyMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30008,
    packageId: 10004,
    status: "SHIPPING",
    description: "Package has been prepared and is currently being shipped.",
    createdAt: dateTwentyMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30009,
    packageId: 10005,
    status: "SHIPPING",
    description: "Package has been prepared and is currently being shipped.",
    createdAt: dateTwentyMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30010,
    packageId: 10006,
    status: "SHIPPING",
    description: "Package has been prepared and is currently being shipped.",
    createdAt: dateTwentyMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30011,
    packageId: 10007,
    status: "SHIPPING",
    description: "Package has been prepared and is currently being shipped.",
    createdAt: dateTwentyMinsAgo,
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
  {
    id: 20001,
    originHubId: 1,
    destinationHubId: 2,
  },
  {
    id: 20002,
    originHubId: 1,
    destinationHubId: 2,
  },
  {
    id: 20003,
    originHubId: 1,
    destinationHubId: 2,
  },
  {
    id: 20004,
    originHubId: 1,
    destinationHubId: 2,
  },
]

const newShipmentPackages: NewShipmentPackage[] = [
  {
    shipmentId: 20_000,
    packageId: 10_000,
  },
  {
    shipmentId: 20001,
    packageId: 10001,
  },
  {
    shipmentId: 20001,
    packageId: 10002,
  },
  {
    shipmentId: 20001,
    packageId: 10003,
  },
  {
    shipmentId: 20001,
    packageId: 10004,
  },
  {
    shipmentId: 20002,
    packageId: 10005,
  },
  {
    shipmentId: 20002,
    packageId: 10006,
  },
  {
    shipmentId: 20002,
    packageId: 10007,
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
  {
    id: 30003,
    shipmentId: 20001,
    status: "PREPARING",
    description: "Shipment has been created and is waiting to be shipped.",
    createdAt: dateTwentyFiveMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30004,
    shipmentId: 20002,
    status: "PREPARING",
    description: "Shipment has been created and is waiting to be shipped.",
    createdAt: dateTwentyFiveMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30005,
    shipmentId: 20003,
    status: "PREPARING",
    description: "Shipment has been created and is waiting to be shipped.",
    createdAt: dateTwentyFiveMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30006,
    shipmentId: 20004,
    status: "PREPARING",
    description: "Shipment has been created and is waiting to be shipped.",
    createdAt: dateTwentyFiveMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30007,
    shipmentId: 20001,
    status: "IN_TRANSIT",
    description: "Shipment has been created and is waiting to be shipped.",
    createdAt: dateFifteenMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30008,
    shipmentId: 20002,
    status: "IN_TRANSIT",
    description: "Shipment has been created and is waiting to be shipped.",
    createdAt: dateFifteenMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30009,
    shipmentId: 20003,
    status: "IN_TRANSIT",
    description: "Shipment has been created and is waiting to be shipped.",
    createdAt: dateFifteenMinsAgo,
    createdById: seedEnv.TEST_OVERSEAS_USER_ID,
  },
  {
    id: 30010,
    shipmentId: 20004,
    status: "IN_TRANSIT",
    description: "Shipment has been created and is waiting to be shipped.",
    createdAt: dateFifteenMinsAgo,
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

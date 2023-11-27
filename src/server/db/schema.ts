import {
  supportedGenders,
  supportedPackageStatuses,
  supportedReceptionModes,
  supportedRoles,
  SUPPORTED_SHIPMENT_STATUSES,
  supportedShippingModes,
  supportedShippingParties,
  SUPPORTED_SHIPPING_TYPES,
  supportedVehicleTypes,
} from "../../utils/constants"
import {
  bigint,
  mysqlTable,
  varchar,
  text,
  mysqlEnum,
  timestamp,
  tinyint,
  int,
  double,
  primaryKey,
} from "drizzle-orm/mysql-core"

export const users = mysqlTable("users", {
  id: varchar("id", { length: 28 }).primaryKey(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  photoUrl: text("photo_url"),
  emailAddress: varchar("email_address", { length: 100 }).notNull(),
  contactNumber: varchar("contact_number", { length: 15 }).notNull(),
  gender: mysqlEnum("gender", supportedGenders),
  role: mysqlEnum("role", supportedRoles).notNull(),
  isEnabled: tinyint("is_enabled").notNull().default(1),
})

export const incomingShipments = mysqlTable("incoming_shipments", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  sentByAgentId: varchar("sent_by_agent_id", {
    length: 28,
  }).notNull(),
  status: mysqlEnum("status", [
    SUPPORTED_SHIPMENT_STATUSES[0],
    ...SUPPORTED_SHIPMENT_STATUSES.slice(1),
  ]).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const incomingShipmentPackages = mysqlTable(
  "incoming_shipment_packages",
  {
    incomingShipmentId: bigint("incoming_shipment_id", {
      mode: "number",
    }).notNull(),
    packageId: bigint("package_id", { mode: "number" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.incomingShipmentId, table.packageId],
    }),
  }),
)

export const transferShipments = mysqlTable("transfer_shipments", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  driverId: varchar("driver_id", {
    length: 28,
  }).notNull(),
  vehicleId: bigint("vehicle_id", {
    mode: "number",
  }).notNull(),
  sentToAgentId: varchar("sent_to_agent_id", {
    length: 28,
  }).notNull(),
  status: mysqlEnum("status", [
    SUPPORTED_SHIPMENT_STATUSES[0],
    ...SUPPORTED_SHIPMENT_STATUSES.slice(1),
  ]).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const transferShipmentPackages = mysqlTable(
  "transfer_shipment_packages",
  {
    transferShipmentId: bigint("transfer_shipment_id", {
      mode: "number",
    }).notNull(),
    packageId: bigint("package_id", { mode: "number" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.transferShipmentId, table.packageId],
    }),
  }),
)

export const transferShipmentLocations = mysqlTable(
  "transfer_shipment_locations",
  {
    id: bigint("id", {
      mode: "number",
    })
      .primaryKey()
      .autoincrement(),
    transferShipmentId: bigint("transfer_shipment_id", {
      mode: "number",
    }).notNull(),
    long: double("long", {
      precision: 12,
      scale: 9,
    }).notNull(),
    lat: double("lat", {
      precision: 12,
      scale: 9,
    }).notNull(),
    createdAt: timestamp("created_at", {
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    createdById: varchar("created_by_id", { length: 28 }).notNull(),
  },
)

export const deliveries = mysqlTable("deliveries", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  driverId: varchar("driver_id", {
    length: 28,
  }).notNull(),
  vehicleId: bigint("vehicle_id", {
    mode: "number",
  }).notNull(),
  status: mysqlEnum("status", [
    SUPPORTED_SHIPMENT_STATUSES[0],
    ...SUPPORTED_SHIPMENT_STATUSES.slice(1),
  ]).notNull(),
  isExpress: tinyint("is_express").notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const deliveryPackages = mysqlTable(
  "delivery_packages",
  {
    deliveryId: bigint("delivery_id", {
      mode: "number",
    }).notNull(),
    packageId: bigint("package_id", { mode: "number" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.deliveryId, table.packageId],
    }),
  }),
)

export const deliveryLocations = mysqlTable("delivery_locations", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  deliveryId: bigint("delivery_id", {
    mode: "number",
  }).notNull(),
  long: double("long", {
    precision: 12,
    scale: 9,
  }).notNull(),
  lat: double("lat", {
    precision: 12,
    scale: 9,
  }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
})

export const vehicles = mysqlTable("vehicles", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  type: mysqlEnum("type", supportedVehicleTypes).notNull(),
  displayName: varchar("display_name", {
    length: 100,
  }).notNull(),
  isExpressAllowed: tinyint("is_express_allowed").notNull(),
})

export const packages = mysqlTable("packages", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  shippingParty: mysqlEnum("shipping_party", supportedShippingParties)
    .notNull()
    .default("FIRST_PARTY"),
  shippingMode: mysqlEnum("shipping_mode", supportedShippingModes).notNull(),
  shippingType: mysqlEnum("shipping_type", [
    SUPPORTED_SHIPPING_TYPES[0],
    ...SUPPORTED_SHIPPING_TYPES.slice(1),
  ]).notNull(),
  receptionMode: mysqlEnum("reception_mode", supportedReceptionModes).notNull(),
  weightInKg: double("weight_in_kg", {
    precision: 8,
    scale: 2,
  }).notNull(),
  senderFullName: varchar("sender_full_name", { length: 100 }).notNull(),
  senderContactNumber: varchar("sender_contact_number", {
    length: 15,
  }).notNull(),
  senderEmailAddress: varchar("sender_email_address", {
    length: 100,
  }).notNull(),
  senderStreetAddress: varchar("sender_street_address", {
    length: 255,
  }).notNull(),
  senderCity: varchar("sender_city", {
    length: 100,
  }).notNull(),
  senderStateOrProvince: varchar("sender_state_province", {
    length: 100,
  }).notNull(),
  // Uses ISO 3166-1 alpha-3 format.
  // See: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  senderCountryCode: varchar("sender_country_code", { length: 3 }).notNull(),
  senderPostalCode: int("sender_postal_code").notNull(),
  receiverFullName: varchar("receiver_full_name", { length: 100 }).notNull(),
  receiverContactNumber: varchar("receiver_contact_number", {
    length: 15,
  }).notNull(),
  receiverEmailAddress: varchar("receiver_email_address", {
    length: 100,
  }).notNull(),
  receiverStreetAddress: varchar("receiver_street_address", {
    length: 255,
  }).notNull(),
  receiverBarangay: varchar("receiver_barangay", {
    length: 100,
  }).notNull(),
  receiverCity: varchar("receiver_city", {
    length: 100,
  }).notNull(),
  receiverStateOrProvince: varchar("receiver_state_province", {
    length: 100,
  }).notNull(),
  // Uses ISO 3166-1 alpha-3 format.
  // See: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  receiverCountryCode: varchar("receiver_country_code", {
    length: 3,
  }).notNull(),
  receiverPostalCode: int("receiver_postal_code").notNull(),
  proofOfDeliveryImgUrl: text("proof_of_delivery_img_url"),
  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedById: varchar("updated_by_id", { length: 28 }).notNull(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const packageStatusLogs = mysqlTable("package_status_logs", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  packageId: bigint("package_id", {
    mode: "number",
  }).notNull(),
  status: mysqlEnum("status", supportedPackageStatuses).notNull(),
  description: varchar("description", {
    length: 255,
  }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
})

export const activities = mysqlTable("activities", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  description: varchar("description", {
    length: 5000,
  }).notNull(),
  tableName: varchar("table_name", {
    length: 64,
  }).notNull(),
  fieldName: varchar("field_name", {
    length: 64,
  }).notNull(),
  rowKey: bigint("row_key", {
    mode: "number",
  }).notNull(),
  oldValue: text("old_value").notNull(),
  newValue: text("new_value").notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

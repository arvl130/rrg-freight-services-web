import {
  supportedGenders,
  supportedHubRoles,
  supportedPackageStatuses,
  supportedReceptionModes,
  supportedRoles,
  supportedShipmentStatuses,
  supportedShippingModes,
  supportedShippingParties,
  supportedShippingTypes,
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
  datetime,
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

export const shipments = mysqlTable("shipments", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  originHubId: bigint("origin_hub_id", { mode: "number" }).notNull(),
  // FIXME: Use a better design to signify that a shipment is headed
  // for customer receivers.
  //
  // For now, we will use a NULL destinationHub to signify that.
  destinationHubId: bigint("destination_hub_id", { mode: "number" }),
  deliveredById: bigint("delivered_by_id", { mode: "number" }).notNull(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const shipmentLocations = mysqlTable("shipment_locations", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  shipmentId: bigint("shipment_id", {
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

export const shipmentStatusLogs = mysqlTable("shipment_status_logs", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  shipmentId: bigint("shipment_id", {
    mode: "number",
  }).notNull(),
  status: mysqlEnum("status", supportedShipmentStatuses).notNull(),
  description: varchar("description", {
    length: 255,
  }).notNull(),
  createdAt: datetime("created_at", {
    mode: "date",
  }).notNull(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
})

export const shipmentHubs = mysqlTable("shipment_hubs", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  displayName: varchar("display_name", {
    length: 255,
  }).notNull(),
  role: mysqlEnum("role", supportedHubRoles).notNull(),
  streetAddress: varchar("street_address", {
    length: 255,
  }).notNull(),
  barangay: varchar("barangay", {
    length: 100,
  }),
  city: varchar("city", {
    length: 100,
  }),
  stateOrProvince: varchar("state_or_province", {
    length: 100,
  }).notNull(),
  countryCode: varchar("country_code", {
    length: 3,
  }).notNull(),
  isMainHub: tinyint("is_main_hub").notNull(),
  postalCode: int("postal_code").notNull(),
})

export const shipmentHubAgents = mysqlTable(
  "shipment_hub_agents",
  {
    shipmentHubId: bigint("shipment_hub_id", { mode: "number" }).notNull(),
    userId: varchar("user_id", { length: 28 }).notNull(),
  },
  (table) => ({
    pk: primaryKey(table.shipmentHubId, table.userId),
  }),
)

export const shipmentPackages = mysqlTable(
  "shipment_packages",
  {
    shipmentId: bigint("shipment_id", { mode: "number" }).notNull(),
    packageId: bigint("package_id", { mode: "number" }).notNull(),
  },
  (table) => ({
    pk: primaryKey(table.shipmentId, table.packageId),
  }),
)

export const packages = mysqlTable("packages", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  shippingParty: mysqlEnum("shipping_party", supportedShippingParties)
    .notNull()
    .default("FIRST_PARTY"),
  shippingMode: mysqlEnum("shipping_mode", supportedShippingModes).notNull(),
  shippingType: mysqlEnum("shipping_type", supportedShippingTypes).notNull(),
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
  createdInHubId: bigint("created_in_hub_id", { mode: "number" }),
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
  createdAt: datetime("created_at", {
    mode: "date",
  }).notNull(),
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

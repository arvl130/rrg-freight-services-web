import {
  SUPPORTED_GENDERS,
  SUPPORTED_PACKAGE_STATUSES,
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_USER_ROLES,
  SUPPORTED_SHIPMENT_STATUSES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
  SUPPORTED_VEHICLE_TYPES,
  SUPPORTED_SHIPMENT_TYPES,
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
  gender: mysqlEnum("gender", SUPPORTED_GENDERS),
  role: mysqlEnum("role", SUPPORTED_USER_ROLES).notNull(),
  isEnabled: tinyint("is_enabled").notNull().default(1),
})

export const shipments = mysqlTable("shipments", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  type: mysqlEnum("type", SUPPORTED_SHIPMENT_TYPES).notNull(),
  status: mysqlEnum("status", SUPPORTED_SHIPMENT_STATUSES).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const shipmentPackages = mysqlTable(
  "shipment_packages",
  {
    shipmentId: bigint("shipment_id", {
      mode: "number",
    }).notNull(),
    packageId: varchar("package_id", { length: 36 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.shipmentId, table.packageId],
    }),
  }),
)

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

export const incomingShipments = mysqlTable("incoming_shipments", {
  shipmentId: bigint("shipment_id", {
    mode: "number",
  }).primaryKey(),
  sentByAgentId: varchar("sent_by_agent_id", {
    length: 28,
  }).notNull(),
})

export const forwarderTransferShipments = mysqlTable(
  "forwarder_transfer_shipments",
  {
    shipmentId: bigint("shipment_id", {
      mode: "number",
    }).primaryKey(),
    driverId: varchar("driver_id", {
      length: 28,
    }).notNull(),
    vehicleId: bigint("vehicle_id", {
      mode: "number",
    }).notNull(),
    sentToAgentId: varchar("sent_to_agent_id", {
      length: 28,
    }).notNull(),
    proofOfTransferImgUrl: text("proof_of_transfer_img_url"),
    isTransferConfirmed: tinyint("is_transfer_confirmed").notNull().default(0),
  },
)

export const warehouseTransferShipments = mysqlTable(
  "warehouse_transfer_shipments",
  {
    shipmentId: bigint("shipment_id", {
      mode: "number",
    }).primaryKey(),
    driverId: varchar("driver_id", {
      length: 28,
    }).notNull(),
    vehicleId: bigint("vehicle_id", {
      mode: "number",
    }).notNull(),
    sentToWarehouseId: bigint("sent_to_warehouse_id", {
      mode: "number",
    }).notNull(),
  },
)

export const deliveryShipments = mysqlTable("delivery_shipments", {
  shipmentId: bigint("shipment_id", {
    mode: "number",
  }).primaryKey(),
  driverId: varchar("driver_id", {
    length: 28,
  }).notNull(),
  vehicleId: bigint("vehicle_id", {
    mode: "number",
  }).notNull(),
  isExpress: tinyint("is_express").notNull(),
})

export const warehouses = mysqlTable("warehouses", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  displayName: varchar("display_name", {
    length: 100,
  }).notNull(),
})

export const vehicles = mysqlTable("vehicles", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  type: mysqlEnum("type", SUPPORTED_VEHICLE_TYPES).notNull(),
  displayName: varchar("display_name", {
    length: 100,
  }).notNull(),
  isExpressAllowed: tinyint("is_express_allowed").notNull(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const packageCategories = mysqlTable("package_categories", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  displayName: varchar("display_name", {
    length: 100,
  }).notNull(),
})

export const packages = mysqlTable("packages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  shippingMode: mysqlEnum(
    "shipping_mode",
    SUPPORTED_PACKAGE_SHIPPING_MODES,
  ).notNull(),
  shippingType: mysqlEnum(
    "shippingtype",
    SUPPORTED_PACKAGE_SHIPPING_TYPES,
  ).notNull(),
  receptionMode: mysqlEnum(
    "reception_mode",
    SUPPORTED_PACKAGE_RECEPTION_MODES,
  ).notNull(),
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
  lastWarehouseId: bigint("last_warehouse_id", {
    mode: "number",
  }),
  isFragile: tinyint("is_fragile").notNull(),
})

export const packageStatusLogs = mysqlTable("package_status_logs", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  packageId: varchar("package_id", { length: 36 }).notNull(),
  status: mysqlEnum("status", SUPPORTED_PACKAGE_STATUSES).notNull(),
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

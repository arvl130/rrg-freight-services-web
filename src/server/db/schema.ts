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
} from "../../utils/constants"
import { relations } from "drizzle-orm"
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
  photoUrl: text("photo_url").notNull().default(""),
  emailAddress: varchar("email_address", { length: 100 }).notNull(),
  contactNumber: varchar("contact_number", { length: 15 }).notNull(),
  gender: mysqlEnum("gender", supportedGenders),
  role: mysqlEnum("role", supportedRoles).notNull(),
  isEnabled: tinyint("is_enabled").default(1),
})

export const usersRelations = relations(users, ({ many }) => ({
  shipments: many(shipments),
  activities: many(activities),
}))

export const shipments = mysqlTable("shipments", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  originHubId: bigint("origin_hub_id", { mode: "number" }).notNull(),
  destinationHubId: bigint("destination_hub_id", { mode: "number" }).notNull(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  originHub: one(shipmentHubs, {
    fields: [shipments.originHubId],
    references: [shipmentHubs.id],
  }),
  destinationHub: one(shipmentHubs, {
    fields: [shipments.destinationHubId],
    references: [shipmentHubs.id],
  }),
  shipmentPackages: many(shipmentPackages),
  shipmentStatusLogs: many(shipmentStatusLogs),
}))

export const shipmentStatusLogs = mysqlTable("shipment_status_logs", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  shipmentId: bigint("shipment_id", {
    mode: "number",
  }).notNull(),
  status: mysqlEnum("status", supportedShipmentStatuses)
    .notNull()
    .default("PENDING"),
  description: varchar("description", {
    length: 255,
  }).notNull(),
  createdAt: datetime("created_at", {
    mode: "date",
  }).notNull(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
})

export const shipmentStatusLogsRelations = relations(
  shipmentStatusLogs,
  ({ one }) => ({
    shipment: one(shipments, {
      fields: [shipmentStatusLogs.shipmentId],
      references: [shipments.id],
    }),
    createdBy: one(users, {
      fields: [shipmentStatusLogs.createdById],
      references: [users.id],
    }),
  })
)

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
  postalCode: int("postal_code").notNull(),
})

export const shipmentHubsRelations = relations(shipmentHubs, ({ many }) => ({
  shipmentHubAgents: many(shipmentHubAgents),
}))

export const shipmentHubAgents = mysqlTable(
  "shipment_hub_agents",
  {
    shipmentHubId: bigint("shipment_hub_id", { mode: "number" }).notNull(),
    userId: varchar("user_id", { length: 28 }).notNull(),
  },
  (table) => ({
    pk: primaryKey(table.shipmentHubId, table.userId),
  })
)

export const shipmentHubAgentsRelations = relations(
  shipmentHubAgents,
  ({ one }) => ({
    shipmentHub: one(shipmentHubs, {
      fields: [shipmentHubAgents.shipmentHubId],
      references: [shipmentHubs.id],
    }),
    user: one(users, {
      fields: [shipmentHubAgents.userId],
      references: [users.id],
    }),
  })
)

export const shipmentPackages = mysqlTable(
  "shipment_packages",
  {
    shipmentId: bigint("shipment_id", { mode: "number" }).notNull(),
    packageId: bigint("package_id", { mode: "number" }).notNull(),
  },
  (table) => ({
    pk: primaryKey(table.shipmentId, table.packageId),
  })
)

export const shipmentPackagesRelations = relations(
  shipmentPackages,
  ({ one }) => ({
    package: one(packages, {
      fields: [shipmentPackages.packageId],
      references: [packages.id],
    }),
    shipment: one(shipments, {
      fields: [shipmentPackages.shipmentId],
      references: [shipments.id],
    }),
  })
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
  }),
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
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const packagesRelations = relations(packages, ({ one, many }) => ({
  packageStatusLogs: many(packageStatusLogs),
  createdBy: one(users, {
    fields: [packages.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [packages.updatedById],
    references: [users.id],
  }),
}))

export const packageStatusLogs = mysqlTable("package_status_logs", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  packageId: bigint("package_id", {
    mode: "number",
  }).notNull(),
  status: mysqlEnum("status", supportedPackageStatuses)
    .notNull()
    .default("PENDING"),
  description: varchar("description", {
    length: 255,
  }).notNull(),
  createdAt: datetime("created_at", {
    mode: "date",
  }).notNull(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
})

export const packageStatusLogsRelations = relations(
  packageStatusLogs,
  ({ one }) => ({
    package: one(packages, {
      fields: [packageStatusLogs.packageId],
      references: [packages.id],
    }),
    createdBy: one(users, {
      fields: [packageStatusLogs.createdById],
      references: [users.id],
    }),
  })
)

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

export const activitiesRelations = relations(activities, ({ one }) => ({
  createdBy: one(users, {
    fields: [activities.createdById],
    references: [users.id],
  }),
}))

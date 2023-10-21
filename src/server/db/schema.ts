import {
  supportedGenders,
  supportedPackageStatuses,
  supportedReceptionMode,
  supportedRoles,
  supportedShipmentStatuses,
  supportedShippingMode,
  supportedShippingParty,
  supportedShippingType,
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
  decimal,
} from "drizzle-orm/mysql-core"

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
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
  status: mysqlEnum("status", supportedShipmentStatuses)
    .notNull()
    .default("PENDING"),
  createdAt: timestamp("created_at", {
    mode: "date",
  }).defaultNow(),
  createdById: bigint("created_by_id", { mode: "number" }).notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
  }).defaultNow(),
  isArchived: tinyint("is_archived").default(0),
})

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  shipmentPackages: many(shipmentPackages),
  createdBy: one(users, {
    fields: [shipments.createdById],
    references: [users.id],
  }),
}))

export const shipmentPackages = mysqlTable("shipment_packages", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  shipmentId: bigint("shipment_id", { mode: "number" }).notNull(),
  packageId: bigint("package_id", { mode: "number" }).notNull(),
})

export const shipmentPackagesRelations = relations(
  shipmentPackages,
  ({ one }) => ({
    package: one(packages, {
      fields: [shipmentPackages.packageId],
      references: [packages.id],
    }),
    shipment: one(packages, {
      fields: [shipmentPackages.packageId],
      references: [packages.id],
    }),
  })
)

export const packages = mysqlTable("packages", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  shipmentId: bigint("shipment_id", { mode: "number" }).notNull(),
  status: mysqlEnum("status", supportedPackageStatuses)
    .notNull()
    .default("PENDING"),
  shippingParty: mysqlEnum("shipping_party", supportedShippingParty)
    .notNull()
    .default("FIRST_PARTY"),
  shippingMode: mysqlEnum("shipping_mode", supportedShippingMode).notNull(),
  shippingType: mysqlEnum("shipping_type", supportedShippingType).notNull(),
  receptionMode: mysqlEnum("reception_mode", supportedReceptionMode).notNull(),
  weightInKg: decimal("weight_in_kg", {
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
  senderStateOrProvince: varchar("sender_state_province", {
    length: 100,
  }).notNull(),
  senderCountry: varchar("sender_country", { length: 100 }).notNull(),
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
  receiverStateOrProvince: varchar("receiver_state_province", {
    length: 100,
  }).notNull(),
  receiverCountry: varchar("receiver_country", { length: 100 }).notNull(),
  receiverPostalCode: int("receiver_postal_code").notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedById: bigint("updated_by_id", { mode: "number" }).notNull(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const packagesRelations = relations(packages, ({ one }) => ({
  updatedBy: one(users, {
    fields: [packages.updatedById],
    references: [users.id],
  }),
}))

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
  createdById: bigint("created_by_id", { mode: "number" }).notNull(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const activitiesRelations = relations(activities, ({ one }) => ({
  createdBy: one(users, {
    fields: [activities.createdById],
    references: [users.id],
  }),
}))

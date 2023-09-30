import { relations } from "drizzle-orm"
import {
  bigint,
  mysqlTable,
  varchar,
  text,
  mysqlEnum,
  timestamp,
  tinyint,
} from "drizzle-orm/mysql-core"

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  photoUrl: text("photo_url").notNull().default(""),
  emailAddress: varchar("email_address", { length: 100 }).notNull(),
  contactNumber: varchar("contact_number", { length: 15 }).notNull(),
  gender: mysqlEnum("gender", ["MALE", "FEMALE", "OTHER"]),
  role: mysqlEnum("role", [
    "ADMIN",
    "WAREHOUSE",
    "SENDER",
    "RECEIVER",
  ]).notNull(),
  isEnabled: tinyint("is_enabled").default(1),
})

export const usersRelations = relations(users, ({ many }) => ({
  manifests: many(manifests),
  activities: many(activities),
}))

export const manifests = mysqlTable("manifests", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  status: mysqlEnum("status", [
    "PREPARED_BY_AGENT",
    "SHIPPED_BY_AGENT",
    "IN_TRANSIT_TO_WAREHOUSE",
    "RECEIVED_IN_WAREHOUSE",
  ])
    .notNull()
    .default("PREPARED_BY_AGENT"),
  createdAt: timestamp("created_at", {
    mode: "date",
  }).defaultNow(),
  createdById: bigint("created_by_id", { mode: "number" }).notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
  }).defaultNow(),
  isArchived: tinyint("is_archived").default(0),
})

export const manifestsRelations = relations(manifests, ({ one, many }) => ({
  packages: many(packages),
  createdBy: one(users, {
    fields: [manifests.createdById],
    references: [users.id],
  }),
}))

export const packages = mysqlTable("packages", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  manifestId: bigint("manifest_id", { mode: "number" }).notNull(),
  status: mysqlEnum("status", [
    "PREPARED_BY_AGENT",
    "SHIPPED_BY_AGENT",
    "IN_TRANSIT_TO_WAREHOUSE",
    "IN_WAREHOUSE",
    "FOR_DELIVERY_TO_CUSTOMER",
    "FOR_DELIVERY_TO_THIRD_PARTY",
    "FOR_PICKUP",
    "DELIVERED_TO_CUSTOMER",
    "DELIVERED_TO_THIRD_PARTY",
    "PICKED_UP_BY_THIRD_PARTY",
  ])
    .notNull()
    .default("PREPARED_BY_AGENT"),
  shipper: mysqlEnum("shipper", ["FIRST_PARTY", "THIRD_PARTY"])
    .notNull()
    .default("FIRST_PARTY"),
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  destinationAddress: varchar("destination_address", {
    length: 1000,
  }).notNull(),
  emailAddress: varchar("email_address", { length: 100 }).notNull(),
  contactNumber: varchar("contact_number", { length: 15 }).notNull(),
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

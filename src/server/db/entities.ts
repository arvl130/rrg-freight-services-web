import {
  users,
  shipments,
  shipmentPackages,
  packages,
  activities,
} from "./schema"

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Shipment = typeof shipments.$inferSelect
export type NewShipment = typeof shipments.$inferInsert

export type ShipmentPackage = typeof shipmentPackages.$inferSelect
export type NewShipmentPackage = typeof shipmentPackages.$inferInsert

export type Package = typeof packages.$inferSelect
export type NewPackage = typeof packages.$inferInsert

export type Activity = typeof activities.$inferSelect
export type NewActivity = typeof activities.$inferInsert

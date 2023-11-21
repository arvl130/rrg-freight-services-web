import {
  users,
  shipments,
  shipmentStatusLogs,
  shipmentHubs,
  shipmentHubAgents,
  shipmentPackages,
  packages,
  packageStatusLogs,
  activities,
  shipmentLocations,
} from "./schema"

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Shipment = typeof shipments.$inferSelect
export type NewShipment = typeof shipments.$inferInsert

export type ShipmentStatusLog = typeof shipmentStatusLogs.$inferSelect
export type NewShipmentStatusLog = typeof shipmentStatusLogs.$inferInsert

export type ShipmentHub = typeof shipmentHubs.$inferSelect
export type NewShipmentHub = typeof shipmentHubs.$inferInsert

export type ShipmentHubAgent = typeof shipmentHubAgents.$inferSelect
export type NewShipmentHubAgent = typeof shipmentHubAgents.$inferInsert

export type ShipmentPackage = typeof shipmentPackages.$inferSelect
export type NewShipmentPackage = typeof shipmentPackages.$inferInsert

export type ShipmentLocation = typeof shipmentLocations.$inferSelect
export type NewShipmentLocation = typeof shipmentLocations.$inferInsert

export type Package = typeof packages.$inferSelect
export type NewPackage = typeof packages.$inferInsert

export type PackageStatusLog = typeof packageStatusLogs.$inferSelect
export type NewPackageStatusLog = typeof packageStatusLogs.$inferInsert

export type Activity = typeof activities.$inferSelect
export type NewActivity = typeof activities.$inferInsert

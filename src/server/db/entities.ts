import {
  users,
  incomingShipments,
  incomingShipmentPackages,
  transferShipments,
  transferShipmentPackages,
  deliveryShipments,
  deliveryPackages,
  deliveryShipmentLocations,
  vehicles,
  packages,
  packageStatusLogs,
  activities,
  transferShipmentLocations,
} from "./schema"

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type IncomingShipment = typeof incomingShipments.$inferSelect
export type NewIncomingShipment = typeof incomingShipments.$inferInsert

export type IncomingShipmentPackage =
  typeof incomingShipmentPackages.$inferSelect
export type NewIncomingShipmentPackage =
  typeof incomingShipmentPackages.$inferInsert

export type TransferShipment = typeof transferShipments.$inferSelect
export type NewTransferShipment = typeof transferShipments.$inferInsert

export type TransferShipmentPackage =
  typeof transferShipmentPackages.$inferSelect
export type NewTransferShipmentPackage =
  typeof transferShipmentPackages.$inferInsert

export type TransferShipmentLocation =
  typeof transferShipmentLocations.$inferSelect
export type NewTransferShipmentLocation =
  typeof transferShipmentLocations.$inferInsert

export type DeliveryShipment = typeof deliveryShipments.$inferSelect
export type NewDeliveryShipment = typeof deliveryShipments.$inferInsert

export type DeliveryShipmentPackage = typeof deliveryPackages.$inferSelect
export type NewDeliveryShipmentPackage = typeof deliveryPackages.$inferInsert

export type DeliveryShipmentLocation =
  typeof deliveryShipmentLocations.$inferSelect
export type NewDeliveryShipmentLocation =
  typeof deliveryShipmentLocations.$inferInsert

export type Package = typeof packages.$inferSelect
export type NewPackage = typeof packages.$inferInsert

export type PackageStatusLog = typeof packageStatusLogs.$inferSelect
export type NewPackageStatusLog = typeof packageStatusLogs.$inferInsert

export type Activity = typeof activities.$inferSelect
export type NewActivity = typeof activities.$inferInsert

export type Vehicle = typeof vehicles.$inferSelect
export type NewVehicle = typeof vehicles.$inferInsert

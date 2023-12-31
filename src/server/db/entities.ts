import {
  users,
  shipments,
  shipmentPackages,
  shipmentLocations,
  incomingShipments,
  forwarderTransferShipments,
  warehouseTransferShipments,
  deliveryShipments,
  vehicles,
  warehouses,
  packages,
  packageStatusLogs,
  activities,
} from "./schema"

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Shipment = typeof shipments.$inferSelect
export type NewShipment = typeof shipments.$inferInsert

export type ShipmentPackage = typeof shipmentPackages.$inferSelect
export type NewShipmentPackage = typeof shipmentPackages.$inferInsert

export type ShipmentLocation = typeof shipmentLocations.$inferSelect
export type NewShipmentLocation = typeof shipmentLocations.$inferInsert

export type IncomingShipment = typeof incomingShipments.$inferSelect
export type NewIncomingShipment = typeof incomingShipments.$inferInsert
export type NormalizedIncomingShipment = Omit<
  Shipment & IncomingShipment,
  "shipmentId"
>

export type ForwarderTransferShipment =
  typeof forwarderTransferShipments.$inferSelect
export type NewForwarderTransferShipment =
  typeof forwarderTransferShipments.$inferInsert
export type NormalizedForwarderTransferShipment = Omit<
  Shipment & ForwarderTransferShipment,
  "shipmentId"
>

export type WarehouseTransferShipment =
  typeof warehouseTransferShipments.$inferSelect
export type NewWarehouseTransferShipment =
  typeof warehouseTransferShipments.$inferInsert
export type NormalizedWarehouseTransferShipment = Omit<
  Shipment & WarehouseTransferShipment,
  "shipmentId"
>

export type DeliveryShipment = typeof deliveryShipments.$inferSelect
export type NewDeliveryShipment = typeof deliveryShipments.$inferInsert
export type NormalizedDeliveryShipment = Omit<
  Shipment & DeliveryShipment,
  "shipmentId"
>

export type Package = typeof packages.$inferSelect
export type NewPackage = typeof packages.$inferInsert

export type PackageStatusLog = typeof packageStatusLogs.$inferSelect
export type NewPackageStatusLog = typeof packageStatusLogs.$inferInsert

export type Activity = typeof activities.$inferSelect
export type NewActivity = typeof activities.$inferInsert

export type Vehicle = typeof vehicles.$inferSelect
export type NewVehicle = typeof vehicles.$inferInsert

export type Warehouse = typeof warehouses.$inferSelect
export type NewWarehouse = typeof warehouses.$inferInsert

import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import type * as schema from "@/server/db/schema"

import type {
  users,
  warehouseStaffs,
  drivers,
  driverAssignedAreas,
  overseasAgents,
  domesticAgents,
  shipments,
  shipmentPackages,
  shipmentLocations,
  incomingShipments,
  forwarderTransferShipments,
  warehouseTransferShipments,
  deliveryShipments,
  vehicles,
  inquiries,
  survey,
  warehouses,
  packages,
  packageStatusLogs,
  activities,
  packageCategories,
  webpushSubscriptions,
  webauthnCredentials,
  deliverableProvinces,
  provinces,
  cities,
  barangays,
  uploadedManifests,
  missingPackages,
} from "./schema"

export type DbWithEntities = NodePgDatabase<typeof schema>

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type PublicUser = Omit<User, "hashedPassword">

export type WarehouseStaff = typeof warehouseStaffs.$inferSelect
export type NewWarehouseStaff = typeof warehouseStaffs.$inferInsert
export type NormalizedPublicWarehouseStaffUser = Omit<
  PublicUser & WarehouseStaff,
  "userId"
>

export type Driver = typeof drivers.$inferSelect
export type NewDriver = typeof drivers.$inferInsert
export type NormalizedPublicDriverUser = Omit<PublicUser & Driver, "userId">

export type DriverAssignedArea = typeof driverAssignedAreas.$inferSelect
export type NewDriverAssignedArea = typeof driverAssignedAreas.$inferInsert

export type OverseasAgent = typeof overseasAgents.$inferSelect
export type NewOverseasAgent = typeof overseasAgents.$inferInsert
export type NormalizedPublicOverseasAgentUser = Omit<
  PublicUser & OverseasAgent,
  "userId"
>

export type UploadedManifest = typeof uploadedManifests.$inferSelect
export type NewUploadedManifest = typeof uploadedManifests.$inferInsert

export type DomesticAgent = typeof domesticAgents.$inferSelect
export type NewDomesticAgent = typeof domesticAgents.$inferInsert
export type NormalizedPublicDomesticAgentUser = Omit<
  PublicUser & DomesticAgent,
  "userId"
>

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

export type MissingPackage = typeof missingPackages.$inferSelect
export type NewMissingPackage = typeof missingPackages.$inferInsert

export type PackageStatusLog = typeof packageStatusLogs.$inferSelect
export type NewPackageStatusLog = typeof packageStatusLogs.$inferInsert

export type Activity = typeof activities.$inferSelect
export type NewActivity = typeof activities.$inferInsert

export type Vehicle = typeof vehicles.$inferSelect
export type NewVehicle = typeof vehicles.$inferInsert

export type Inquiries = typeof inquiries.$inferSelect
export type NewInquiries = typeof inquiries.$inferInsert

export type Survey = typeof survey.$inferSelect
export type NewSurvey = typeof survey.$inferInsert

export type PackageCategory = typeof packageCategories.$inferSelect
export type NewPackageCategory = typeof packageCategories.$inferInsert

export type Warehouse = typeof warehouses.$inferSelect
export type NewWarehouse = typeof warehouses.$inferInsert

export type WebpushSubscription = typeof webpushSubscriptions.$inferSelect
export type NewWebpushSubscription = typeof webpushSubscriptions.$inferInsert

export type WebauthnCredential = typeof webauthnCredentials.$inferSelect
export type NewWebauthnCredential = typeof webauthnCredentials.$inferInsert

export type DeliverableProvince = typeof deliverableProvinces.$inferSelect
export type NewDeliverableProvince = typeof deliverableProvinces.$inferInsert

export type Province = typeof provinces.$inferSelect
export type NewProvince = typeof provinces.$inferInsert

export type City = typeof cities.$inferSelect
export type NewCity = typeof cities.$inferInsert

export type Barangay = typeof barangays.$inferSelect
export type NewBarangay = typeof barangays.$inferInsert

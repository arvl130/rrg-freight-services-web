export const supportedGenders = ["MALE", "FEMALE", "OTHER"] as const
export type Gender = (typeof supportedGenders)[number]

export const supportedRoles = [
  "ADMIN",
  "WAREHOUSE",
  "OVERSEAS_AGENT",
  "DOMESTIC_AGENT",
  "RIDER",
] as const
export type Role = (typeof supportedRoles)[number]

export const supportedPackageStatuses = [
  "IN_WAREHOUSE",
  "SORTING",
  "SHIPPING",
  // FIXME: The current structure makes it imperative that
  // a package goes straight back to IN_WAREHOUSE, *before*
  // the shipment it belongs to even transitions to ARRIVED
  // state.
  //
  // Maybe add a status here called SHIPPED or SORTED.
  // So that before a package reaches IN_WAREHOUSE or SHIPPING,
  // there is an interstitial step, that prevents shipments
  // and packages from being updated *not* at the same time
  // in the UI.
  "DELIVERING",
  "DELIVERED",
  "TRANSFERRED",
] as const
export type PackageStatus = (typeof supportedPackageStatuses)[number]

const shipmentStatuses = {
  PREPARING: "Preparing",
  IN_TRANSIT: "In Transit",
  ARRIVED: "Arrived",
  FAILED: "Failed",
} as const

export const SUPPORTED_SHIPMENT_STATUSES = Object.keys(shipmentStatuses)
export type ShipmentStatus = keyof typeof shipmentStatuses
export function supportedShipmentStatusToHumanized(
  shipmentStatus: ShipmentStatus,
) {
  return shipmentStatuses[shipmentStatus]
}

export const supportedShippingParties = ["FIRST_PARTY", "THIRD_PARTY"] as const
export type ShippingParty = (typeof supportedShippingParties)[number]

export const supportedShippingModes = ["AIR", "SEA"] as const
export type ShippingMode = (typeof supportedShippingModes)[number]

export const SUPPORTED_SHIPPING_TYPES = ["STANDARD", "EXPRESS"] as const
export type ShippingType = (typeof SUPPORTED_SHIPPING_TYPES)[number]

export const supportedReceptionModes = ["FOR_PICKUP", "DOOR_TO_DOOR"] as const
export type ReceptionMode = (typeof supportedReceptionModes)[number]

export const supportedHubRoles = [
  "SENDING",
  "RECEIVING",
  "SENDING_RECEIVING",
] as const
export type HubRole = (typeof supportedHubRoles)[number]

export type UsersTableItemScreen =
  | "OVERVIEW"
  | "MENU"
  | "UPDATE_INFO"
  | "UPDATE_ROLE"
  | "UPDATE_PHOTO"

export const LEAFLET_DEFAULT_ZOOM_LEVEL = 16
export const REGEX_ONE_OR_MORE_DIGITS = /^\d+$/

// FIXME: This should be more dynamic and include origin or destination hub
// information, as well as who's responsible for a specific action or status
// change.
const packageStatusLogWithDescriptions: Record<PackageStatus, string> = {
  IN_WAREHOUSE: "Package has been received at one of our hubs.",
  SORTING: "Package has been added to a shipment and is now being sorted.",
  SHIPPING: "Package is being shipped.",
  DELIVERING: "Package is now being delivered.",
  DELIVERED: "Package has been delivered.",
  TRANSFERRED: "Package has been transferred.",
}

export function getDescriptionForNewPackageStatusLog(
  packageStatus: PackageStatus,
) {
  return packageStatusLogWithDescriptions[packageStatus] ?? ""
}

const shipmentStatusLogWithDescriptions: Record<ShipmentStatus, string> = {
  PREPARING: "Shipment is currently being prepared.",
  IN_TRANSIT: "Shipment is currently in transit.",
  ARRIVED: "Shipment has arrived in its destination.",
  FAILED: "Shipment failed to reach its destination.",
}

export function getDescriptionForNewShipmentStatusLog(
  shipmentStatus: ShipmentStatus,
) {
  return shipmentStatusLogWithDescriptions[shipmentStatus] ?? ""
}

export const supportedVehicleTypes = ["TRUCK", "VAN", "MOTORCYCLE"] as const
export type VehicleType = (typeof supportedVehicleTypes)[number]

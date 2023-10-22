export const supportedGenders = ["MALE", "FEMALE", "OTHER"] as const
export type Gender = (typeof supportedGenders)[number]

export const supportedRoles = [
  "ADMIN",
  "WAREHOUSE",
  "OVERSEAS_AGENT",
  "DOMESTIC_AGENT",
] as const
export type Role = (typeof supportedRoles)[number]

export const supportedPackageStatuses = [
  "PENDING",
  "PREPARED_BY_AGENT",
  "SHIPPED_BY_AGENT",
  "ARRIVED_IN_PH",
  "IN_WAREHOUSE",
  "SORTING",
  "IN_TRANSIT_TO_THIRD_PARTY",
  "ARRIVED_AT_THIRD_PARTY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const
export type PackageStatus = (typeof supportedPackageStatuses)[number]

// TODO: Instead of duplicating status enum from packages,
// perhaps we can split the state across these two entities?
export const supportedShipmentStatuses = [
  "PENDING",
  "PREPARED_BY_AGENT",
  "SHIPPED_BY_AGENT",
  "ARRIVED_AT_DESTINATION",
] as const
export type ShipmentStatus = (typeof supportedShipmentStatuses)[number]

export const supportedShippingParties = ["FIRST_PARTY", "THIRD_PARTY"] as const
export type ShippingParty = (typeof supportedShippingParties)[number]

export const supportedShippingModes = ["AIR", "SEA"] as const
export type ShippingMode = (typeof supportedShippingModes)[number]

export const supportedShippingTypes = ["STANDARD", "EXPRESS"] as const
export type ShippingType = (typeof supportedShippingTypes)[number]

export const supportedReceptionModes = ["FOR_PICKUP", "DOOR_TO_DOOR"] as const
export type ReceptionMode = (typeof supportedReceptionModes)[number]

export const supportedHubRoles = [
  "SENDING",
  "RECEIVING",
  "SENDING_RECEIVING",
] as const
export type HubRole = (typeof supportedHubRoles)[number]

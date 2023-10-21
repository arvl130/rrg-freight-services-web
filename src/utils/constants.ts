export const supportedGenders = ["MALE", "FEMALE", "OTHER"] as const
export type Gender = (typeof supportedGenders)[number]

export const supportedSessionRoles = [
  "ADMIN",
  "WAREHOUSE",
  "OVERSEAS_AGENT",
  "DOMESTIC_AGENT",
] as const
export type SessionRole = (typeof supportedSessionRoles)[number]

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
  "ARRIVED_IN_PH",
] as const
export type ShipmentStatus = (typeof supportedShipmentStatuses)[number]

export const supportedShippers = ["FIRST_PARTY", "THIRD_PARTY"] as const
export type Shipper = (typeof supportedShippers)[number]

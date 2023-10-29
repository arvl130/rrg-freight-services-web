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
] as const
export type PackageStatus = (typeof supportedPackageStatuses)[number]

export const supportedShipmentStatuses = [
  "PREPARING",
  "IN_TRANSIT",
  "ARRIVED",
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

export type UsersTableItemScreen =
  | "OVERVIEW"
  | "MENU"
  | "UPDATE_INFO"
  | "UPDATE_ROLE"
  | "UPDATE_PHOTO"

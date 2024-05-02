export const SUPPORTED_GENDERS = ["MALE", "FEMALE", "OTHER"] as const
export type Gender = (typeof SUPPORTED_GENDERS)[number]

export const SUPPORTED_USER_ROLES = [
  "ADMIN",
  "WAREHOUSE",
  "DRIVER",
  "OVERSEAS_AGENT",
  "DOMESTIC_AGENT",
] as const
export type UserRole = (typeof SUPPORTED_USER_ROLES)[number]

export const SUPPORTED_PACKAGE_STATUSES = [
  "INCOMING",
  "IN_WAREHOUSE",
  "PREPARING_FOR_TRANSFER",
  "PREPARING_FOR_DELIVERY",
  "OUT_FOR_DELIVERY",
  "ARRIVING",
  "DELIVERED",
  "FAILED_DELIVERY",
  "TRANSFERRING_WAREHOUSE",
  "TRANSFERRING_FORWARDER",
  "TRANSFERRED_FORWARDER",
] as const
export type PackageStatus = (typeof SUPPORTED_PACKAGE_STATUSES)[number]

export const SUPPORTED_PACKAGE_SHIPPING_MODES = ["AIR", "SEA"] as const
export type PackageShippingMode =
  (typeof SUPPORTED_PACKAGE_SHIPPING_MODES)[number]

export const SUPPORTED_PACKAGE_SHIPPING_TYPES = ["STANDARD", "EXPRESS"] as const
export type PackageShippingType =
  (typeof SUPPORTED_PACKAGE_SHIPPING_TYPES)[number]

export const SUPPORTED_PACKAGE_RECEPTION_MODES = [
  "FOR_PICKUP",
  "DOOR_TO_DOOR",
] as const
export type PackageReceptionMode =
  (typeof SUPPORTED_PACKAGE_RECEPTION_MODES)[number]

export const SUPPORTED_PACKAGE_REMARKS = [
  "GOOD_CONDITION",
  "BAD_CONDITION",
] as const
export type PackageRemarks = (typeof SUPPORTED_PACKAGE_REMARKS)[number]

export const SUPPORTED_SHIPMENT_PACKAGE_STATUSES = [
  "PREPARING",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "FAILED",
] as const
export type ShipmentPackageStatus =
  (typeof SUPPORTED_SHIPMENT_PACKAGE_STATUSES)[number]

export const SUPPORTED_SHIPMENT_STATUSES = [
  "PREPARING",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "FAILED",
] as const
export type ShipmentStatus = (typeof SUPPORTED_SHIPMENT_STATUSES)[number]

const shipmentStatusHumanized: Record<ShipmentStatus, string> = {
  PREPARING: "Preparing",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out For Delivery",
  COMPLETED: "Completed",
  FAILED: "Failed",
}

export function supportedShipmentStatusToHumanized(
  shipmentStatus: ShipmentStatus,
) {
  return shipmentStatusHumanized[shipmentStatus]
}

export const SUPPORTED_SHIPMENT_TYPES = [
  "INCOMING",
  "TRANSFER_WAREHOUSE",
  "TRANSFER_FORWARDER",
  "DELIVERY",
] as const
export type ShipmentType = (typeof SUPPORTED_SHIPMENT_TYPES)[number]

export const SUPPORED_HUB_ROLES = [
  "SENDING",
  "RECEIVING",
  "SENDING_RECEIVING",
] as const
export type HubRole = (typeof SUPPORED_HUB_ROLES)[number]

export type UsersTableItemScreen =
  | "OVERVIEW"
  | "MENU"
  | "UPDATE_INFO"
  | "UPDATE_ROLE"
  | "UPDATE_PHOTO"

export const LEAFLET_DEFAULT_ZOOM_LEVEL = 16
export const REGEX_ONE_OR_MORE_DIGITS = /^\d+$/
export const REGEX_EMPTY_STRING_OR_ONE_OR_MORE_DIGITS = /^(\d+|)$/
export const REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS = /^\d+\.?\d*$/
export const REGEX_HTML_INPUT_DATESTR = /^\d{4}-\d{2}-\d{2}$/
export const REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS_INSIDE_PARENTHESIS =
  /\((\d*\.?\d+)\s/

type NewPackageStatusDescriptionOptions =
  | {
      status:
        | "INCOMING"
        | "PREPARING_FOR_TRANSFER"
        | "OUT_FOR_DELIVERY"
        | "DELIVERED"
        | "PREPARING_FOR_DELIVERY"
        | "ARRIVING"
    }
  | {
      status: "IN_WAREHOUSE" | "TRANSFERRING_WAREHOUSE"
      warehouseName: string
    }
  | {
      status: "TRANSFERRING_FORWARDER" | "TRANSFERRED_FORWARDER"
      forwarderName: string
    }
  | {
      status: "FAILED_DELIVERY"
      reason: string
    }

export function getDescriptionForNewPackageStatusLog(
  options: NewPackageStatusDescriptionOptions,
) {
  if (options.status === "INCOMING")
    return "Your package is in transit to our warehouse."

  if (options.status === "IN_WAREHOUSE")
    return `Your package has been received at our warehouse (${options.warehouseName}).`

  if (options.status === "PREPARING_FOR_DELIVERY")
    return "Your package is being prepared for delivery."

  if (options.status === "PREPARING_FOR_TRANSFER")
    return "Your package is being prepared for transfer."

  if (options.status === "TRANSFERRING_WAREHOUSE")
    return `Your package is being transferred to another warehouse (${options.warehouseName}).`

  if (options.status === "OUT_FOR_DELIVERY" || options.status === "ARRIVING")
    return "Your package is out for delivery."

  if (options.status === "DELIVERED") return "Your package has been delivered."

  if (options.status === "TRANSFERRING_FORWARDER")
    return `Your package is being transferred to another forwarder (${options.forwarderName}).`

  if (options.status === "TRANSFERRED_FORWARDER")
    return `Your package has been transferred to another forwarder (${options.forwarderName}).`

  if (options.status === "FAILED_DELIVERY")
    return `The delivery attempt for your package has failed. Reason: ${options.reason}`

  return ""
}

const shipmentStatusLogWithDescriptions: Record<ShipmentStatus, string> = {
  PREPARING: "Shipment is currently being prepared.",
  IN_TRANSIT: "Shipment is currently in transit.",
  OUT_FOR_DELIVERY: "Shipment is currently out for delivery.",
  COMPLETED: "Shipment has succesfully reached its destination.",
  FAILED: "Shipment failed to reach its destination.",
}

export function getDescriptionForNewShipmentStatusLog(
  shipmentStatus: ShipmentStatus,
) {
  return shipmentStatusLogWithDescriptions[shipmentStatus] ?? ""
}

export const SUPPORTED_VEHICLE_TYPES = ["TRUCK", "VAN"] as const
export type VehicleType = (typeof SUPPORTED_VEHICLE_TYPES)[number]

export const SUPPORTED_ACTIVITY_VERB = [
  "CREATE",
  "READ",
  "UPDATE",
  "DELETE",
] as const
export type ActivityVerb = (typeof SUPPORTED_ACTIVITY_VERB)[number]

export const SUPPORTED_ACTIVITY_ENTITY = [
  "PACKAGE",
  "SHIPMENT_PACKAGE",
  "SHIPMENT_PACKAGE_OTP",
  "SHIPMENT",
  "SHIPMENT_LOCATION",
  "INCOMING_SHIPMENT",
  "DELIVERY_SHIPMENT",
  "TRANSFER_FORWARDER_SHIPMENT",
  "TRANSFER_WAREHOUSE_SHIPMENT",
  "USER",
  "VEHICLE",
  "WAREHOUSE",
  "PACKAGE_CATEGORY",
  "DELIVERABLE_PROVINCE",
] as const
export type ActivityEntity = (typeof SUPPORTED_ACTIVITY_ENTITY)[number]

export const SUPPORTED_AUTHENTICATOR_TRANSPORT_TYPES = [
  "ble",
  "cable",
  "hybrid",
  "internal",
  "nfc",
  "smart-card",
  "usb",
] as const

export const SUPPORTED_UPLOADED_MANIFEST_STATUS = [
  "PENDING_REVIEW",
  "REUPLOAD_REQUESTED",
  "SHIPMENT_CREATED",
] as const

export type UploadedManifestStatus =
  (typeof SUPPORTED_UPLOADED_MANIFEST_STATUS)[number]

// Source: https://dev.mysql.com/doc/refman/8.0/en/string-type-syntax.html
export const MYSQL_TEXT_COLUMN_DEFAULT_LIMIT = 65_535
export const MYSQL_ERROR_DUPLICATE_ENTRY = 1062

export const CLIENT_TIMEZONE = "Asia/Manila"

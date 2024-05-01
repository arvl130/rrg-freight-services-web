import type {
  PackageStatus,
  UserRole,
  PackageShippingType,
  ShipmentStatus,
  UploadedManifestStatus,
} from "./constants"

export function toTitleCase(word: string) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}
export function getHumanizedOfUserRole(supportedRole: UserRole) {
  return supportedRole
    .toLowerCase()
    .split("_")
    .map((word) => toTitleCase(word))
    .join(" ")
}

export function getHumanizedOfPackageStatus(packageStatus: PackageStatus) {
  return packageStatus
    .toLowerCase()
    .split("_")
    .map((word) => toTitleCase(word))
    .join(" ")
}

export function getHumanizedOfShipmentStatus(shipmentStatus: ShipmentStatus) {
  return shipmentStatus
    .toLowerCase()
    .split("_")
    .map((word) => toTitleCase(word))
    .join(" ")
}

const displayNameOfshippingTypes: Record<PackageShippingType, string> = {
  STANDARD: "Standard",
  EXPRESS: "Express",
}

export function getHumanizedOfPackageShippingType(
  shippingType: PackageShippingType,
) {
  return displayNameOfshippingTypes[shippingType]
}

const displayNameOfuploadedManifestStatus: Record<
  UploadedManifestStatus,
  string
> = {
  PENDING_REVIEW: "Pending Review",
  REUPLOAD_REQUESTED: "Reupload Requested",
  SHIPMENT_CREATED: "Shipment Created",
}

export function getHumanizedOfuploadedManifestStatus(
  status: UploadedManifestStatus,
) {
  return displayNameOfuploadedManifestStatus[status]
}

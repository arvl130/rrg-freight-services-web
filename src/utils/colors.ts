import type {
  ActivityVerb,
  PackageStatus,
  ShipmentStatus,
  UploadedManifestStatus,
} from "./constants"

const packageStatusColors: Record<PackageStatus, string> = {
  INCOMING: "bg-blue-500",
  IN_WAREHOUSE: "bg-pink-500",
  PREPARING_FOR_TRANSFER: "bg-cyan-400",
  PREPARING_FOR_DELIVERY: "bg-cyan-400",
  TRANSFERRING_FORWARDER: "bg-blue-500",
  TRANSFERRING_WAREHOUSE: "bg-blue-500",
  OUT_FOR_DELIVERY: "bg-blue-500",
  ARRIVING: "bg-blue-500",
  DELIVERED: "bg-green-500",
  TRANSFERRED_FORWARDER: "bg-orange-500",
  FAILED_DELIVERY: "bg-red-500",
}

export function getColorFromPackageStatus(status: PackageStatus) {
  return packageStatusColors[status] ?? ""
}

const shipmentStatusColors: Record<ShipmentStatus, string> = {
  PREPARING: "bg-pink-500",
  IN_TRANSIT: "bg-blue-500",
  OUT_FOR_DELIVERY: "bg-blue-500",
  COMPLETED: "bg-green-500",
  FAILED: "bg-red-500",
}

export function getColorFromShipmentStatus(status: ShipmentStatus) {
  return shipmentStatusColors[status] ?? ""
}

const activityVerbColors: Record<ActivityVerb, string> = {
  CREATE: "bg-yellow-500",
  READ: "bg-green-500",
  UPDATE: "bg-purple-500",
  DELETE: "bg-red-500",
}

export function getColorFromActivityVerb(status: ActivityVerb) {
  return activityVerbColors[status] ?? ""
}

const uploadedManifestStatusColors: Record<UploadedManifestStatus, string> = {
  PENDING_REVIEW: "bg-purple-500",
  SHIPMENT_CREATED: "bg-green-500",
  REUPLOAD_REQUESTED: "bg-red-500",
}

export function getColorOfUploadedManifestStatus(
  status: UploadedManifestStatus,
) {
  return uploadedManifestStatusColors[status] ?? ""
}

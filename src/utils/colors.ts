import { PackageStatus, ShipmentStatus } from "./constants"

const packageStatusColors: Record<PackageStatus, string> = {
  FOR_APPROVAL: "bg-amber-500",
  IN_WAREHOUSE: "bg-pink-500",
  SORTING: "bg-cyan-400",
  SHIPPING: "bg-blue-500",
  DELIVERING: "bg-orange-500",
  DELIVERED: "bg-green-500",
  TRANSFERRED: "bg-red-500",
}

export function getColorFromPackageStatus(status: PackageStatus) {
  return packageStatusColors[status] ?? ""
}

const shipmentStatusColors: Record<ShipmentStatus, string> = {
  PREPARING: "bg-pink-500",
  IN_TRANSIT: "bg-blue-500",
  ARRIVED: "bg-green-500",
  FAILED: "bg-red-500",
}

export function getColorFromShipmentStatus(status: ShipmentStatus) {
  return shipmentStatusColors[status] ?? ""
}

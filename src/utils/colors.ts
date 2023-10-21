import { PackageStatus } from "./constants"

const packageStatusColors: Record<PackageStatus, string> = {
  PENDING: "bg-gray-400",
  PREPARED_BY_AGENT: "bg-pink-500",
  SHIPPED_BY_AGENT: "bg-blue-500",
  ARRIVED_IN_PH: "bg-green-500",
  IN_WAREHOUSE: "bg-pink-500",
  SORTING: "bg-cyan-400",
  IN_TRANSIT_TO_THIRD_PARTY: "bg-orange-500",
  ARRIVED_AT_THIRD_PARTY: "bg-blue-500",
  OUT_FOR_DELIVERY: "bg-orange-500",
  DELIVERED: "bg-green-500",
}

export function getColorFromPackageStatus(status: PackageStatus) {
  return packageStatusColors[status] ?? ""
}

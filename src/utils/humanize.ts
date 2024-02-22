import type { PackageStatus, UserRole, PackageShippingType } from "./constants"

export function toTitleCase(word: string) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}
export function supportedRoleToHumanized(supportedRole: UserRole) {
  return supportedRole
    .toLowerCase()
    .split("_")
    .map((word) => toTitleCase(word))
    .join(" ")
}

export function supportedPackageStatusToHumanized(
  packageStatus: PackageStatus,
) {
  return packageStatus
    .toLowerCase()
    .split("_")
    .map((word) => toTitleCase(word))
    .join(" ")
}

const displayNameOfshippingTypes: Record<PackageShippingType, string> = {
  STANDARD: "Standard",
  EXPRESS: "Express",
}

export function supportedShippingTypeToHumanized(
  shippingType: PackageShippingType,
) {
  return displayNameOfshippingTypes[shippingType]
}

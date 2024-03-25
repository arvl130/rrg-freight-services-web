import type { PackageStatus, UserRole, PackageShippingType } from "./constants"

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

const displayNameOfshippingTypes: Record<PackageShippingType, string> = {
  STANDARD: "Standard",
  EXPRESS: "Express",
}

export function getHumanizedOfPackageShippingType(
  shippingType: PackageShippingType,
) {
  return displayNameOfshippingTypes[shippingType]
}

import { PackageStatus, Role, ShippingType } from "./constants"

export function toTitleCase(word: string) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}
export function supportedRoleToHumanized(supportedRole: Role) {
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

const displayNameOfshippingTypes: Record<ShippingType, string> = {
  STANDARD: "Standard",
  EXPRESS: "Express",
}

export function supportedShippingTypeToHumanized(shippingType: ShippingType) {
  return displayNameOfshippingTypes[shippingType]
}

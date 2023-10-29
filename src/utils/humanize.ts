import { Role } from "./constants"

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

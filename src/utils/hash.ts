import { createHash } from "crypto"

export function stringToSha256Hash(input: string) {
  return createHash("sha256").update(input).digest("hex")
}

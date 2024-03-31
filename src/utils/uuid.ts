import { generateId } from "lucia"
import { customAlphabet } from "nanoid"

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const nanoid = customAlphabet(alphabet, 12)
export function generateUniqueId() {
  return `RRG-${nanoid()}`
}

export function generateOtp() {
  return Math.floor(Math.random() * 900000) + 100000
}

export function generateUserId() {
  return generateId(28)
}

export function generatePasswordResetToken() {
  return generateId(72)
}

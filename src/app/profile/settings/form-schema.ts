import type { Gender } from "@/utils/constants"
import { SUPPORTED_GENDERS } from "@/utils/constants"
import { z } from "zod"

export const updateDetailsInputSchema = z.object({
  displayName: z
    .string()
    .min(1, {
      message: "Display name is required.",
    })
    .max(100, {
      message: "Display name is too long.",
    }),
  contactNumber: z
    .string()
    .min(1, {
      message: "Contact number is required.",
    })
    .max(15, {
      message: "Contac number is too long.",
    }),
  emailAddress: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .max(100, {
      message: "Email is too long.",
    })
    .email({
      message: "Email has invalid format.",
    }),
  gender: z.custom<Gender>((val) => SUPPORTED_GENDERS.includes(val as Gender)),
})

import { z } from "zod"

export const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: "Please enter your email.",
    })
    .email({
      message: "This email has an invalid format.",
    }),
  password: z.string().trim().min(1, {
    message: "Please enter your password.",
  }),
})

import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string().min(1).url(),
    DATABASE_MODE: z.union([z.literal("default"), z.literal("planetscale")]),
    FIREBASE_ADMIN_PROJECT_ID: z.string().min(1),
    FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1),
    FIREBASE_ADMIN_CLIENT_EMAIL: z.string().min(1).email(),
    RESEND_API_KEY: z.string().min(1),
    IS_EMAIL_ENABLED: z.union([z.literal(0), z.literal(1)]),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_MODE: process.env.DATABASE_MODE,
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    IS_EMAIL_ENABLED: process.env.IS_EMAIL_ENABLED,
  },
})

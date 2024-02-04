import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const serverEnv = createEnv({
  server: {
    APP_ENV: z.union([z.literal("development"), z.literal("production")]),
    DEV_DATABASE_URL: z.string().min(1).url(),
    DEV_DATABASE_MODE: z.union([
      z.literal("default"),
      z.literal("planetscale"),
    ]),
    PROD_DATABASE_URL: z.string().min(1).url(),
    PROD_DATABASE_MODE: z.union([
      z.literal("default"),
      z.literal("planetscale"),
    ]),
    FIREBASE_ADMIN_PROJECT_ID: z.string().min(1),
    FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1),
    FIREBASE_ADMIN_CLIENT_EMAIL: z.string().min(1).email(),
    RESEND_API_KEY: z.string().min(1),
    MAIL_FROM_URL: z.string().min(1),
    IS_EMAIL_ENABLED: z.union([z.literal("0"), z.literal("1")]),
    SMS_API_URL: z.string().min(1).url(),
    SMS_API_KEY: z.string().min(1),
    IS_SMS_ENABLED: z.union([z.literal("0"), z.literal("1")]),
  },
  runtimeEnv: {
    APP_ENV: process.env.APP_ENV,
    DEV_DATABASE_URL: process.env.DEV_DATABASE_URL,
    DEV_DATABASE_MODE: process.env.DEV_DATABASE_MODE,
    PROD_DATABASE_URL: process.env.PROD_DATABASE_URL,
    PROD_DATABASE_MODE: process.env.PROD_DATABASE_MODE,
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    MAIL_FROM_URL: process.env.MAIL_FROM_URL,
    IS_EMAIL_ENABLED: process.env.IS_EMAIL_ENABLED,
    SMS_API_URL: process.env.SMS_API_URL,
    SMS_API_KEY: process.env.SMS_API_KEY,
    IS_SMS_ENABLED: process.env.IS_SMS_ENABLED,
  },
})

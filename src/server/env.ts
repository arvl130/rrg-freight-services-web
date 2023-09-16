import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const serverEnv = createEnv({
  server: {
    DATABASE_HOST: z.string().min(1),
    DATABASE_USER: z.string().min(1),
    DATABASE_PASS: z.string().min(1),
    DATABASE_NAME: z.string().min(1),
    FIREBASE_ADMIN_PROJECT_ID: z.string().min(1),
    FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1),
    FIREBASE_ADMIN_CLIENT_EMAIL: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASS: process.env.DATABASE_PASS,
    DATABASE_NAME: process.env.DATABASE_NAME,
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  },
})

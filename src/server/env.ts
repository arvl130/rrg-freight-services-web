import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    DATABASE_MODE: z.union([z.literal("default"), z.literal("planetscale")]),
    FIREBASE_ADMIN_PROJECT_ID: z.string().min(1),
    FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1),
    FIREBASE_ADMIN_CLIENT_EMAIL: z.string().min(1),
    TEST_USER_ID_ADMIN: z.string().length(28),
    TEST_USER_ID_WAREHOUSE: z.string().length(28),
    TEST_USER_ID_OVERSEAS: z.string().length(28),
    TEST_USER_ID_DOMESTIC: z.string().length(28),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_MODE: process.env.DATABASE_MODE,
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    TEST_USER_ID_ADMIN: process.env.TEST_USER_ID_ADMIN,
    TEST_USER_ID_WAREHOUSE: process.env.TEST_USER_ID_WAREHOUSE,
    TEST_USER_ID_OVERSEAS: process.env.TEST_USER_ID_OVERSEAS,
    TEST_USER_ID_DOMESTIC: process.env.TEST_USER_ID_DOMESTIC,
  },
})

import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    DATABASE_MODE: z.union([z.literal("default"), z.literal("planetscale")]),
    FIREBASE_ADMIN_PROJECT_ID: z.string().min(1),
    FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1),
    FIREBASE_ADMIN_CLIENT_EMAIL: z.string().min(1),
    TEST_ADMIN_USER_ID: z.string().min(1),
    TEST_ADMIN_EMAIL: z.string().email(),
    TEST_WAREHOUSE_USER_ID: z.string().min(1),
    TEST_WAREHOUSE_EMAIL: z.string().email(),
    TEST_OVERSEAS_USER_ID: z.string().min(1),
    TEST_OVERSEAS_EMAIL: z.string().email(),
    TEST_DOMESTIC_USER_ID: z.string().min(1),
    TEST_DOMESTIC_EMAIL: z.string().email(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_MODE: process.env.DATABASE_MODE,
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    TEST_ADMIN_USER_ID: process.env.TEST_ADMIN_USER_ID,
    TEST_ADMIN_EMAIL: process.env.TEST_ADMIN_EMAIL,
    TEST_WAREHOUSE_USER_ID: process.env.TEST_WAREHOUSE_USER_ID,
    TEST_WAREHOUSE_EMAIL: process.env.TEST_WAREHOUSE_EMAIL,
    TEST_OVERSEAS_USER_ID: process.env.TEST_OVERSEAS_USER_ID,
    TEST_OVERSEAS_EMAIL: process.env.TEST_OVERSEAS_EMAIL,
    TEST_DOMESTIC_USER_ID: process.env.TEST_DOMESTIC_USER_ID,
    TEST_DOMESTIC_EMAIL: process.env.TEST_DOMESTIC_EMAIL,
  },
})

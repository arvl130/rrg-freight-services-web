import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const seedEnv = createEnv({
  server: {
    TEST_ADMIN_USER_ID: z.string().length(28),
    TEST_ADMIN_EMAIL: z.string().min(1).max(100).email(),
    TEST_WAREHOUSE_USER_ID: z.string().length(28),
    TEST_WAREHOUSE_EMAIL: z.string().min(1).max(100).email(),
    TEST_OVERSEAS_USER_ID: z.string().length(28),
    TEST_OVERSEAS_EMAIL: z.string().min(1).max(100).email(),
    TEST_DOMESTIC_USER_ID: z.string().length(28),
    TEST_DOMESTIC_EMAIL: z.string().min(1).max(100).email(),
    TEST_RIDER_USER_ID: z.string().length(28),
    TEST_RIDER_EMAIL: z.string().min(1).max(100).email(),
  },
  runtimeEnv: {
    TEST_ADMIN_USER_ID: process.env.TEST_ADMIN_USER_ID,
    TEST_ADMIN_EMAIL: process.env.TEST_ADMIN_EMAIL,
    TEST_WAREHOUSE_USER_ID: process.env.TEST_WAREHOUSE_USER_ID,
    TEST_WAREHOUSE_EMAIL: process.env.TEST_WAREHOUSE_EMAIL,
    TEST_OVERSEAS_USER_ID: process.env.TEST_OVERSEAS_USER_ID,
    TEST_OVERSEAS_EMAIL: process.env.TEST_OVERSEAS_EMAIL,
    TEST_DOMESTIC_USER_ID: process.env.TEST_DOMESTIC_USER_ID,
    TEST_DOMESTIC_EMAIL: process.env.TEST_DOMESTIC_EMAIL,
    TEST_RIDER_USER_ID: process.env.TEST_RIDER_USER_ID,
    TEST_RIDER_EMAIL: process.env.TEST_RIDER_EMAIL,
  },
})

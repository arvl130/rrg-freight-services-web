import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const seedEnv = createEnv({
  server: {
    TEST_ADMIN_USER_ID: z.string().length(28),
    TEST_ADMIN_EMAIL: z.string().min(1).max(100).email(),
    TEST_ADMIN_PASSWORD: z.string().min(1),
    TEST_WAREHOUSE_USER_ID: z.string().length(28),
    TEST_WAREHOUSE_EMAIL: z.string().min(1).max(100).email(),
    TEST_WAREHOUSE_PASSWORD: z.string().min(1),
    TEST_OVERSEAS_USER_ID: z.string().length(28),
    TEST_OVERSEAS_EMAIL: z.string().min(1).max(100).email(),
    TEST_OVERSEAS_PASSWORD: z.string().min(1),
    TEST_DOMESTIC_USER_ID: z.string().length(28),
    TEST_DOMESTIC_EMAIL: z.string().min(1).max(100).email(),
    TEST_DOMESTIC_PASSWORD: z.string().min(1),
    TEST_DRIVER_USER_ID: z.string().length(28),
    TEST_DRIVER_EMAIL: z.string().min(1).max(100).email(),
    TEST_DRIVER_PASSWORD: z.string().min(1),
  },
  runtimeEnv: {
    TEST_ADMIN_USER_ID: process.env.TEST_ADMIN_USER_ID,
    TEST_ADMIN_EMAIL: process.env.TEST_ADMIN_EMAIL,
    TEST_ADMIN_PASSWORD: process.env.TEST_ADMIN_PASSWORD,
    TEST_WAREHOUSE_USER_ID: process.env.TEST_WAREHOUSE_USER_ID,
    TEST_WAREHOUSE_EMAIL: process.env.TEST_WAREHOUSE_EMAIL,
    TEST_WAREHOUSE_PASSWORD: process.env.TEST_WAREHOUSE_PASSWORD,
    TEST_OVERSEAS_USER_ID: process.env.TEST_OVERSEAS_USER_ID,
    TEST_OVERSEAS_EMAIL: process.env.TEST_OVERSEAS_EMAIL,
    TEST_OVERSEAS_PASSWORD: process.env.TEST_OVERSEAS_PASSWORD,
    TEST_DOMESTIC_USER_ID: process.env.TEST_DOMESTIC_USER_ID,
    TEST_DOMESTIC_EMAIL: process.env.TEST_DOMESTIC_EMAIL,
    TEST_DOMESTIC_PASSWORD: process.env.TEST_DOMESTIC_PASSWORD,
    TEST_DRIVER_USER_ID: process.env.TEST_DRIVER_USER_ID,
    TEST_DRIVER_EMAIL: process.env.TEST_DRIVER_EMAIL,
    TEST_DRIVER_PASSWORD: process.env.TEST_DRIVER_PASSWORD,
  },
})

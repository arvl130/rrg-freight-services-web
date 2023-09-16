import "dotenv/config"
import type { Config } from "drizzle-kit"
import { serverEnv } from "./src/server/env"

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    host: serverEnv.DATABASE_HOST,
    user: serverEnv.DATABASE_USER,
    password: serverEnv.DATABASE_PASS,
    database: serverEnv.DATABASE_NAME,
  },
} satisfies Config

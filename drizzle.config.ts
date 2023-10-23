import "dotenv/config"
import type { Config } from "drizzle-kit"
import { serverEnv } from "./src/server/env.mjs"

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: serverEnv.DATABASE_URL,
  },
} satisfies Config

import { bigint, mysqlTable, varchar } from "drizzle-orm/mysql-core"

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  fullName: varchar("full_name", { length: 255 }),
})

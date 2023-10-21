import { protectedProcedure, router } from "../trpc"
import { packages } from "@/server/db/schema"

export const packageRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(packages)
  }),
})

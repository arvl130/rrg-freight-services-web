import { protectedProcedure, router } from "../trpc"
import { provinces } from "@/server/db/schema"

export const provinceRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(provinces)
  }),
})

import { z } from "zod"
import { protectedProcedure, router } from "../trpc"
import {
  transferShipmentPackages,
  transferShipments,
  packageStatusLogs,
} from "@/server/db/schema"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { ResultSetHeader } from "mysql2"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"

export const transferShipmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(transferShipments)
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(transferShipments)
        .where(eq(transferShipments.id, input.id))

      if (results.length === 0) return null
      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      return results[0]
    }),
  create: protectedProcedure
    .input(
      z.object({
        sentToAgentId: z.string().length(28),
        packageIds: z.number().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = (await ctx.db.insert(transferShipments).values({
        sentToAgentId: input.sentToAgentId,
        status: "PREPARING",
      })) as unknown as [ResultSetHeader]
      const transferShipmentId = result.insertId

      for (const packageId of input.packageIds) {
        await ctx.db.insert(transferShipmentPackages).values({
          packageId,
          transferShipmentId,
        })

        await ctx.db.insert(packageStatusLogs).values({
          packageId,
          createdById: ctx.user.uid,
          status: "SORTING",
          description: getDescriptionForNewPackageStatusLog("SORTING"),
        })
      }
    }),
})

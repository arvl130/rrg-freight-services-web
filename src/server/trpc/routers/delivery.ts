import { eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import {
  deliveryShipments,
  deliveryPackages,
  packageStatusLogs,
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { ResultSetHeader } from "mysql2"

export const deliveryRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(deliveryShipments)
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
        .from(deliveryShipments)
        .where(eq(deliveryShipments.id, input.id))

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      return results[0]
    }),
  getPreparing: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(deliveryShipments)
      .where(eq(deliveryShipments.status, "PREPARING"))
  }),
  updateStatusToInTransitById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(deliveryShipments)
        .set({
          status: "IN_TRANSIT",
        })
        .where(eq(deliveryShipments.id, input.id))
    }),
  updateStatusToCompletedById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(deliveryShipments)
        .set({
          status: "ARRIVED",
        })
        .where(eq(deliveryShipments.id, input.id))
    }),
  create: protectedProcedure
    .input(
      z.object({
        driverId: z.string().length(28),
        vehicleId: z.number(),
        packageIds: z.number().array().nonempty(),
        isExpress: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = (await ctx.db.insert(deliveryShipments).values({
        driverId: input.driverId,
        vehicleId: input.vehicleId,
        status: "PREPARING",
        isExpress: input.isExpress ? 1 : 0,
      })) as unknown as [ResultSetHeader]
      const deliveryId = result.insertId

      for (const packageId of input.packageIds) {
        await ctx.db.insert(deliveryPackages).values({
          deliveryId,
          packageId,
        })

        await ctx.db.insert(packageStatusLogs).values({
          packageId,
          createdById: ctx.user.uid,
          description: getDescriptionForNewPackageStatusLog("SORTING"),
          status: "SORTING",
          createdAt: new Date(),
        })
      }
    }),
})

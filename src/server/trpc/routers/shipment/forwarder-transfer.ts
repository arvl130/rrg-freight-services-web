import { z } from "zod"
import { protectedProcedure, router } from "../../trpc"
import {
  shipments,
  shipmentPackages,
  forwarderTransferShipments,
  packageStatusLogs,
} from "@/server/db/schema"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { ResultSetHeader } from "mysql2"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"

export const forwarderTransferShipmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(forwarderTransferShipments)
      .innerJoin(
        shipments,
        eq(forwarderTransferShipments.shipmentId, shipments.id),
      )

    return results.map(({ shipments, forwarder_transfer_shipments }) => ({
      ...shipments,
      ...forwarder_transfer_shipments,
    }))
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
        .from(shipments)
        .where(eq(shipments.id, input.id))

      if (results.length === 0) return null
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
      .from(shipments)
      .where(eq(shipments.status, "PREPARING"))
  }),
  getInTransit: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(shipments)
      .where(eq(shipments.status, "IN_TRANSIT"))
  }),
  updateStatusToInTransitById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(shipments)
        .set({
          status: "IN_TRANSIT",
        })
        .where(eq(shipments.id, input.id))
    }),
  updateStatusToCompletedById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(shipments)
        .set({
          status: "ARRIVED",
        })
        .where(eq(shipments.id, input.id))
    }),
  create: protectedProcedure
    .input(
      z.object({
        sentToAgentId: z.string().length(28),
        driverId: z.string().length(28),
        vehicleId: z.number(),
        packageIds: z.number().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = (await ctx.db.insert(shipments).values({
        type: "INCOMING",
        status: "IN_TRANSIT",
      })) as unknown as [ResultSetHeader]
      const shipmentId = result.insertId

      await ctx.db.insert(forwarderTransferShipments).values({
        shipmentId,
        sentToAgentId: input.sentToAgentId,
        driverId: input.driverId,
        vehicleId: input.vehicleId,
      })

      for (const packageId of input.packageIds) {
        await ctx.db.insert(shipmentPackages).values({
          packageId,
          shipmentId,
        })

        await ctx.db.insert(packageStatusLogs).values({
          packageId,
          createdById: ctx.user.uid,
          status: "SORTING",
          description: getDescriptionForNewPackageStatusLog("SORTING"),
          createdAt: new Date(),
        })
      }
    }),
  confirmTransferById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(forwarderTransferShipments)
        .set({
          isTransferConfirmed: 1,
        })
        .where(eq(forwarderTransferShipments.shipmentId, input.id))
    }),
})

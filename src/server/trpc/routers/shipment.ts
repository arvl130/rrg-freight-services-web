import { z } from "zod"
import { protectedProcedure, router } from "../trpc"
import {
  packageStatusLogs,
  shipmentHubs,
  shipmentPackages,
  shipments,
  shipmentStatusLogs,
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import { alias } from "drizzle-orm/mysql-core"
import { getShipmentHubIdOfUser } from "@/server/db/helpers/shipment-hub"
import { ResultSetHeader } from "mysql2"
import { PackageStatus } from "@/utils/constants"

export const shipmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(shipments)
  }),
  getLatestArrivedStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(shipmentStatusLogs)
        .where(
          and(
            eq(shipmentStatusLogs.shipmentId, input.id),
            eq(shipmentStatusLogs.status, "ARRIVED"),
          ),
        )

      if (results.length === 0) return null

      let latestStatus = results[0]
      for (const result of results) {
        if (result.createdAt.getTime() > latestStatus.createdAt.getTime())
          latestStatus = result
      }

      return latestStatus
    }),
  getLatestStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(shipmentStatusLogs)
        .where(eq(shipmentStatusLogs.shipmentId, input.id))

      if (results.length === 0) return null

      let latestStatus = results[0]
      for (const result of results) {
        if (result.createdAt.getTime() > latestStatus.createdAt.getTime())
          latestStatus = result
      }

      return latestStatus
    }),
  getAllWithOriginAndDestination: protectedProcedure.query(async ({ ctx }) => {
    const originHubs = alias(shipmentHubs, "origin_hubs")
    const destinationHubs = alias(shipmentHubs, "destination_hubs")
    const results = await ctx.db
      .select()
      .from(shipments)
      .innerJoin(originHubs, eq(shipments.originHubId, originHubs.id))
      .innerJoin(
        destinationHubs,
        eq(shipments.destinationHubId, destinationHubs.id),
      )

    return results.map(({ shipments, origin_hubs, destination_hubs }) => ({
      ...shipments,
      destinationHub: destination_hubs,
      originHub: origin_hubs,
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

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })
    }),
  create: protectedProcedure
    .input(
      z.object({
        packageIds: z.number().array().nonempty(),
        destinationHubId: z.number().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const originHubId = await getShipmentHubIdOfUser(ctx.db, ctx.user)

      await ctx.db.transaction(async (tx) => {
        const [result] = (await tx.insert(shipments).values({
          originHubId,
          destinationHubId: input.destinationHubId,
        })) as unknown as [ResultSetHeader]

        const shipmentId = result.insertId
        await tx.insert(shipmentPackages).values(
          input.packageIds.map((packageId) => ({
            shipmentId,
            packageId,
          })),
        )

        const createdAt = new Date()
        await tx.insert(packageStatusLogs).values(
          input.packageIds.map((packageId) => ({
            status: "SORTING" as PackageStatus,
            packageId,
            createdAt,
            createdById: ctx.user.uid,
            description:
              "Package has been added to a shipment and is being prepared by the agent.",
          })),
        )

        await tx.insert(shipmentStatusLogs).values({
          status: "PREPARING",
          shipmentId,
          createdAt,
          createdById: ctx.user.uid,
          description:
            "Shipment has been created and is waiting to be shipped.",
        })
      })
    }),
})

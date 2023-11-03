import { z } from "zod"
import { protectedProcedure, router } from "../trpc"
import {
  packages,
  packageStatusLogs,
  shipmentHubs,
  shipmentPackages,
  shipments,
  shipmentStatusLogs,
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import { alias } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"
import { Package, Shipment } from "@/server/db/entities"
import { ResultSetHeader } from "mysql2"
import { PackageStatus } from "@/utils/constants"
import { getShipmentHubIdOfUser } from "@/server/db/helpers/shipment-hub"

export const shipmentRouter = router({
  getWithShipmentPackagesById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(shipmentPackages)
        .innerJoin(shipments, eq(shipments.id, shipmentPackages.shipmentId))
        .innerJoin(packages, eq(packages.id, shipmentPackages.packageId))
        .where(eq(shipmentPackages.shipmentId, input.id))

      const shipmentItems: Shipment[] = []

      results.forEach((result) => {
        const isAdded = shipmentItems.some((shipment) => {
          shipment.id === result.shipments.id
        })

        if (!isAdded) {
          shipmentItems.push(result.shipments)
        }
      })

      async function getLatestStatus(packageId: number) {
        const results = await ctx.db
          .select()
          .from(packageStatusLogs)
          .where(eq(packageStatusLogs.packageId, packageId))

        if (results.length === 0) return null

        let latestStatus = results[0]
        for (const result of results) {
          if (result.createdAt.getTime() > latestStatus.createdAt.getTime())
            latestStatus = result
        }

        return latestStatus
      }

      const packageItems: (Package & { shipmentId: number })[] = []

      results.forEach((result) => {
        const isAdded = packageItems.some((_package) => {
          _package.id === result.packages.id
        })

        if (!isAdded) {
          packageItems.push({
            ...result.packages,
            shipmentId: result.shipment_packages.shipmentId,
          })
        }
      })

      const shipmentItemsWithPackages = shipmentItems.map((item) => {
        return {
          ...item,
          packages: packageItems.filter((_package) => {
            return _package.shipmentId === item.id
          }),
        }
      })

      const items: any[] = []
      for (const _package of shipmentItemsWithPackages[0].packages) {
        items.push({ ..._package, status: await getLatestStatus(_package.id) })
      }

      return [{ ...shipmentItemsWithPackages[0], packages: items }]
    }),
  getAllInTransitStatus: protectedProcedure.query(async ({ ctx }) => {
    const shipmentStatus = alias(shipmentStatusLogs, "shipment_inTransit")

    const test = await sql.raw(`SELECT *
      FROM shipments
      JOIN (
        SELECT shipment_id, MAX(shipment_status_logs.created_at) AS latest_log_timestamp
        FROM shipment_status_logs 
        GROUP BY shipment_id
      ) AS latest_logs
      ON shipments.id = latest_logs.shipment_id
      JOIN shipment_status_logs
      ON latest_logs.shipment_id = shipment_status_logs.shipment_id AND latest_logs.latest_log_timestamp = shipment_status_logs.created_at JOIN shipment_hubs ON shipments.origin_hub_id=shipment_hubs.id WHERE shipment_status_logs.status="IN_TRANSIT"`)

    const [results, properties] = await ctx.db.execute(test)

    return results as unknown as {
      id: number
      origin_hub_id: number
      destination_hub_id: number
      is_archived: number
      shipment_id: number
      latest_log_timestamp: string
      status: string
      description: string
      created_at: string
      created_by_id: string
      display_name: string
      role: string
      street_address: string
      barangay: string | null
      city: string
      state_or_province: string
      country_code: string
      postal_code: number
    }[]
  }),
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

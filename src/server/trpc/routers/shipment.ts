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
import { getShipmentHubIdOfUserId } from "@/server/db/helpers/shipment-hub"
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
  getIncoming: protectedProcedure.query(async ({ ctx }) => {
    const shipmentStatus = alias(shipmentStatusLogs, "shipment_inTransit")
    const shipmentHubId = await getShipmentHubIdOfUserId(ctx.db, ctx.user.uid)

    const [results, properties] = await ctx.db.execute(sql` SELECT
    ssl1.*,ssl1.created_at AS latest_log_timestamp,shipment_hubs.*,shipments.*
  FROM shipment_status_logs ssl1
  LEFT JOIN shipment_status_logs ssl2
  ON ssl1.shipment_id = ssl2.shipment_id
  AND ssl1.created_at < ssl2.created_at
  JOIN shipments ON ssl1.shipment_id=shipments.id JOIN shipment_hubs ON shipments.destination_hub_id=shipment_hubs.id WHERE ssl2.id IS NULL AND shipments.destination_hub_id=${shipmentHubId} AND ssl1.status="IN_TRANSIT"`)

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
  getOutgoing: protectedProcedure.query(async ({ ctx }) => {
    const shipmentStatus = alias(shipmentStatusLogs, "shipment_inTransit")
    const shipmentHubId = await getShipmentHubIdOfUserId(ctx.db, ctx.user.uid)

    const [results, properties] = await ctx.db.execute(sql` SELECT
    ssl1.*,ssl1.created_at AS latest_log_timestamp,shipment_hubs.*,shipments.*
  FROM shipment_status_logs ssl1
  LEFT JOIN shipment_status_logs ssl2
  ON ssl1.shipment_id = ssl2.shipment_id
  AND ssl1.created_at < ssl2.created_at
  JOIN shipments ON ssl1.shipment_id=shipments.id JOIN shipment_hubs ON shipments.destination_hub_id=shipment_hubs.id WHERE ssl2.id IS NULL AND shipments.origin_hub_id=${shipmentHubId} AND ssl1.status="PREPARING"`)

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
  getDestinationNameById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      const results = ctx.db
        .select()
        .from(shipmentHubs)
        .where(eq(shipmentHubs.id, input.id))
      if (input.id === null) {
        return []
      } else {
        return results
      }
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(shipments)
  }),
  updateStatusToArrived: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createBy = ctx.user.uid
      const createdDate = new Date()

      const values = {
        shipmentId: input.id,
        status: "ARRIVED" as const,
        description: "Shipment has arrived to its destination hub.",
        createdAt: createdDate,
        createdById: createBy,
      }

      await ctx.db.insert(shipmentStatusLogs).values(values)

      return createBy
    }),
  updateStatusToInTransit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createBy = ctx.user.uid
      const createdDate = new Date()

      const values = {
        shipmentId: input.id,
        status: "IN_TRANSIT" as const,
        description: "Shipment is being shipped to another hub.",
        createdAt: createdDate,
        createdById: createBy,
      }

      await ctx.db.insert(shipmentStatusLogs).values(values)

      return createBy
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
      .leftJoin(
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

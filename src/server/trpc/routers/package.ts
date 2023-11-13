import { and, eq, getTableColumns, isNull, lt, sql } from "drizzle-orm"
import { protectedProcedure, publicProcedure, router } from "../trpc"
import {
  packageStatusLogs,
  packages,
  shipmentPackages,
  shipmentStatusLogs,
  shipments,
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { inArray } from "drizzle-orm"
import {
  ReceptionMode,
  ShippingMode,
  ShippingType,
  supportedReceptionModes,
  supportedShippingModes,
  supportedShippingTypes,
} from "@/utils/constants"
import { ResultSetHeader } from "mysql2"
import {
  getShipmentHubIdOfUser,
  getShipmentHubOfUserId,
} from "@/server/db/helpers/shipment-hub"
import { alias } from "drizzle-orm/mysql-core"

export const packageRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(packages)
  }),
  getByShipmentId: protectedProcedure
    .input(
      z.object({
        shipmentId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(shipmentPackages)
        .innerJoin(packages, eq(packages.id, shipmentPackages.packageId))
        .where(eq(shipmentPackages.shipmentId, input.shipmentId))

      return results.map(({ packages }) => packages)
    }),
  getWithLatestStatusByShipmentId: protectedProcedure
    .input(
      z.object({
        shipmentId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const psl1 = alias(packageStatusLogs, "psl1")
      const psl2 = alias(packageStatusLogs, "psl2")
      const results = await ctx.db
        .select()
        .from(psl1)
        .leftJoin(
          psl2,
          and(
            eq(psl1.packageId, psl2.packageId),
            lt(psl1.createdAt, psl2.createdAt),
          ),
        )
        .innerJoin(
          shipmentPackages,
          eq(psl1.packageId, shipmentPackages.packageId),
        )
        .innerJoin(packages, eq(psl1.packageId, packages.id))
        .where(
          and(
            isNull(psl2.id),
            eq(shipmentPackages.shipmentId, input.shipmentId),
          ),
        )

      return results.map(({ packages, psl1 }) => ({
        ...packages,
        status: psl1.status,
      }))
    }),
  getWithStatusLogsById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const packageResults = await ctx.db
        .select()
        .from(packages)
        .where(eq(packages.id, input.id))

      if (packageResults.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (packageResults.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      const [_package] = packageResults
      const statusResults = await ctx.db
        .select()
        .from(packageStatusLogs)
        .where(eq(packageStatusLogs.packageId, input.id))

      return {
        ..._package,
        statusLogs: statusResults,
      }
    }),
  updatePackageStatusByIds: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createBy = ctx.user.uid
      const createdDate = new Date()
      const newStatus = input.status.replaceAll(" ", "_").toUpperCase()

      const results = input.ids.map((scannedPackageId) => {
        if (newStatus === "IN_WAREHOUSE") {
          return {
            packageId: scannedPackageId,
            status: newStatus as any,
            description: "Your package has been received in a Main hub.",
            createdAt: createdDate,
            createdById: createBy,
          }
        } else if (newStatus === "SHIPPING") {
          return {
            packageId: scannedPackageId,
            status: newStatus as any,
            description:
              "Your package has been prepared and is currently being shipped out.",
            createdAt: createdDate,
            createdById: createBy,
          }
        } else {
          return {
            packageId: scannedPackageId,
            status: newStatus as any,
            description: "Your package is currently out for delivery",
            createdAt: createdDate,
            createdById: createBy,
          }
        }
      })

      await ctx.db.insert(packageStatusLogs).values(results)

      return "Success!"
    }),
  createMany: protectedProcedure
    .input(
      z.object({
        newPackages: z
          .object({
            shippingMode: z.custom<ShippingMode>((val) =>
              supportedShippingModes.includes(val as ShippingMode),
            ),
            shippingType: z.custom<ShippingType>((val) =>
              supportedShippingTypes.includes(val as ShippingType),
            ),
            receptionMode: z.custom<ReceptionMode>((val) =>
              supportedReceptionModes.includes(val as ReceptionMode),
            ),
            weightInKg: z.number(),
            senderFullName: z.string().min(1).max(100),
            senderContactNumber: z.string().min(1).max(15),
            senderEmailAddress: z.string().min(1).max(100),
            senderStreetAddress: z.string().min(1).max(255),
            senderCity: z.string().min(1).max(100),
            senderStateOrProvince: z.string().min(1).max(100),
            senderCountryCode: z.string().min(1).max(3),
            senderPostalCode: z.number(),
            receiverFullName: z.string().min(1).max(100),
            receiverContactNumber: z.string().min(1).max(15),
            receiverEmailAddress: z.string().min(1).max(100),
            receiverStreetAddress: z.string().min(1).max(255),
            receiverBarangay: z.string().min(1).max(100),
            receiverCity: z.string().min(1).max(100),
            receiverStateOrProvince: z.string().min(1).max(100),
            receiverCountryCode: z.string().min(1).max(3),
            receiverPostalCode: z.number(),
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const shipmentHubId = await getShipmentHubIdOfUser(ctx.db, ctx.user)
      const insertIds = await ctx.db.transaction(async (tx) => {
        const insertIds: number[] = []

        for (const newPackage of input.newPackages) {
          const [result] = (await tx.insert(packages).values({
            ...newPackage,
            createdById: ctx.user.uid,
            updatedById: ctx.user.uid,
            createdInHubId: shipmentHubId,
          })) as unknown as [ResultSetHeader]

          insertIds.push(result.insertId)
          await tx.insert(packageStatusLogs).values({
            packageId: result.insertId,
            status: "IN_WAREHOUSE",
            description: "Package registered.",
            createdAt: new Date(),
            createdById: ctx.user.uid,
          })
        }

        return insertIds
      })

      if (insertIds.length === 0) return []
      else
        return await ctx.db
          .select()
          .from(packages)
          .where(inArray(packages.id, insertIds))
    }),
  getByIds: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.ids.length === 0) {
        return []
      } else {
        return await ctx.db
          .select()
          .from(packages)
          .where(inArray(packages.id, input.ids))
      }
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
        .from(packageStatusLogs)
        .where(eq(packageStatusLogs.packageId, input.id))

      if (results.length === 0) return null

      let latestStatus = results[0]
      for (const result of results) {
        if (result.createdAt.getTime() > latestStatus.createdAt.getTime())
          latestStatus = result
      }

      return latestStatus
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
        .from(packages)
        .where(eq(packages.id, input.id))

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
  getShippable: protectedProcedure.query(async ({ ctx }) => {
    const shipmentHub = await getShipmentHubOfUserId(ctx.db, ctx.user.uid)
    const psl1 = alias(packageStatusLogs, "psl1")
    const psl2 = alias(packageStatusLogs, "psl2")
    const p = alias(packages, "p")

    const packagesWithLatestStatusInWarehouse = ctx.db
      .select({
        latestStatus: sql<string>`${psl1.status}`.as("latest_status"),
        // We already have another createdAt field inside this subquery
        // (p.created_at, psl1.created_at). To avoid duplicate columns in
        // the generated query, we need to explicitly define an alias
        // that the query generator will use under the hood.
        //
        // Source: https://orm.drizzle.team/docs/select#basic-and-partial-select
        latestStatusCreatedAt: sql<string>`${psl1.createdAt}`.as(
          "latest_status_created_at",
        ),
        ...getTableColumns(p),
      })
      .from(psl1)
      .innerJoin(p, eq(psl1.packageId, p.id))
      .leftJoin(
        psl2,
        and(
          eq(psl1.packageId, psl2.packageId),
          lt(psl1.createdAt, psl2.createdAt),
        ),
      )
      .where(and(isNull(psl2.id), eq(psl1.status, "IN_WAREHOUSE")))
      .as("packages_with_latest_status_in_warehouse")

    const ssl1 = alias(shipmentStatusLogs, "ssl1")
    const ssl2 = alias(shipmentStatusLogs, "ssl2")
    const s = alias(shipments, "s")

    const shipmentsWithLatestStatusArrived = ctx.db
      .select({
        latestStatus: ssl1.status,
        latestStatusCreatedAt: ssl1.createdAt,
        ...getTableColumns(s),
      })
      .from(ssl1)
      .innerJoin(s, eq(ssl1.shipmentId, s.id))
      .leftJoin(
        ssl2,
        and(
          eq(ssl1.shipmentId, ssl2.shipmentId),
          lt(ssl1.createdAt, ssl2.createdAt),
        ),
      )
      .where(and(isNull(ssl2.id), eq(ssl1.status, "ARRIVED")))
      .as("shipments_with_latest_status_arrived")

    // For packages that has at least 1 shipment,
    // get the latest shipment hub that they have arrived at.
    const sp = alias(shipmentPackages, "sp")
    const resultsWithShipment = await ctx.db
      .select()
      .from(packagesWithLatestStatusInWarehouse)
      .innerJoin(sp, eq(packagesWithLatestStatusInWarehouse.id, sp.packageId))
      .innerJoin(
        shipmentsWithLatestStatusArrived,
        eq(sp.shipmentId, shipmentsWithLatestStatusArrived.id),
      )
      .where(
        eq(shipmentsWithLatestStatusArrived.destinationHubId, shipmentHub.id),
      )

    const packagesWithShipment = resultsWithShipment.map(
      ({
        packages_with_latest_status_in_warehouse,
        shipments_with_latest_status_arrived,
      }) => ({
        ...packages_with_latest_status_in_warehouse,
        currentHubId: shipments_with_latest_status_arrived.destinationHubId!,
      }),
    )

    // For packages that has no shipments, treat their created in hub as
    // the current hub.
    const resultsWithoutShipment = await ctx.db
      .select()
      .from(packagesWithLatestStatusInWarehouse)
      .leftJoin(sp, eq(packagesWithLatestStatusInWarehouse.id, sp.packageId))
      .where(
        and(
          isNull(sp.packageId),
          eq(
            packagesWithLatestStatusInWarehouse.createdInHubId,
            shipmentHub.id,
          ),
        ),
      )

    const packagesWithoutShipment = resultsWithoutShipment.map(
      ({ packages_with_latest_status_in_warehouse }) => ({
        ...packages_with_latest_status_in_warehouse,
        currentHubId: packages_with_latest_status_in_warehouse.createdInHubId,
      }),
    )

    return [...packagesWithShipment, ...packagesWithoutShipment]
  }),
  create: protectedProcedure
    .input(
      z.object({
        shippingMode: z.custom<ShippingMode>((val) =>
          supportedShippingModes.includes(val as ShippingMode),
        ),
        shippingType: z.custom<ShippingType>((val) =>
          supportedShippingTypes.includes(val as ShippingType),
        ),
        receptionMode: z.custom<ReceptionMode>((val) =>
          supportedReceptionModes.includes(val as ReceptionMode),
        ),
        weightInKg: z.number(),
        senderFullName: z.string().min(1).max(100),
        senderContactNumber: z.string().min(1).max(15),
        senderEmailAddress: z.string().min(1).max(100),
        senderStreetAddress: z.string().min(1).max(255),
        senderCity: z.string().min(1).max(100),
        senderStateOrProvince: z.string().min(1).max(100),
        senderCountryCode: z.string().min(1).max(3),
        senderPostalCode: z.number(),
        receiverFullName: z.string().min(1).max(100),
        receiverContactNumber: z.string().min(1).max(15),
        receiverEmailAddress: z.string().min(1).max(100),
        receiverStreetAddress: z.string().min(1).max(255),
        receiverBarangay: z.string().min(1).max(100),
        receiverCity: z.string().min(1).max(100),
        receiverStateOrProvince: z.string().min(1).max(100),
        receiverCountryCode: z.string().min(1).max(3),
        receiverPostalCode: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(packages).values({
        shippingMode: input.shippingMode,
        shippingType: input.shippingType,
        receptionMode: input.receptionMode,
        weightInKg: input.weightInKg,
        senderFullName: input.senderFullName,
        senderContactNumber: input.senderContactNumber,
        senderEmailAddress: input.senderEmailAddress,
        senderStreetAddress: input.senderStreetAddress,
        senderCity: input.senderCity,
        senderStateOrProvince: input.senderStateOrProvince,
        senderCountryCode: input.senderCountryCode,
        senderPostalCode: input.senderPostalCode,
        receiverFullName: input.receiverFullName,
        receiverContactNumber: input.receiverContactNumber,
        receiverEmailAddress: input.receiverEmailAddress,
        receiverStreetAddress: input.receiverStreetAddress,
        receiverBarangay: input.receiverBarangay,
        receiverCity: input.receiverCity,
        receiverStateOrProvince: input.receiverStateOrProvince,
        receiverCountryCode: input.receiverCountryCode,
        receiverPostalCode: input.receiverPostalCode,
        createdInHubId: 1,
        createdById: "user1234",
        updatedById: "user1234",
      })
    }),
})

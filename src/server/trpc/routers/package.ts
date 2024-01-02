import { and, eq, isNull, lt } from "drizzle-orm"
import { protectedProcedure, publicProcedure, router } from "../trpc"
import {
  packageStatusLogs,
  packages,
  shipmentPackages,
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { inArray } from "drizzle-orm"
import {
  PackageReceptionMode,
  PackageShippingMode,
  PackageShippingType,
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
} from "@/utils/constants"
import { alias } from "drizzle-orm/mysql-core"

export const packageRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(packages)
  }),
  getWithStatusLogsById: publicProcedure
    .input(
      z.object({
        id: z.string(),
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
  updateById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        shippingMode: z.custom<PackageShippingMode>((val) =>
          SUPPORTED_PACKAGE_SHIPPING_MODES.includes(val as PackageShippingMode),
        ),
        shippingType: z.custom<PackageShippingType>((val) =>
          SUPPORTED_PACKAGE_SHIPPING_TYPES.includes(val as PackageShippingType),
        ),
        receptionMode: z.custom<PackageReceptionMode>((val) =>
          SUPPORTED_PACKAGE_RECEPTION_MODES.includes(
            val as PackageReceptionMode,
          ),
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
      return await ctx.db
        .update(packages)
        .set({
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
          updatedById: ctx.user.uid,
          updatedAt: new Date(),
        })
        .where(eq(packages.id, input.id))
    }),
  updatePackageStatusByIds: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
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
  getByIds: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
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
        id: z.string(),
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
  createMany: protectedProcedure
    .input(
      z.object({
        newPackages: z
          .object({
            shippingMode: z.custom<PackageShippingMode>((val) =>
              SUPPORTED_PACKAGE_SHIPPING_MODES.includes(
                val as PackageShippingMode,
              ),
            ),
            shippingType: z.custom<PackageShippingType>((val) =>
              SUPPORTED_PACKAGE_SHIPPING_TYPES.includes(
                val as PackageShippingType,
              ),
            ),
            receptionMode: z.custom<PackageReceptionMode>((val) =>
              SUPPORTED_PACKAGE_RECEPTION_MODES.includes(
                val as PackageReceptionMode,
              ),
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
      await ctx.db.insert(packages).values(
        input.newPackages.map((newPackage) => ({
          ...newPackage,
          id: crypto.randomUUID(),
          createdById: ctx.user.uid,
          updatedById: ctx.user.uid,
        })),
      )
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
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
  createPending: protectedProcedure
    .input(
      z.object({
        shippingMode: z.custom<PackageShippingMode>((val) =>
          SUPPORTED_PACKAGE_SHIPPING_MODES.includes(val as PackageShippingMode),
        ),
        shippingType: z.custom<PackageShippingType>((val) =>
          SUPPORTED_PACKAGE_SHIPPING_TYPES.includes(val as PackageShippingType),
        ),
        receptionMode: z.custom<PackageReceptionMode>((val) =>
          SUPPORTED_PACKAGE_RECEPTION_MODES.includes(
            val as PackageReceptionMode,
          ),
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
      await ctx.db.insert(packages).values({
        id: crypto.randomUUID(),
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
        createdById: ctx.user.uid,
        updatedById: ctx.user.uid,
      })
    }),
  getInWarehouse: protectedProcedure.query(async ({ ctx }) => {
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
      .innerJoin(packages, eq(psl1.packageId, packages.id))
      .where(and(isNull(psl2.id), eq(psl1.status, "IN_WAREHOUSE")))

    return results.map(({ packages, psl1 }) => ({
      ...packages,
      status: psl1.status,
    }))
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
        .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
        .where(
          and(
            isNull(psl2.id),
            eq(shipmentPackages.shipmentId, input.shipmentId),
          ),
        )
        .orderBy(packages.id)

      return results.map(({ packages, psl1 }) => ({
        ...packages,
        status: psl1.status,
      }))
    }),
})

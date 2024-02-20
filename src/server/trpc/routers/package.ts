import { and, count, eq, lt, sql } from "drizzle-orm"
import { protectedProcedure, publicProcedure, router } from "../trpc"
import {
  forwarderTransferShipments,
  packageStatusLogs,
  packages,
  shipmentPackages,
  incomingShipments,
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { inArray } from "drizzle-orm"
import {
  PackageReceptionMode,
  PackageShippingMode,
  PackageShippingType,
  PackageStatus,
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
  SUPPORTED_PACKAGE_STATUSES,
} from "@/utils/constants"
import { generateUniqueId } from "@/utils/uuid"
import { DELIVERABLE_PROVINCES_IN_PH } from "@/utils/region-code"

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
            isFragile: z.boolean(),
            status: z.custom<PackageStatus>((val) =>
              SUPPORTED_PACKAGE_STATUSES.includes(val as PackageStatus),
            ),
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(packages).values(
        input.newPackages.map((newPackage) => ({
          ...newPackage,
          id: generateUniqueId(),
          createdById: ctx.user.uid,
          updatedById: ctx.user.uid,
          isFragile: newPackage.isFragile ? 1 : 0,
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
  getInWarehouse: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(packages)
      .where(eq(packages.status, "IN_WAREHOUSE"))
  }),
  getInWarehouseAndCanBeDelivered: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(packages)
      .where(
        and(
          eq(packages.status, "IN_WAREHOUSE"),
          lt(packages.failedAttempts, 3),
        ),
      )

    return results.filter((_package) =>
      DELIVERABLE_PROVINCES_IN_PH.includes(
        _package.receiverStateOrProvince.trim().toUpperCase(),
      ),
    )
  }),
  getWithLatestStatusByShipmentId: protectedProcedure
    .input(
      z.object({
        shipmentId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(shipmentPackages)
        .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
        .where(eq(shipmentPackages.shipmentId, input.shipmentId))
        .orderBy(packages.id)

      return result.map(({ packages }) => packages)
    }),
  getTotalPackageInWarehouse: protectedProcedure.query(async ({ ctx }) => {
    const [{ value }] = await ctx.db
      .select({
        value: count(),
      })
      .from(packages)
      .where(eq(packages.status, "IN_WAREHOUSE"))

    return {
      count: value,
    }
  }),
  getTotalIncomingRushPackageSentByAgentId: protectedProcedure.query(
    async ({ ctx }) => {
      const [{ value }] = await ctx.db
        .select({ value: count() })
        .from(incomingShipments)
        .innerJoin(
          shipmentPackages,
          eq(incomingShipments.shipmentId, shipmentPackages.shipmentId),
        )
        .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
        .where(
          and(
            eq(incomingShipments.sentByAgentId, ctx.user.uid),
            eq(packages.shippingType, "EXPRESS"),
          ),
        )
      return {
        count: value,
      }
    },
  ),
  getTotalIncomingPackagesSentByAgentId: protectedProcedure.query(
    async ({ ctx }) => {
      const [{ value }] = await ctx.db
        .select({ value: count() })
        .from(incomingShipments)
        .innerJoin(
          shipmentPackages,
          eq(incomingShipments.shipmentId, shipmentPackages.shipmentId),
        )
        .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
        .where(eq(incomingShipments.sentByAgentId, ctx.user.uid))
      return {
        count: value,
      }
    },
  ),
  getTotalPackagesSentToAgentId: protectedProcedure.query(async ({ ctx }) => {
    const [{ value }] = await ctx.db
      .select({ value: count() })
      .from(forwarderTransferShipments)
      .innerJoin(
        shipmentPackages,
        eq(forwarderTransferShipments.shipmentId, shipmentPackages.shipmentId),
      )
      .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
      .where(eq(forwarderTransferShipments.sentToAgentId, ctx.user.uid))

    return {
      count: value,
    }
  }),
})

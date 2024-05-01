import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  like,
  lt,
  ne,
  sql,
} from "drizzle-orm"
import {
  domesticAgentProcedure,
  overseasAgentProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "../trpc"
import {
  forwarderTransferShipments,
  packageStatusLogs,
  packages,
  shipmentPackages,
  incomingShipments,
  provinces,
  cities,
  barangays,
  missingPackages,
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { inArray } from "drizzle-orm"
import type {
  PackageReceptionMode,
  PackageShippingMode,
  PackageShippingType,
  PackageStatus,
} from "@/utils/constants"
import {
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
  getDescriptionForNewPackageStatusLog,
} from "@/utils/constants"
import { DateTime } from "luxon"
import { getDeliverableProvinceNames } from "@/server/db/helpers/deliverable-provinces"
import { createLog } from "@/utils/logging"
import { getAreaCode } from "@/utils/area-code"

export const packageRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(packages)
  }),
  getAllForOverseasAgent: overseasAgentProcedure.query(async ({ ctx }) => {
    const packageColumns = getTableColumns(packages)

    return await ctx.db
      .selectDistinct(packageColumns)
      .from(packages)
      .innerJoin(shipmentPackages, eq(packages.id, shipmentPackages.packageId))
      .innerJoin(
        incomingShipments,
        eq(shipmentPackages.shipmentId, incomingShipments.shipmentId),
      )
      .where(eq(incomingShipments.sentByAgentId, ctx.user.id))
  }),
  getAllForDomesticAgent: domesticAgentProcedure.query(async ({ ctx }) => {
    const packageColumns = getTableColumns(packages)

    return await ctx.db
      .selectDistinct(packageColumns)
      .from(packages)
      .innerJoin(shipmentPackages, eq(packages.id, shipmentPackages.packageId))
      .innerJoin(
        forwarderTransferShipments,
        eq(shipmentPackages.shipmentId, forwarderTransferShipments.shipmentId),
      )
      .where(eq(forwarderTransferShipments.sentToAgentId, ctx.user.id))
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
        preassignedId: z.string(),
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
        senderEmailAddress: z
          .string()
          .min(1)
          .max(100)
          .endsWith("@gmail.com")
          .email(),
        senderStreetAddress: z.string().min(1).max(255),
        senderCity: z.string().min(1).max(100),
        senderStateOrProvince: z.string().min(1).max(100),
        senderCountryCode: z.string().min(1).max(3),
        senderPostalCode: z.number(),
        receiverFullName: z.string().min(1).max(100),
        receiverContactNumber: z.string().min(1).max(15),
        receiverEmailAddress: z
          .string()
          .min(1)
          .max(100)
          .endsWith("@gmail.com")
          .email(),
        receiverStreetAddress: z.string().min(1).max(255),
        receiverBarangay: z.string().min(1).max(100),
        receiverCity: z.string().min(1).max(100),
        receiverStateOrProvince: z.string().min(1).max(100),
        receiverCountryCode: z.string().min(1).max(3),
        receiverPostalCode: z.number(),
        declaredValue: z.number().nullable(),
        failedAttempts: z.number(),
        isFragile: z.boolean(),
        volumeInCubicMeter: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deliverableProvinces = await getDeliverableProvinceNames({
        db: ctx.db,
      })
      const selectedProvince = await ctx.db
        .select()
        .from(provinces)
        .where(eq(provinces.provinceId, input.receiverStateOrProvince))

      const selectedCity = await ctx.db
        .select()
        .from(cities)
        .where(eq(cities.cityId, input.receiverCity))

      const selectedBarangay = await ctx.db
        .select()
        .from(barangays)
        .where(eq(barangays.code, input.receiverBarangay))

      const areaCode = await getAreaCode({
        db: ctx.db,
        provinceName: selectedProvince[0].name,
        cityName: selectedCity[0].name,
        barangayName: selectedBarangay[0].name,
      })

      return await ctx.db
        .update(packages)
        .set({
          preassignedId: input.preassignedId,
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
          receiverBarangay: selectedBarangay[0].name,
          receiverCity: selectedCity[0].name,
          receiverStateOrProvince: selectedProvince[0].name,
          receiverCountryCode: input.receiverCountryCode,
          receiverPostalCode: input.receiverPostalCode,
          updatedById: ctx.user.id,
          updatedAt: new Date(),
          isDeliverable: deliverableProvinces.includes(
            selectedProvince[0].name.trim().toUpperCase(),
          )
            ? 1
            : 0,
          declaredValue: input.declaredValue,
          failedAttempts: input.failedAttempts,
          isFragile: input.isFragile ? 1 : 0,
          volumeInCubicMeter: input.volumeInCubicMeter,
          areaCode,
        })
        .where(eq(packages.id, input.id))
    }),
  deletedById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(packages).where(eq(packages.id, input.id))

      await ctx.db
        .delete(packageStatusLogs)
        .where(eq(packageStatusLogs.packageId, input.id))

      await ctx.db
        .delete(shipmentPackages)
        .where(eq(shipmentPackages.packageId, input.id))
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
  getInWarehouse: protectedProcedure
    .input(
      z.object({
        searchTerm: z.string(),
        warehouseId: z.number().optional(),
        sortOrder: z.union([z.literal("ASC"), z.literal("DESC")]),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(packages)
        .where(
          and(
            eq(packages.status, "IN_WAREHOUSE"),
            input.warehouseId
              ? eq(packages.lastWarehouseId, input.warehouseId)
              : undefined,
            input.searchTerm === ""
              ? undefined
              : like(packages.id, `%${input.searchTerm}%`),
          ),
        )
    }),
  getInWarehouseAndCanBeDelivered: protectedProcedure
    .input(
      z.object({
        searchTerm: z.string(),
        warehouseId: z.number().optional(),
        shippingType: z
          .custom<PackageShippingType>((val) =>
            SUPPORTED_PACKAGE_SHIPPING_TYPES.includes(
              val as PackageShippingType,
            ),
          )
          .optional(),
        sortOrder: z.union([z.literal("ASC"), z.literal("DESC")]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(packages)
        .where(
          and(
            eq(packages.status, "IN_WAREHOUSE"),
            eq(packages.receptionMode, "DOOR_TO_DOOR"),
            eq(packages.remarks, "GOOD_CONDITION"),
            input.warehouseId
              ? eq(packages.lastWarehouseId, input.warehouseId)
              : undefined,
            input.shippingType
              ? eq(packages.shippingType, input.shippingType)
              : undefined,
            input.searchTerm === ""
              ? undefined
              : like(packages.id, `%${input.searchTerm}%`),
          ),
        )
        .orderBy(
          input.sortOrder === "DESC"
            ? desc(packages.expectedHasDeliveryAt)
            : asc(packages.expectedHasDeliveryAt),
        )

      return results.filter(({ isDeliverable }) => isDeliverable)
    }),
  getInWarehouseAndCanBeDeliveredInProvinceId: protectedProcedure
    .input(
      z.object({
        cityId: z.string(),
        searchTerm: z.string(),
        warehouseId: z.number().optional(),
        shippingType: z
          .custom<PackageShippingType>((val) =>
            SUPPORTED_PACKAGE_SHIPPING_TYPES.includes(
              val as PackageShippingType,
            ),
          )
          .optional(),
        sortOrder: z.union([z.literal("ASC"), z.literal("DESC")]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(packages)
        .where(
          and(
            eq(packages.status, "IN_WAREHOUSE"),
            eq(packages.receptionMode, "DOOR_TO_DOOR"),
            eq(packages.remarks, "GOOD_CONDITION"),
            eq(sql`substring(${packages.areaCode},1,6)`, input.cityId),
            input.warehouseId
              ? eq(packages.lastWarehouseId, input.warehouseId)
              : undefined,
            input.shippingType
              ? eq(packages.shippingType, input.shippingType)
              : undefined,
            input.searchTerm === ""
              ? undefined
              : like(packages.id, `%${input.searchTerm}%`),
          ),
        )
        .orderBy(
          input.sortOrder === "DESC"
            ? desc(packages.expectedHasDeliveryAt)
            : asc(packages.expectedHasDeliveryAt),
        )

      return results.filter(({ isDeliverable }) => isDeliverable)
    }),
  getInWarehouseAndCanBeForwarderTransferred: protectedProcedure
    .input(
      z.object({
        searchTerm: z.string(),
        warehouseId: z.number().optional(),
        sortOrder: z.union([z.literal("ASC"), z.literal("DESC")]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(packages)
        .where(
          and(
            eq(packages.status, "IN_WAREHOUSE"),
            eq(packages.remarks, "GOOD_CONDITION"),
            input.warehouseId
              ? eq(packages.lastWarehouseId, input.warehouseId)
              : undefined,
            input.searchTerm === ""
              ? undefined
              : like(packages.id, `%${input.searchTerm}%`),
          ),
        )
        .orderBy(
          input.sortOrder === "DESC"
            ? desc(packages.createdAt)
            : asc(packages.createdAt),
        )

      return results.filter(({ isDeliverable }) => !isDeliverable)
    }),
  getIncomingStatusByShipmentId: protectedProcedure
    .input(
      z.object({
        shipmentId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(shipmentPackages)
        .innerJoin(packages, and(eq(shipmentPackages.packageId, packages.id)))
        .where(
          and(
            eq(shipmentPackages.shipmentId, input.shipmentId),
            eq(packages.status, "INCOMING"),
          ),
        )
        .orderBy(packages.id)

      return result.map(({ packages }) => packages)
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
        .innerJoin(packages, and(eq(shipmentPackages.packageId, packages.id)))
        .where(and(eq(shipmentPackages.shipmentId, input.shipmentId)))
        .orderBy(packages.id)

      return result.map(({ packages }) => packages)
    }),
  getCountWithLatestStatusByShipmentId: protectedProcedure
    .input(
      z.object({
        shipmentId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(shipmentPackages)
        .innerJoin(packages, and(eq(shipmentPackages.packageId, packages.id)))
        .where(
          and(
            eq(shipmentPackages.shipmentId, input.shipmentId),
            ne(packages.status, "INCOMING"),
          ),
        )
        .orderBy(packages.id)

      return result.length
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
            eq(incomingShipments.sentByAgentId, ctx.user.id),
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
        .where(eq(incomingShipments.sentByAgentId, ctx.user.id))
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
      .where(eq(forwarderTransferShipments.sentToAgentId, ctx.user.id))
    return {
      count: value,
    }
  }),
  archiveById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(packages)
          .set({
            isArchived: 1,
          })
          .where(eq(packages.id, input.id))

        await createLog(tx, {
          verb: "UPDATE",
          entity: "PACKAGE",
          createdById: ctx.user.id,
        })
      })
    }),
  unarchiveById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(packages)
          .set({
            isArchived: 0,
          })
          .where(eq(packages.id, input.id))

        await createLog(tx, {
          verb: "UPDATE",
          entity: "PACKAGE",
          createdById: ctx.user.id,
        })
      })
    }),
  markAsPickedUpById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(packages)
          .set({
            status: "DELIVERED",
            settledAt: createdAt,
          })
          .where(eq(packages.id, input.id))

        await tx.insert(packageStatusLogs).values({
          packageId: input.id,
          createdAt,
          createdById: ctx.user.id,
          description: getDescriptionForNewPackageStatusLog({
            status: "DELIVERED",
          }),
          status: "DELIVERED",
        })

        await createLog(tx, {
          verb: "UPDATE",
          entity: "PACKAGE",
          createdById: ctx.user.id,
        })
      })
    }),

  tagAsMissingByShipmentId: protectedProcedure
    .input(
      z.object({
        misingPackages: z
          .object({
            packageId: z.string(),
            shipmentId: z.number(),
            preassignedId: z.string(),
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

            weightInKg: z.number(),
            volumeInCubicMeter: z.number(),
            senderFullName: z.string(),
            senderContactNumber: z.string(),
            senderEmailAddress: z.string(),
            senderStreetAddress: z.string(),
            senderCity: z.string(),
            senderStateOrProvince: z.string(),

            senderCountryCode: z.string(),
            senderPostalCode: z.number(),
            receiverFullName: z.string(),
            receiverContactNumber: z.string(),
            receiverEmailAddress: z.string(),
            receiverStreetAddress: z.string(),
            receiverBarangay: z.string(),
            receiverCity: z.string(),
            receiverStateOrProvince: z.string(),

            receiverCountryCode: z.string(),
            receiverPostalCode: z.number(),

            createdAt: z.string(),
            createdById: z.string(),

            isFragile: z.number(),

            sentByAgentId: z.string(),
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(missingPackages).values(input.misingPackages)

      await ctx.db.delete(packages).where(
        inArray(
          packages.id,
          input.misingPackages.map((_package) => _package.packageId),
        ),
      )
      await ctx.db.delete(packageStatusLogs).where(
        inArray(
          packageStatusLogs.packageId,
          input.misingPackages.map((_package) => _package.packageId),
        ),
      )
      await ctx.db.delete(shipmentPackages).where(
        inArray(
          shipmentPackages.packageId,
          input.misingPackages.map((_package) => _package.packageId),
        ),
      )
    }),
})

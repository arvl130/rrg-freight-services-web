import { and, count, eq, getTableColumns, inArray, like, lt } from "drizzle-orm"
import { protectedProcedure, router } from "../../trpc"
import {
  shipments,
  deliveryShipments,
  shipmentPackages,
  packageStatusLogs,
  shipmentPackageOtps,
  packages,
  users,
  vehicles,
  expopushTokens,
  webpushSubscriptions,
  assignedDrivers,
  assignedVehicles,
  warehouses,
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import {
  CLIENT_TIMEZONE,
  getDescriptionForNewPackageStatusLog,
} from "@/utils/constants"
import { DateTime } from "luxon"
import { generateOtp } from "@/utils/uuid"
import {
  batchNotifyByEmailWithComponentProps,
  batchNotifyBySms,
  notifyByExpoPush,
  notifyByWebPush,
} from "@/server/notification"
import { createLog } from "@/utils/logging"

export const deliveryShipmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const shipmentColumns = getTableColumns(shipments)
    const { shipmentId, ...deliveryShipmentColumns } =
      getTableColumns(deliveryShipments)

    return await ctx.db
      .select({
        ...shipmentColumns,
        ...deliveryShipmentColumns,
        driverDisplayName: users.displayName,
        warehouseDisplayName: warehouses.displayName,
      })
      .from(deliveryShipments)
      .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))
      .innerJoin(users, eq(deliveryShipments.driverId, users.id))
      .innerJoin(
        warehouses,
        eq(deliveryShipments.departingWarehouseId, warehouses.id),
      )
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
        .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))
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

      const { delivery_shipments } = results[0]
      const { shipmentId, ...other } = delivery_shipments

      return {
        ...results[0].shipments,
        ...other,
      }
    }),
  getPreparing: protectedProcedure
    .input(
      z.object({
        searchWith: z
          .literal("SHIPMENT_ID")
          .or(z.literal("PACKAGE_ID"))
          .or(z.literal("PACKAGE_PRE_ID")),
        searchTerm: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const shipmentColumns = getTableColumns(shipments)
      const { shipmentId, ...deliveryShipmentColumns } =
        getTableColumns(deliveryShipments)

      return await ctx.db
        .selectDistinct({
          ...shipmentColumns,
          ...deliveryShipmentColumns,
          driverDisplayName: users.displayName,
          driverContactNumber: users.contactNumber,
          vehicleDisplayName: vehicles.displayName,
          vehicleType: vehicles.type,
        })
        .from(shipmentPackages)
        .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
        .innerJoin(
          deliveryShipments,
          eq(shipmentPackages.shipmentId, deliveryShipments.shipmentId),
        )
        .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))
        .innerJoin(users, eq(deliveryShipments.driverId, users.id))
        .innerJoin(vehicles, eq(deliveryShipments.vehicleId, vehicles.id))
        .where(
          and(
            eq(shipments.status, "PREPARING"),
            input.searchTerm === ""
              ? undefined
              : input.searchWith === "SHIPMENT_ID"
                ? like(shipments.id, `%${input.searchTerm}%`)
                : input.searchWith === "PACKAGE_ID"
                  ? like(packages.id, `%${input.searchTerm}%`)
                  : like(packages.preassignedId, `%${input.searchTerm}%`),
          ),
        )
    }),
  getInTransit: protectedProcedure
    .input(
      z.object({
        searchWith: z
          .literal("SHIPMENT_ID")
          .or(z.literal("PACKAGE_ID"))
          .or(z.literal("PACKAGE_PRE_ID")),
        searchTerm: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const shipmentColumns = getTableColumns(shipments)
      const { shipmentId, ...deliveryShipmentColumns } =
        getTableColumns(deliveryShipments)

      return await ctx.db
        .selectDistinct({
          ...shipmentColumns,
          ...deliveryShipmentColumns,
          driverDisplayName: users.displayName,
          driverContactNumber: users.contactNumber,
          vehicleDisplayName: vehicles.displayName,
          vehicleType: vehicles.type,
        })
        .from(shipmentPackages)
        .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
        .innerJoin(
          deliveryShipments,
          eq(shipmentPackages.shipmentId, deliveryShipments.shipmentId),
        )
        .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))
        .innerJoin(users, eq(deliveryShipments.driverId, users.id))
        .innerJoin(vehicles, eq(deliveryShipments.vehicleId, vehicles.id))
        .where(
          and(
            eq(shipments.status, "IN_TRANSIT"),
            input.searchTerm === ""
              ? undefined
              : input.searchWith === "SHIPMENT_ID"
                ? like(shipments.id, `%${input.searchTerm}%`)
                : input.searchWith === "PACKAGE_ID"
                  ? like(packages.id, `%${input.searchTerm}%`)
                  : like(packages.preassignedId, `%${input.searchTerm}%`),
          ),
        )
    }),
  getTotalAssignedToDriverId: protectedProcedure.query(async ({ ctx }) => {
    const [{ value }] = await ctx.db
      .select({
        value: count(),
      })
      .from(deliveryShipments)
      .where(eq(deliveryShipments.driverId, ctx.user.id))

    return {
      count: value,
    }
  }),
  getTotalCompletedAssignedToDriverId: protectedProcedure.query(
    async ({ ctx }) => {
      const [{ value }] = await ctx.db
        .select({
          value: count(),
        })
        .from(deliveryShipments)
        .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))

        .where(
          and(
            eq(deliveryShipments.driverId, ctx.user.id),
            eq(shipments.status, "COMPLETED"),
          ),
        )

      return {
        count: value,
      }
    },
  ),
  getTotalFailedAssignedToDriverId: protectedProcedure.query(
    async ({ ctx }) => {
      const [{ value }] = await ctx.db
        .select({
          value: count(),
        })
        .from(deliveryShipments)
        .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))

        .where(
          and(
            eq(deliveryShipments.driverId, ctx.user.id),
            eq(shipments.status, "FAILED"),
          ),
        )

      return {
        count: value,
      }
    },
  ),
  getTotalInTransitAssignedToDriverId: protectedProcedure.query(
    async ({ ctx }) => {
      const [{ value }] = await ctx.db
        .select({
          value: count(),
        })
        .from(deliveryShipments)
        .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))

        .where(
          and(
            eq(deliveryShipments.driverId, ctx.user.id),
            eq(shipments.status, "IN_TRANSIT"),
          ),
        )

      return {
        count: value,
      }
    },
  ),
  getTotalPreparingAssignedToDriverId: protectedProcedure.query(
    async ({ ctx }) => {
      const [{ value }] = await ctx.db
        .select({
          value: count(),
        })
        .from(deliveryShipments)
        .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))

        .where(
          and(
            eq(deliveryShipments.driverId, ctx.user.id),
            eq(shipments.status, "PREPARING"),
          ),
        )

      return {
        count: value,
      }
    },
  ),
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

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "DELIVERY_SHIPMENT",
        createdById: ctx.user.id,
      })
    }),
  updateStatusToCompletedById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const [deliveryShipment] = await tx
          .select()
          .from(deliveryShipments)
          .where(eq(deliveryShipments.shipmentId, input.id))

        await tx
          .update(shipments)
          .set({
            status: "COMPLETED",
          })
          .where(eq(shipments.id, input.id))

        await tx
          .delete(assignedDrivers)
          .where(eq(assignedDrivers.driverId, deliveryShipment.driverId))

        await tx
          .delete(assignedVehicles)
          .where(eq(assignedVehicles.vehicleId, deliveryShipment.vehicleId))

        await createLog(tx, {
          verb: "UPDATE",
          entity: "DELIVERY_SHIPMENT",
          createdById: ctx.user.id,
        })
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        driverId: z.string().length(28),
        vehicleId: z.number(),
        packageIds: z.string().array().nonempty(),
        departureAt: z.string().min(1).max(100),
        departingWarehouseId: z.number(),
        isExpress: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const otpExpiryDate = DateTime.now()
        .setZone(CLIENT_TIMEZONE)
        .startOf("day")
        .plus({
          days: 7,
        })

      if (!otpExpiryDate.isValid) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "OTP Expiry Date is invalid.",
        })
      }

      const createdAt = DateTime.now().toISO()
      const newPackageStatusLogs = input.packageIds.map((packageId) => ({
        packageId,
        createdById: ctx.user.id,
        description: getDescriptionForNewPackageStatusLog({
          status: "PREPARING_FOR_DELIVERY",
        }),
        status: "PREPARING_FOR_DELIVERY" as const,
        createdAt,
      }))

      await ctx.db.transaction(async (tx) => {
        const webPushSubscriptionResults = await tx
          .select()
          .from(webpushSubscriptions)
          .where(eq(webpushSubscriptions.userId, input.driverId))

        const expoPushTokenResults = await tx
          .select()
          .from(expopushTokens)
          .where(eq(expopushTokens.userId, input.driverId))

        const packageResults = await tx
          .select()
          .from(packages)
          .where(
            and(
              inArray(packages.id, input.packageIds),
              lt(packages.failedAttempts, 3),
            ),
          )

        if (packageResults.length !== input.packageIds.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "One or more package IDs are invalid.",
          })
        }

        const packageResultsWithOtp = packageResults.map((_package) => ({
          ..._package,
          otp: generateOtp(),
        }))

        const [{ insertId: shipmentId }] = await tx.insert(shipments).values({
          type: "DELIVERY",
          status: "PREPARING",
        })

        await tx.insert(assignedDrivers).values({
          driverId: input.driverId,
          shipmentId,
        })

        await tx.insert(assignedVehicles).values({
          vehicleId: input.vehicleId,
          shipmentId,
        })

        await tx.insert(deliveryShipments).values({
          shipmentId,
          driverId: input.driverId,
          vehicleId: input.vehicleId,
          isExpress: input.isExpress ? 1 : 0,
          departureAt: input.departureAt,
          departingWarehouseId: input.departingWarehouseId,
          createdAt,
        })

        const newShipmentPackages = input.packageIds.map((packageId) => ({
          shipmentId,
          packageId,
          status: "PREPARING" as const,
          createdAt,
        }))

        const newShipmentPackageOtps = packageResultsWithOtp.map(
          ({ id, otp }) => ({
            shipmentId,
            packageId: id,
            code: otp,
            expireAt: otpExpiryDate.toISO(),
            createdAt,
          }),
        )

        await tx.insert(shipmentPackages).values(newShipmentPackages)
        await tx.insert(shipmentPackageOtps).values(newShipmentPackageOtps)
        await tx
          .update(packages)
          .set({
            status: "PREPARING_FOR_DELIVERY",
          })
          .where(inArray(packages.id, input.packageIds))
        await tx.insert(packageStatusLogs).values(newPackageStatusLogs)
        await createLog(tx, {
          verb: "CREATE",
          entity: "DELIVERY_SHIPMENT",
          createdById: ctx.user.id,
        })

        await batchNotifyBySms({
          messages: packageResultsWithOtp.map(
            ({ id, receiverContactNumber, otp }) => ({
              to: receiverContactNumber,
              body: `Your package ${id} will be delivered soon. Enter the code ${otp} for verification. This code will be valid for 7 days.`,
            }),
          ),
        })

        await batchNotifyByEmailWithComponentProps({
          messages: packageResultsWithOtp.map(
            ({ receiverEmailAddress, otp }) => ({
              to: receiverEmailAddress,
              subject: `Your package will be delivered soon`,
              componentProps: {
                type: "otp",
                otp: otp.toString(),
                validityMessage: "This code will be valid for 7 days.",
              },
            }),
          ),
        })

        if (webPushSubscriptionResults.length > 0)
          await notifyByWebPush({
            subscriptions: webPushSubscriptionResults,
            title: "New delivery assigned",
            body: `Delivery with ID ${shipmentId} has been assigned to you.`,
          })

        if (expoPushTokenResults.length > 0)
          await notifyByExpoPush({
            to: expoPushTokenResults.map((token) => token.data),
            title: "New delivery assigned",
            body: `Delivery with ID ${shipmentId} has been assigned to you.`,
          })
      })
    }),
  updateDetailsById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        driverId: z.string(),
        departureAt: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [{ driverId: previousDriverId }] = await ctx.db
        .select()
        .from(deliveryShipments)
        .where(eq(deliveryShipments.shipmentId, input.id))

      await ctx.db.transaction(async (tx) => {
        await tx.insert(assignedDrivers).values({
          driverId: input.driverId,
          shipmentId: input.id,
        })

        await tx
          .delete(assignedDrivers)
          .where(
            and(
              eq(assignedDrivers.driverId, previousDriverId),
              eq(assignedDrivers.shipmentId, input.id),
            ),
          )

        await tx
          .update(deliveryShipments)
          .set({
            driverId: input.driverId,
            departureAt: input.departureAt,
          })
          .where(eq(deliveryShipments.shipmentId, input.id))
      })

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "DELIVERY_SHIPMENT",
        createdById: ctx.user.id,
      })
    }),
})

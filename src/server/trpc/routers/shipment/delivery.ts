import { and, count, eq, inArray, lt } from "drizzle-orm"
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
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { DateTime } from "luxon"
import { generateOtp } from "@/utils/uuid"
import {
  notifyByEmail,
  notifyByExpoPush,
  notifyBySms,
  notifyByWebPush,
} from "@/server/notification"
import { createLog } from "@/utils/logging"

export const deliveryShipmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(deliveryShipments)
      .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))

    return results.map(({ shipments, delivery_shipments }) => {
      const { shipmentId, ...other } = delivery_shipments

      return {
        ...shipments,
        ...other,
      }
    })
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
  getPreparing: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(deliveryShipments)
      .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))
      .innerJoin(users, eq(deliveryShipments.driverId, users.id))
      .innerJoin(vehicles, eq(deliveryShipments.vehicleId, vehicles.id))
      .where(eq(shipments.status, "PREPARING"))

    return results.map(({ shipments, delivery_shipments, users, vehicles }) => {
      const { shipmentId, ...other } = delivery_shipments

      return {
        ...shipments,
        ...other,
        driverDisplayName: users.displayName,
        driverContactNumber: users.contactNumber,
        vehicleDisplayName: vehicles.displayName,
        vehicleType: vehicles.type,
      }
    })
  }),
  getInTransit: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(deliveryShipments)
      .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))
      .innerJoin(users, eq(deliveryShipments.driverId, users.id))
      .innerJoin(vehicles, eq(deliveryShipments.vehicleId, vehicles.id))
      .where(eq(shipments.status, "IN_TRANSIT"))

    return results.map(({ shipments, delivery_shipments, users, vehicles }) => {
      const { shipmentId, ...other } = delivery_shipments

      return {
        ...shipments,
        ...other,
        driverDisplayName: users.displayName,
        driverContactNumber: users.contactNumber,
        vehicleDisplayName: vehicles.displayName,
        vehicleType: vehicles.type,
      }
    })
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
      await ctx.db
        .update(shipments)
        .set({
          status: "COMPLETED",
        })
        .where(eq(shipments.id, input.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "DELIVERY_SHIPMENT",
        createdById: ctx.user.id,
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        driverId: z.string().length(28),
        vehicleId: z.number(),
        packageIds: z.string().array().nonempty(),
        departureAt: z.string().min(1).max(100),
        isExpress: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const otpExpiryDate = DateTime.now()
        .setZone("Asia/Manila")
        .startOf("day")
        .plus({
          day: 2,
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
          status: "SORTING",
        }),
        status: "SORTING" as const,
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

        await tx.insert(deliveryShipments).values({
          shipmentId,
          driverId: input.driverId,
          vehicleId: input.vehicleId,
          isExpress: input.isExpress ? 1 : 0,
          departureAt: input.departureAt,
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
            status: "SORTING",
          })
          .where(inArray(packages.id, input.packageIds))
        await tx.insert(packageStatusLogs).values(newPackageStatusLogs)
        await createLog(tx, {
          verb: "CREATE",
          entity: "DELIVERY_SHIPMENT",
          createdById: ctx.user.id,
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
})

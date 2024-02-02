import { eq } from "drizzle-orm"
import { protectedProcedure, router } from "../../trpc"
import {
  shipments,
  deliveryShipments,
  shipmentPackages,
  packageStatusLogs,
  shipmentPackageOtps,
  packages,
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { ResultSetHeader } from "mysql2"
import { DateTime } from "luxon"
import { generateOtp } from "@/utils/uuid"
import { notifyByEmail, notifyBySms } from "@/server/notification"

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
      .where(eq(shipments.status, "PREPARING"))

    return results.map(({ shipments, delivery_shipments }) => {
      const { shipmentId, ...other } = delivery_shipments

      return {
        ...shipments,
        ...other,
      }
    })
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
        driverId: z.string().length(28),
        vehicleId: z.number(),
        packageIds: z.string().array().nonempty(),
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
          message: "OTP Expiry Date is invalid",
        })
      }

      await ctx.db.transaction(async (tx) => {
        const [result] = (await tx.insert(shipments).values({
          type: "DELIVERY",
          status: "PREPARING",
        })) as unknown as [ResultSetHeader]
        const shipmentId = result.insertId

        await tx.insert(deliveryShipments).values({
          shipmentId,
          driverId: input.driverId,
          vehicleId: input.vehicleId,
          isExpress: input.isExpress ? 1 : 0,
        })

        for (const packageId of input.packageIds) {
          await tx.insert(shipmentPackages).values({
            shipmentId,
            packageId,
          })

          const code = generateOtp()

          await tx.insert(shipmentPackageOtps).values({
            shipmentId,
            packageId,
            code,
            expireAt: otpExpiryDate.toISO(),
          })

          await tx.insert(packageStatusLogs).values({
            packageId,
            createdById: ctx.user.uid,
            description: getDescriptionForNewPackageStatusLog("SORTING"),
            status: "SORTING",
            createdAt: new Date(),
          })

          const [{ receiverEmailAddress, receiverContactNumber }] = await tx
            .select()
            .from(packages)
            .where(eq(packages.id, packageId))

          await notifyByEmail({
            to: receiverEmailAddress,
            subject: `Your package will be delivered soon`,
            htmlBody: `<p>Your package with ID ${packageId} will be delivered soon. Upon receiving, please enter the following code ${code} in our driver app for verification. Click <a href="https://rrgfreightservices.vercel.app/tracking?id=${packageId}">here</a> to track your package.</p>`,
          })

          await notifyBySms({
            to: receiverContactNumber,
            body: `Your package ${packageId} will be delivered soon. Enter the code ${code} for verification.`,
          })
        }
      })
    }),
})

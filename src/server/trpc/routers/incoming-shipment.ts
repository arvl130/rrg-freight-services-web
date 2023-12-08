import { z } from "zod"
import { protectedProcedure, router } from "../trpc"
import {
  incomingShipmentPackages,
  incomingShipments,
  packageStatusLogs,
  packages,
} from "@/server/db/schema"
import {
  ReceptionMode,
  ShippingMode,
  ShippingType,
  getDescriptionForNewPackageStatusLog,
  supportedReceptionModes,
  supportedShippingModes,
  SUPPORTED_SHIPPING_TYPES,
} from "@/utils/constants"
import { ResultSetHeader } from "mysql2"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { Resend } from "resend"
import { serverEnv } from "@/server/env.mjs"

export const incomingShipmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(incomingShipments)
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
        .from(incomingShipments)
        .where(eq(incomingShipments.id, input.id))

      if (results.length === 0) return null
      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      return results[0]
    }),
  getInTransit: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(incomingShipments)
      .where(eq(incomingShipments.status, "IN_TRANSIT"))
  }),
  updateStatusToCompletedById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(incomingShipments)
        .set({
          status: "ARRIVED",
        })
        .where(eq(incomingShipments.id, input.id))
    }),
  create: protectedProcedure
    .input(
      z.object({
        sentByAgentId: z.string().length(28),
        newPackages: z
          .object({
            shippingMode: z.custom<ShippingMode>((val) =>
              supportedShippingModes.includes(val as ShippingMode),
            ),
            shippingType: z.custom<ShippingType>((val) =>
              SUPPORTED_SHIPPING_TYPES.includes(val as ShippingType),
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
      const newPackageIds: number[] = []
      const resend = new Resend(serverEnv.RESEND_API_KEY)

      for (const newPackage of input.newPackages) {
        const [result] = (await ctx.db.insert(packages).values({
          ...newPackage,
          createdById: ctx.user.uid,
          updatedById: ctx.user.uid,
        })) as unknown as [ResultSetHeader]
        const packageId = result.insertId

        await ctx.db.insert(packageStatusLogs).values({
          packageId,
          createdById: ctx.user.uid,
          description: getDescriptionForNewPackageStatusLog("SHIPPING"),
          status: "SHIPPING",
          createdAt: new Date(),
        })

        newPackageIds.push(packageId)

        if (serverEnv.IS_EMAIL_ENABLED === "1") {
          await resend.emails.send({
            from: `noreply@${serverEnv.MAIL_FROM_URL}`,
            to: newPackage.senderEmailAddress,
            subject: `Your package has been registered`,
            html: `<p>Your package with ID ${packageId
              .toString()
              .padStart(
                4,
                "0",
              )} has been registered to our system. Click <a href="https://rrgfreightservices.vercel.app/tracking?id=${packageId}">here</a> to track your package.</p>`,
          })

          await resend.emails.send({
            from: `noreply@${serverEnv.MAIL_FROM_URL}`,
            to: newPackage.receiverEmailAddress,
            subject: "A package will be sent to you",
            html: `<p>A package with ID ${packageId
              .toString()
              .padStart(
                4,
                "0",
              )} will be sent to you through our system. Click <a href="https://rrgfreightservices.vercel.app/tracking?id=${packageId}">here</a> to track your package.</p>`,
          })
        }
      }

      const [result] = (await ctx.db.insert(incomingShipments).values({
        sentByAgentId: input.sentByAgentId,
        status: "IN_TRANSIT",
      })) as unknown as [ResultSetHeader]
      const incomingShipmentId = result.insertId

      for (const packageId of newPackageIds) {
        await ctx.db.insert(incomingShipmentPackages).values({
          incomingShipmentId,
          packageId,
        })
      }
    }),
})

import { z } from "zod"
import { protectedProcedure, router } from "../../trpc"
import {
  shipments,
  shipmentPackages,
  incomingShipments,
  packageStatusLogs,
  packages,
  users,
  activities,
  overseasAgents,
  warehouseStaffs,
} from "@/server/db/schema"
import type {
  PackageReceptionMode,
  PackageShippingMode,
  PackageShippingType,
} from "@/utils/constants"
import {
  getDescriptionForNewPackageStatusLog,
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
} from "@/utils/constants"
import { TRPCError } from "@trpc/server"
import { and, count, eq } from "drizzle-orm"
import { generateUniqueId } from "@/utils/uuid"
import { notifyByEmail } from "@/server/notification"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"
import { getDeliverableProvinceNames } from "@/server/db/helpers/deliverable-provinces"

export const incomingShipmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(incomingShipments)
      .innerJoin(shipments, eq(incomingShipments.shipmentId, shipments.id))

    return results.map(({ shipments, incoming_shipments }) => {
      const { shipmentId, ...other } = incoming_shipments

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
        .from(incomingShipments)
        .innerJoin(shipments, eq(incomingShipments.shipmentId, shipments.id))
        .where(eq(shipments.id, input.id))

      if (results.length === 0) return null
      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      const { incoming_shipments } = results[0]
      const { shipmentId, ...other } = incoming_shipments

      return {
        ...results[0].shipments,
        ...other,
      }
    }),
  getInTransit: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select()
      .from(incomingShipments)
      .innerJoin(shipments, eq(incomingShipments.shipmentId, shipments.id))
      .innerJoin(users, eq(incomingShipments.sentByAgentId, users.id))
      .innerJoin(overseasAgents, eq(users.id, overseasAgents.userId))
      .where(eq(shipments.status, "IN_TRANSIT"))

    return results.map(
      ({ shipments, incoming_shipments, users, overseas_agents }) => {
        const { shipmentId, ...other } = incoming_shipments

        return {
          ...shipments,
          ...other,
          agentDisplayName: users.displayName,
          agentCompanyName: overseas_agents.companyName,
        }
      },
    )
  }),
  getTotalInTransitSentByAgentId: protectedProcedure.query(async ({ ctx }) => {
    const [{ value }] = await ctx.db
      .select({ value: count() })
      .from(incomingShipments)
      .innerJoin(shipments, eq(incomingShipments.shipmentId, shipments.id))
      .where(
        and(
          eq(incomingShipments.sentByAgentId, ctx.user.id),
          eq(shipments.status, "IN_TRANSIT"),
        ),
      )

    return {
      count: value,
    }
  }),
  updateStatusToCompletedById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "WAREHOUSE") {
        await ctx.db.transaction(async (tx) => {
          const [{ warehouseId }] = await tx
            .select()
            .from(warehouseStaffs)
            .where(eq(warehouseStaffs.userId, ctx.user.id))

          await tx
            .update(incomingShipments)
            .set({
              receivedAtWarehouseId: warehouseId,
            })
            .where(eq(incomingShipments.shipmentId, input.id))

          await tx
            .update(shipments)
            .set({
              status: "COMPLETED",
            })
            .where(eq(shipments.id, input.id))
        })
      } else {
        await ctx.db
          .update(shipments)
          .set({
            status: "COMPLETED",
          })
          .where(eq(shipments.id, input.id))
      }

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "INCOMING_SHIPMENT",
        createdById: ctx.user.id,
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        sentByAgentId: z.string().length(28),
        newPackages: z
          .object({
            preassignedId: z.string().min(1).max(100),
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
            volumeInCubicMeter: z.number(),
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
            isFragile: z.boolean(),
            declaredValue: z.number().nullable(),
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()
      const deliverableProvinces = await getDeliverableProvinceNames({
        db: ctx.db,
      })

      const newPackages = input.newPackages.map((newPackage) => ({
        ...newPackage,
        id: generateUniqueId(),
        createdById: ctx.user.id,
        updatedById: ctx.user.id,
        isFragile: newPackage.isFragile ? 1 : 0,
        status: "INCOMING" as const,
        createdAt,
        isDeliverable: deliverableProvinces.includes(
          newPackage.receiverStateOrProvince.trim().toUpperCase(),
        )
          ? 1
          : 0,
      }))

      const newPackageStatusLogs = newPackages.map(({ id }) => ({
        packageId: id,
        createdById: ctx.user.id,
        description: getDescriptionForNewPackageStatusLog({
          status: "INCOMING",
        }),
        status: "INCOMING" as const,
        createdAt,
      }))

      const packageSenderEmailNotifications = newPackages.map(
        ({ senderEmailAddress, id }) => ({
          to: senderEmailAddress,
          subject: `Your package has been registered`,
          htmlBody: `<p>Your package with ID ${id} has been registered to our system. Click <a href="https://rrgfreightservices.vercel.app/tracking?id=${id}">here</a> to track your package.</p>`,
        }),
      )

      const packageReceiverEmailNotifications = newPackages.map(
        ({ receiverEmailAddress, id }) => ({
          to: receiverEmailAddress,
          subject: "A package will be sent to you",
          htmlBody: `<p>A package with ID ${id} will be sent to you through our system. Click <a href="https://rrgfreightservices.vercel.app/tracking?id=${id}">here</a> to track your package.</p>`,
        }),
      )

      await ctx.db.transaction(async (tx) => {
        await tx.insert(packages).values(newPackages)
        await tx.insert(packageStatusLogs).values(newPackageStatusLogs)

        const [{ insertId: shipmentId }] = await tx.insert(shipments).values({
          type: "INCOMING",
          status: "IN_TRANSIT",
        })

        await tx.insert(incomingShipments).values({
          shipmentId,
          sentByAgentId: input.sentByAgentId,
          createdAt,
        })

        const newShipmentPackages = newPackages.map(({ id }) => ({
          shipmentId,
          packageId: id,
          status: "IN_TRANSIT" as const,
          createdAt,
        }))

        await tx.insert(shipmentPackages).values(newShipmentPackages)
        await Promise.allSettled([
          ...packageSenderEmailNotifications.map((e) => notifyByEmail(e)),
          ...packageReceiverEmailNotifications.map((e) => notifyByEmail(e)),
        ])
      })

      await createLog(ctx.db, {
        verb: "CREATE",
        entity: "INCOMING_SHIPMENT",
        createdById: ctx.user.id,
      })
    }),
  updateDetailsById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        sentByAgentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(incomingShipments)
        .set({
          sentByAgentId: input.sentByAgentId,
        })
        .where(eq(incomingShipments.shipmentId, input.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "INCOMING_SHIPMENT",
        createdById: ctx.user.id,
      })
    }),
})

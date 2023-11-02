import { eq, isNull } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import {
  packageStatusLogs,
  packages,
  shipmentHubs,
  shipmentPackages,
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
import { getShipmentHubIdOfUser } from "@/server/db/helpers/shipment-hub"

export const packageRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(packages)
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
        list: z.array(z.number()),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.list.length === 0) {
        return []
      } else {
        return await ctx.db
          .select()
          .from(packages)
          .where(inArray(packages.id, input.list))
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
  getCanBeAddedToShipment: protectedProcedure.query(async ({ ctx, input }) => {
    const shipmentHubId = await getShipmentHubIdOfUser(ctx.db, ctx.user)
    const shipmentHubResults = await ctx.db
      .select()
      .from(shipmentHubs)
      .where(eq(shipmentHubs.id, shipmentHubId))

    if (shipmentHubResults.length === 0) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Expected 1 shipment hub for this user, but got none",
      })
    }

    if (shipmentHubResults.length > 1) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Expected 1 shipment hub for this user, but got more",
      })
    }

    const [{ role: hubRole }] = shipmentHubResults

    if (hubRole === "SENDING") {
      // Get packages that has a NULL shipment_package and the created_in_hub_id is the same as the user's hub id.
      //
      // SQL Equivalent:
      // SELECT p.* FROM packages p
      // LEFT JOIN shipment_packages sp
      // ON p.id = sp.package_id
      // WHERE sp.package_id IS NULL

      const results = await ctx.db
        .select()
        .from(packages)
        .leftJoin(shipmentPackages, eq(packages.id, shipmentPackages.packageId))
        .where(isNull(shipmentPackages.packageId))

      return results.map(({ packages }) => packages)
    }
    // TODO: Handle other types of shipment hubs.
    else if (hubRole === "SENDING_RECEIVING") {
      return []
    } else return []
  }),
})

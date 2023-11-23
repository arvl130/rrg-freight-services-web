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
  supportedShippingTypes,
} from "@/utils/constants"
import { ResultSetHeader } from "mysql2"

export const incomingShipmentRouter = router({
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
      const newPackageIds: number[] = []
      for (const newPackage of input.newPackages) {
        const [result] = (await ctx.db.insert(packages).values({
          ...newPackage,
          createdById: ctx.user.uid,
          updatedById: ctx.user.uid,
        })) as unknown as [ResultSetHeader]
        await ctx.db.insert(packageStatusLogs).values({
          packageId: result.insertId,
          createdById: ctx.user.uid,
          description: getDescriptionForNewPackageStatusLog("SHIPPING"),
          status: "SHIPPING",
        })
        newPackageIds.push(result.insertId)
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

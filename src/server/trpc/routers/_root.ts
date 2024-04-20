import { z } from "zod"
import { protectedProcedure, publicProcedure, router } from "../trpc"
import { packageRouter } from "./package"
import { userRouter } from "./user"
import { packageStatusLogRouter } from "./package-status-logs"
import { vehicleRouter } from "./vehicle"
import { warehouseRouter } from "./warehouse"
import { shipmentRouter } from "./shipment/shipment"
import { packageCategoryRouter } from "./package-categories"
import { webpushSubscriptionRouter } from "./push-subscriptions"
import { activityRouter } from "./activity"
import { webauthnRouter } from "./webauthn"
import { passwordResetRouter } from "./password-reset"
import { deliverableProvinceRouter } from "./deliverable-provinces"
import { eq, between, and, count } from "drizzle-orm"
import {
  activities,
  incomingShipments,
  overseasAgents,
  packages,
  shipmentPackages,
  shipments,
  users,
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import UsersPage from "@/app/admin/users/page"

export const rootRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      }
    }),
  user: userRouter,
  package: packageRouter,
  packageStatusLog: packageStatusLogRouter,
  shipment: shipmentRouter,
  vehicle: vehicleRouter,
  warehouse: warehouseRouter,
  packageCategory: packageCategoryRouter,
  webpushSubscription: webpushSubscriptionRouter,
  activity: activityRouter,
  webauthn: webauthnRouter,
  passwordReset: passwordResetRouter,
  deliverableProvince: deliverableProvinceRouter,

  getAllPackagesByDateRange: protectedProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      }),
    )

    .query(async ({ ctx, input }) => {
      const packagesResults = await ctx.db
        .select()
        .from(packages)
        .where(between(packages.createdAt, input.startDate, input.endDate))

      return packagesResults
    }),

  getAllIncomingShipmentsByDateRange: protectedProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      }),
    )

    .query(async ({ ctx, input }) => {
      const shipmentResults = await ctx.db
        .select()
        .from(shipments)
        .innerJoin(
          incomingShipments,
          eq(shipments.id, incomingShipments.shipmentId),
        )
        .innerJoin(users, eq(incomingShipments.sentByAgentId, users.id))
        .innerJoin(overseasAgents, eq(users.id, overseasAgents.userId))

        .where(
          and(
            between(
              incomingShipments.createdAt,
              input.startDate,
              input.endDate,
            ),
            eq(shipments.type, "INCOMING"),
          ),
        )

      // const totalPacakgesInShipments = shipmentResults.map(
      //   (shipmentPackage) => {
      //     return shipmentPackage.shipment_packages
      //   },
      // )

      return shipmentResults
    }),
})

export type RootRouter = typeof rootRouter

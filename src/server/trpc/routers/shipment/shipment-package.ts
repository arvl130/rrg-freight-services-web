import { z } from "zod"
import { protectedProcedure, router } from "../../trpc"
import {
  PackageStatus,
  SUPPORTED_PACKAGE_STATUSES,
  SUPPORTED_SHIPMENT_PACKAGE_STATUSES,
  ShipmentPackageStatus,
} from "@/utils/constants"
import { packageStatusLogs, shipmentPackages } from "@/server/db/schema"
import { and, eq, inArray } from "drizzle-orm"

export const shipmentPackageRouter = router({
  updateManyToCompletedStatus: protectedProcedure
    .input(
      z.object({
        shipmentId: z.number(),
        shipmentPackageStatus: z.custom<ShipmentPackageStatus>((val) =>
          SUPPORTED_SHIPMENT_PACKAGE_STATUSES.includes(
            val as ShipmentPackageStatus,
          ),
        ),
        packageIds: z.string().array().nonempty(),
        packageStatus: z.custom<PackageStatus>((val) =>
          SUPPORTED_PACKAGE_STATUSES.includes(val as PackageStatus),
        ),
        description: z.string(),
        createdAt: z.date(),
        createdById: z.string().length(28),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newPackageStatusLogs = input.packageIds.map((packageId) => ({
        packageId,
        status: input.packageStatus,
        description: input.description,
        createdAt: input.createdAt,
        createdById: input.createdById,
      }))

      await ctx.db.transaction(async (tx) => {
        await tx.insert(packageStatusLogs).values(newPackageStatusLogs)
        await tx
          .update(shipmentPackages)
          .set({
            status: input.shipmentPackageStatus,
          })
          .where(
            and(
              eq(shipmentPackages.shipmentId, input.shipmentId),
              inArray(shipmentPackages.packageId, input.packageIds),
            ),
          )
      })
    }),
})

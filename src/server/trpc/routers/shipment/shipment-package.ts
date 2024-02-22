import { z } from "zod"
import { protectedProcedure, router } from "../../trpc"
import type { PackageStatus, ShipmentPackageStatus } from "@/utils/constants"
import {
  SUPPORTED_PACKAGE_STATUSES,
  SUPPORTED_SHIPMENT_PACKAGE_STATUSES,
} from "@/utils/constants"
import {
  packageStatusLogs,
  packages,
  shipmentPackages,
  shipments,
  incomingShipments,
} from "@/server/db/schema"
import { and, count, eq, inArray, sql } from "drizzle-orm"

export const shipmentPackageRouter = router({
  updateManyToCompletedStatusWithCategory: protectedProcedure
    .input(
      z.object({
        shipmentId: z.number(),
        shipmentPackageStatus: z.custom<ShipmentPackageStatus>((val) =>
          SUPPORTED_SHIPMENT_PACKAGE_STATUSES.includes(
            val as ShipmentPackageStatus,
          ),
        ),
        packages: z
          .object({
            id: z.string(),
            categoryId: z.number(),
          })
          .array()
          .nonempty(),
        packageStatus: z.custom<PackageStatus>((val) =>
          SUPPORTED_PACKAGE_STATUSES.includes(val as PackageStatus),
        ),
        description: z.string(),
        createdAt: z.date(),
        createdById: z.string().length(28),
        isFailedAttempt: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const packageIds = input.packages.map(({ id }) => id)
      const newPackageStatusLogs = packageIds.map((packageId) => ({
        packageId,
        status: input.packageStatus,
        description: input.description,
        createdAt: input.createdAt,
        createdById: input.createdById,
      }))

      await ctx.db.transaction(async (tx) => {
        await tx.insert(packageStatusLogs).values(newPackageStatusLogs)
        await tx
          .update(packages)
          .set({
            status: input.packageStatus,
            failedAttempts: input.isFailedAttempt
              ? sql`${packages.failedAttempts} + 1`
              : undefined,
          })
          .where(inArray(packages.id, packageIds))
        await tx
          .update(shipmentPackages)
          .set({
            status: input.shipmentPackageStatus,
          })
          .where(
            and(
              eq(shipmentPackages.shipmentId, input.shipmentId),
              inArray(shipmentPackages.packageId, packageIds),
            ),
          )

        for (const { id, categoryId } of input.packages) {
          await tx
            .update(packages)
            .set({
              categoryId,
            })
            .where(eq(packages.id, id))
        }
      })
    }),
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
        isFailedAttempt: z.boolean().default(false),
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
          .update(packages)
          .set({
            status: input.packageStatus,
            failedAttempts: input.isFailedAttempt
              ? sql`${packages.failedAttempts} + 1`
              : undefined,
          })
          .where(inArray(packages.id, input.packageIds))
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

  getTotalShipmentShipped: protectedProcedure.query(async ({ ctx }) => {
    const [{ value }] = await ctx.db
      .select({
        value: count(),
      })
      .from(shipments)
      .where(eq(shipments.status, "COMPLETED"))

    return {
      count: value,
    }
  }),
})

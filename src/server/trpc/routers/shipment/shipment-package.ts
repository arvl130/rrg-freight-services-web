import { z } from "zod"
import { protectedProcedure, router } from "../../trpc"
import type { PackageStatus, ShipmentPackageStatus } from "@/utils/constants"
import {
  SUPPORTED_PACKAGE_STATUSES,
  SUPPORTED_SHIPMENT_PACKAGE_STATUSES,
  getDescriptionForNewPackageStatusLog,
} from "@/utils/constants"
import {
  packageStatusLogs,
  packages,
  shipmentPackages,
  shipments,
  forwarderTransferShipments,
  users,
  warehouseTransferShipments,
  warehouses,
} from "@/server/db/schema"
import { and, count, eq, gte, inArray, sql } from "drizzle-orm"
import { createLog } from "@/utils/logging"
import type { DbWithEntities } from "@/server/db/entities"

async function getDescriptionForStatus(options: {
  db: DbWithEntities
  shipmentId: number
  status: PackageStatus
}) {
  if (options.status === "IN_WAREHOUSE") {
    // TODO: Retrieve the actual new warehouse, instead
    // of assuming all packages go to warehouse id 1.
    const [{ displayName }] = await options.db
      .select()
      .from(warehouses)
      .where(eq(warehouses.id, 1))

    return getDescriptionForNewPackageStatusLog({
      status: options.status,
      warehouseName: displayName,
    })
  } else if (options.status === "TRANSFERRING_WAREHOUSE") {
    const [
      {
        warehouses: { displayName },
      },
    ] = await options.db
      .select()
      .from(warehouseTransferShipments)
      .innerJoin(
        warehouses,
        eq(warehouseTransferShipments.sentToWarehouseId, warehouses.id),
      )
      .where(eq(warehouseTransferShipments.shipmentId, options.shipmentId))

    return getDescriptionForNewPackageStatusLog({
      status: options.status,
      warehouseName: displayName,
    })
  } else if (
    options.status === "TRANSFERRING_FORWARDER" ||
    options.status === "TRANSFERRED_FORWARDER"
  ) {
    const [
      {
        users: { displayName },
      },
    ] = await options.db
      .select()
      .from(forwarderTransferShipments)
      .innerJoin(users, eq(forwarderTransferShipments.sentToAgentId, users.id))
      .where(eq(forwarderTransferShipments.shipmentId, options.shipmentId))

    return getDescriptionForNewPackageStatusLog({
      status: options.status,
      forwarderName: displayName,
    })
  } else {
    return getDescriptionForNewPackageStatusLog({
      status: options.status,
    })
  }
}

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
        createdAt: z.string(),
        createdById: z.string().length(28),
        isFailedAttempt: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const description = await getDescriptionForStatus({
        db: ctx.db,
        shipmentId: input.shipmentId,
        status: input.packageStatus,
      })

      const newPackageStatusLogs = input.packageIds.map((packageId) => ({
        packageId,
        status: input.packageStatus,
        description,
        createdAt: input.createdAt,
        createdById: input.createdById,
      }))

      const packagesCandidateForPickUpResults = await ctx.db
        .select({
          id: packages.id,
        })
        .from(packages)
        .where(
          and(
            inArray(packages.id, input.packageIds),
            gte(packages.failedAttempts, 2),
          ),
        )

      const packageIdsCandidateForPickUp =
        packagesCandidateForPickUpResults.map(({ id }) => id)

      await ctx.db.transaction(async (tx) => {
        if (packageIdsCandidateForPickUp.length > 0)
          await tx
            .update(packages)
            .set({
              receptionMode: "FOR_PICKUP",
            })
            .where(inArray(packages.id, packageIdsCandidateForPickUp))

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

        await tx.insert(packageStatusLogs).values(newPackageStatusLogs)
        await createLog(tx, {
          verb: "UPDATE",
          entity: "SHIPMENT_PACKAGE",
          createdById: ctx.user.id,
        })
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
  getTotalArrivingShipment: protectedProcedure.query(async ({ ctx }) => {
    const [{ value }] = await ctx.db
      .select({
        value: count(),
      })
      .from(shipments)
      .where(eq(shipments.status, "IN_TRANSIT"))

    return {
      count: value,
    }
  }),
})

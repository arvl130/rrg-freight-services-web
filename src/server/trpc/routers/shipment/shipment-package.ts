import { z } from "zod"
import { protectedProcedure, router } from "../../trpc"
import type {
  PackageStatus,
  ShipmentPackageStatus,
  PackageRemarks,
} from "@/utils/constants"
import {
  CLIENT_TIMEZONE,
  SUPPORTED_PACKAGE_STATUSES,
  SUPPORTED_SHIPMENT_PACKAGE_STATUSES,
  getDescriptionForNewPackageStatusLog,
  SUPPORTED_PACKAGE_REMARKS,
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
  warehouseStaffs,
} from "@/server/db/schema"
import { and, count, eq, inArray, sql } from "drizzle-orm"
import { createLog } from "@/utils/logging"
import type { DbWithEntities, Package } from "@/server/db/entities"
import { getHumanizedOfPackageStatus } from "@/utils/humanize"
import {
  batchNotifyByEmailWithComponentProps,
  batchNotifyBySms,
} from "@/server/notification"
import type { User } from "lucia"
import { DateTime } from "luxon"
import { serverEnv } from "@/server/env.mjs"
import { TRPCError } from "@trpc/server"

async function getDescriptionForStatus(options: {
  db: DbWithEntities
  currentUser: User
  shipmentId: number
  status: PackageStatus
}) {
  if (options.status === "IN_WAREHOUSE") {
    const [
      {
        warehouses: { displayName },
      },
    ] = await options.db
      .select()
      .from(warehouseStaffs)
      .innerJoin(warehouses, eq(warehouseStaffs.warehouseId, warehouses.id))
      .where(eq(warehouseStaffs.userId, options.currentUser.id))

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
  updateManyToCompletedStatusFromIncompleteDelivery: protectedProcedure
    .input(
      z.object({
        shipmentId: z.number(),
        packageIds: z.string().array().nonempty(),
        createdById: z.string().length(28),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("function ran ...")

      const now = DateTime.now().setZone(CLIENT_TIMEZONE)
      if (!now.isValid) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid timezone set.",
        })
      }

      const nowPlusThreeDays = now
        .plus({
          days: 3,
        })
        .endOf("day")

      const description = await getDescriptionForStatus({
        db: ctx.db,
        currentUser: ctx.user,
        shipmentId: input.shipmentId,
        status: "IN_WAREHOUSE",
      })

      const newPackageStatusLogs = input.packageIds.map((packageId) => ({
        packageId,
        status: "IN_WAREHOUSE" as const,
        description,
        createdAt: now.toISO(),
        createdById: input.createdById,
      }))

      const packageDetails = await ctx.db
        .select()
        .from(packages)
        .where(and(inArray(packages.id, input.packageIds)))

      const packageIdsCandidateForPickUp = packageDetails
        .filter(({ failedAttempts }) => failedAttempts >= 2)
        .map(({ id }) => id)

      const packageIdsCanBeDelivered = packageDetails
        .filter(({ isDeliverable }) => isDeliverable)
        .map(({ id }) => id)

      const emailNotifications = [
        ...packageDetails.map(({ id, senderFullName, senderEmailAddress }) => ({
          to: senderEmailAddress,
          subject: `The status of your package was updated`,
          componentProps: {
            type: "package-status-update" as const,
            body: `Hi, ${senderFullName}. Your package with tracking number ${id} now has the status ${getHumanizedOfPackageStatus(
              "IN_WAREHOUSE",
            )}. For more information, click the button below.`,
            callToAction: {
              label: "Track your Package",
              href: `https://www.rrgfreight.services/tracking?id=${id}`,
            },
          },
        })),
        ...packageDetails.map(
          ({ id, receiverFullName, receiverEmailAddress, failedAttempts }) => {
            const isActionRequired = failedAttempts >= 2

            return {
              to: receiverEmailAddress,
              subject: `${
                isActionRequired ? "[ACTION REQUIRED] " : ""
              }The delivery for your package failed`,
              componentProps: {
                type: "package-status-update" as const,
                body: `Hi, ${receiverFullName}. The delivery for your package with tracking number ${id} failed and was returned to our warehouse.${
                  isActionRequired
                    ? " Please contact customer service (+02) 8461 6027 for further actions."
                    : " A re-delivery will be automatically scheduled. No further action is required."
                } For more information, click the button below.`,
                callToAction: {
                  label: "Track your Package",
                  href: `https://www.rrgfreight.services/tracking?id=${id}`,
                },
              },
            }
          },
        ),
      ]

      const packageReceiverSmsNotifications = packageDetails.map(
        ({ id, receiverContactNumber, failedAttempts }) => ({
          to: receiverContactNumber,
          body: `The delivery for your package with tracking number ${id} failed and was returned to our warehouse. ${
            failedAttempts >= 2
              ? "Please contact customer service (+02) 8461 6027 for further actions."
              : "A re-delivery will be automatically scheduled. No further action is required."
          }`,
        }),
      )

      await ctx.db.transaction(async (tx) => {
        if (packageIdsCandidateForPickUp.length > 0)
          await tx
            .update(packages)
            .set({
              receptionMode: "FOR_PICKUP",
            })
            .where(inArray(packages.id, packageIdsCandidateForPickUp))

        // Update expected_has_delivery_at if we're receiving a package.
        if (packageIdsCanBeDelivered.length > 0)
          await tx
            .update(packages)
            .set({
              expectedHasDeliveryAt: nowPlusThreeDays.toISO(),
            })
            .where(inArray(packages.id, packageIdsCanBeDelivered))

        if (ctx.user.role === "WAREHOUSE") {
          const [{ warehouseId }] = await tx
            .select()
            .from(warehouseStaffs)
            .where(eq(warehouseStaffs.userId, ctx.user.id))

          await tx
            .update(packages)
            .set({
              lastWarehouseId: warehouseId,
            })
            .where(inArray(packages.id, input.packageIds))
        }

        await tx
          .update(packages)
          .set({
            status: "IN_WAREHOUSE",
            failedAttempts: sql`${packages.failedAttempts} + 1`,
          })
          .where(inArray(packages.id, input.packageIds))

        await tx
          .update(shipmentPackages)
          .set({
            status: "COMPLETED",
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

      await batchNotifyByEmailWithComponentProps({
        messages: emailNotifications,
      })
      await batchNotifyBySms({
        messages: packageReceiverSmsNotifications,
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
        createdAt: z.string(),
        createdById: z.string().length(28),

        isFailedAttempt: z.boolean().default(false),
      }),
    )

    // z.array(
    //   z.object({
    //     id: z.string(),
    //     remarks: z.custom<PackageRemarks>((val) =>
    //       SUPPORTED_PACKAGE_REMARKS.includes(val as PackageRemarks),
    //     ),
    //   }),
    // ),
    .mutation(async ({ ctx, input }) => {
      const now = DateTime.now()
      const nowPlusThreeDays = now
        .plus({
          days: 3,
        })
        .endOf("day")

      const description = await getDescriptionForStatus({
        db: ctx.db,
        currentUser: ctx.user,
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

      const packageDetails = await ctx.db
        .select()
        .from(packages)
        .where(and(inArray(packages.id, input.packageIds)))

      const packageIdsCandidateForPickUp = packageDetails
        .filter(({ failedAttempts }) => failedAttempts >= 2)
        .map(({ id }) => id)

      const packageIdsCanBeDelivered =
        input.packageStatus === "IN_WAREHOUSE"
          ? packageDetails
              .filter(({ isDeliverable }) => isDeliverable)
              .map(({ id }) => id)
          : []

      const emailNotifications = [
        ...packageDetails.map(({ id, senderFullName, senderEmailAddress }) => ({
          to: senderEmailAddress,
          subject: `The status of your package was updated`,
          componentProps: {
            type: "package-status-update" as const,
            body: `Hi, ${senderFullName}. Your package with tracking number ${id} now has the status ${getHumanizedOfPackageStatus(
              input.packageStatus,
            )}. For more information, click the button below.`,
            callToAction: {
              label: "Track your Package",
              href: `https://www.rrgfreight.services/tracking?id=${id}`,
            },
          },
        })),
        ...packageDetails.map(
          ({ id, receiverFullName, receiverEmailAddress }) => ({
            to: receiverEmailAddress,
            subject: `The status of your package was updated`,
            componentProps: {
              type: "package-status-update" as const,
              body: `Hi, ${receiverFullName}. Your package with tracking number ${id} now has the status ${getHumanizedOfPackageStatus(
                input.packageStatus,
              )}. For more information, click the button below.`,
              callToAction: {
                label: "Track your Package",
                href: `https://www.rrgfreight.services/tracking?id=${id}`,
              },
            },
          }),
        ),
      ]

      const packageReceiverSmsNotifications = packageDetails.map(
        ({ id, receiverContactNumber }) => ({
          to: receiverContactNumber,
          body: `Your package with tracking number ${id} now has the status ${getHumanizedOfPackageStatus(
            input.packageStatus,
          )}. For more info, monitor your package on: ${
            serverEnv.BITLY_TRACKING_PAGE_URL
          }`,
        }),
      )

      await ctx.db.transaction(async (tx) => {
        if (packageIdsCandidateForPickUp.length > 0)
          await tx
            .update(packages)
            .set({
              receptionMode: "FOR_PICKUP",
            })
            .where(inArray(packages.id, packageIdsCandidateForPickUp))

        // Update expected_has_delivery_at if we're receiving a package.
        if (packageIdsCanBeDelivered.length > 0)
          await tx
            .update(packages)
            .set({
              expectedHasDeliveryAt: nowPlusThreeDays.toISO(),
            })
            .where(inArray(packages.id, packageIdsCanBeDelivered))

        // Update expected_is_delivered_at if a package is out for delivery.
        if (input.packageStatus === "DELIVERING")
          await tx
            .update(packages)
            .set({
              expectedIsDeliveredAt: nowPlusThreeDays.toISO(),
            })
            .where(inArray(packages.id, input.packageIds))

        if (
          ctx.user.role === "WAREHOUSE" &&
          input.packageStatus === "IN_WAREHOUSE"
        ) {
          const [{ warehouseId }] = await tx
            .select()
            .from(warehouseStaffs)
            .where(eq(warehouseStaffs.userId, ctx.user.id))

          await tx
            .update(packages)
            .set({
              lastWarehouseId: warehouseId,
            })
            .where(inArray(packages.id, input.packageIds))
        }

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

      await batchNotifyByEmailWithComponentProps({
        messages: emailNotifications,
      })
      await batchNotifyBySms({
        messages: packageReceiverSmsNotifications,
      })
    }),
  updateRemarksOfPackages: protectedProcedure
    .input(
      z.object({
        packageIds: z.string().array().nonempty(),
        remarks: z.object({ id: z.string(), remarks: z.string() }).array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const findRemarkById = (_packageId: string) => {
          return input.remarks.find((remark) => remark.id === _packageId)!
        }
        for (const packageId of input.packageIds) {
          await tx
            .update(packages)
            .set({
              remarks:
                findRemarkById(packageId)?.remarks === "GOOD_CONDITION"
                  ? "GOOD_CONDITION"
                  : findRemarkById(packageId)?.remarks === "BAD_CONDITION"
                    ? "BAD_CONDITION"
                    : "MISSING",
            })
            .where(eq(packages.id, packageId))
        }
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

import { z } from "zod"
import { overseasAgentProcedure, protectedProcedure, router } from "../../trpc"
import {
  shipments,
  shipmentPackages,
  incomingShipments,
  packageStatusLogs,
  packages,
  users,
  overseasAgents,
  warehouseStaffs,
  warehouses,
  barangays,
  cities,
  provinces,
  deliverableProvinces,
  uploadedManifests,
} from "@/server/db/schema"
import type {
  PackageReceptionMode,
  PackageShippingMode,
  PackageShippingType,
} from "@/utils/constants"
import {
  getDescriptionForNewPackageStatusLog,
  REGEX_ONE_OR_MORE_DIGITS,
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
} from "@/utils/constants"
import { TRPCError } from "@trpc/server"
import { and, count, eq, getTableColumns, like } from "drizzle-orm"
import { generateUniqueId } from "@/utils/uuid"
import {
  batchNotifyByEmailWithComponentProps,
  notifyByEmailWithHtmlifiedComponent,
} from "@/server/notification"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"
import { getDeliverableProvinceNames } from "@/server/db/helpers/deliverable-provinces"
import { getAreaCode } from "@/utils/area-code"
import IncomingShipmentReportEmail from "@/utils/email-templates/overseas-agent/incoming-shipment-arrived-report-email"

export const incomingShipmentRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const shipmentColumns = getTableColumns(shipments)
    const { shipmentId, ...incomingShipmentColumns } =
      getTableColumns(incomingShipments)

    return await ctx.db
      .select({
        ...shipmentColumns,
        ...incomingShipmentColumns,
        agentDisplayName: users.displayName,
        agentCompanyName: overseasAgents.companyName,
      })
      .from(incomingShipments)
      .innerJoin(shipments, eq(incomingShipments.shipmentId, shipments.id))
      .innerJoin(users, eq(incomingShipments.sentByAgentId, users.id))
      .innerJoin(
        overseasAgents,
        eq(incomingShipments.sentByAgentId, overseasAgents.userId),
      )
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

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

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
  getAllForOverseasAgent: overseasAgentProcedure.query(async ({ ctx }) => {
    const shipmentColumns = getTableColumns(shipments)
    const { shipmentId, ...incomingShipmentColumns } =
      getTableColumns(incomingShipments)

    return await ctx.db
      .select({
        ...shipmentColumns,
        ...incomingShipmentColumns,
        agentDisplayName: users.displayName,
        agentCompanyName: overseasAgents.companyName,
      })
      .from(incomingShipments)
      .innerJoin(shipments, eq(incomingShipments.shipmentId, shipments.id))
      .innerJoin(users, eq(incomingShipments.sentByAgentId, users.id))
      .innerJoin(
        overseasAgents,
        eq(incomingShipments.sentByAgentId, overseasAgents.userId),
      )
      .where(eq(incomingShipments.sentByAgentId, ctx.user.id))
  }),
  getShipmentsByOverseasAgentId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(incomingShipments)
        .innerJoin(shipments, eq(incomingShipments.shipmentId, shipments.id))
        .where(eq(incomingShipments.sentByAgentId, input.id))

      //return results[0].warehouses.displayName

      return results.map(({ shipments, incoming_shipments }) => {
        const { shipmentId, ...other } = incoming_shipments

        return {
          ...shipments,
          ...other,
        }
      })
    }),
  getWarehouseByStaffId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(warehouseStaffs)
        .innerJoin(warehouses, eq(warehouses.id, warehouseStaffs.warehouseId))
        .where(eq(warehouseStaffs.userId, input.id))

      return results[0].warehouses.displayName
    }),

  getInTransit: protectedProcedure
    .input(
      z.object({
        searchWith: z
          .literal("SHIPMENT_ID")
          .or(z.literal("PACKAGE_ID"))
          .or(z.literal("PACKAGE_PRE_ID"))
          .or(z.literal("AGENT_ID"))
          .or(z.literal("COMPANY_NAME")),
        searchTerm: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const shipmentColumns = getTableColumns(shipments)
      const { shipmentId, ...incomingShipmentColumns } =
        getTableColumns(incomingShipments)

      let currentUserWarehouseId: null | number = null
      if (ctx.user.role === "WAREHOUSE") {
        const [{ warehouseId }] = await ctx.db
          .select()
          .from(warehouseStaffs)
          .where(eq(warehouseStaffs.userId, ctx.user.id))

        currentUserWarehouseId = warehouseId
      }

      return await ctx.db
        .selectDistinct({
          ...shipmentColumns,
          ...incomingShipmentColumns,
          agentDisplayName: users.displayName,
          agentCompanyName: overseasAgents.companyName,
        })
        .from(shipmentPackages)
        .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
        .innerJoin(
          incomingShipments,
          eq(shipmentPackages.shipmentId, incomingShipments.shipmentId),
        )
        .innerJoin(shipments, eq(incomingShipments.shipmentId, shipments.id))
        .innerJoin(users, eq(incomingShipments.sentByAgentId, users.id))
        .innerJoin(overseasAgents, eq(users.id, overseasAgents.userId))
        .where(
          and(
            eq(shipments.status, "IN_TRANSIT"),
            currentUserWarehouseId === null
              ? undefined
              : eq(
                  incomingShipments.destinationWarehouseId,
                  currentUserWarehouseId,
                ),
            input.searchTerm === ""
              ? undefined
              : input.searchWith === "SHIPMENT_ID"
                ? like(shipments.id, `%${input.searchTerm}%`)
                : input.searchWith === "PACKAGE_ID"
                  ? like(packages.id, `%${input.searchTerm}%`)
                  : input.searchWith === "AGENT_ID"
                    ? like(users.displayName, `%${input.searchTerm}%`)
                    : input.searchWith === "COMPANY_NAME"
                      ? like(
                          overseasAgents.companyName,
                          `%${input.searchTerm}%`,
                        )
                      : like(packages.preassignedId, `%${input.searchTerm}%`),
          ),
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
          const [{ warehouseId, warehouseDisplayName }] = await tx
            .select({
              warehouseId: warehouseStaffs.warehouseId,
              warehouseDisplayName: warehouses.displayName,
            })
            .from(warehouseStaffs)
            .innerJoin(
              warehouses,
              eq(warehouseStaffs.warehouseId, warehouses.id),
            )
            .where(eq(warehouseStaffs.userId, ctx.user.id))

          await tx
            .update(incomingShipments)
            .set({
              destinationWarehouseId: warehouseId,
            })
            .where(eq(incomingShipments.shipmentId, input.id))

          await tx
            .update(shipments)
            .set({
              status: "COMPLETED",
            })
            .where(eq(shipments.id, input.id))

          const incomingShipmentColumns = getTableColumns(incomingShipments)
          const packageColumns = getTableColumns(packages)

          const [incomingShipment] = await tx
            .select({
              ...incomingShipmentColumns,
              agentName: users.displayName,
              agentEmailAddress: users.emailAddress,
            })
            .from(incomingShipments)
            .innerJoin(users, eq(incomingShipments.sentByAgentId, users.id))
            .where(eq(incomingShipments.shipmentId, input.id))

          const packageResults = await tx
            .select(packageColumns)
            .from(shipmentPackages)
            .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
            .where(eq(shipmentPackages.shipmentId, input.id))

          const manifestedPackages = packageResults.map(
            ({ id, preassignedId }) => ({ id, preassignedId }),
          )
          const unmanifestedPackages = packageResults
            .filter(({ isUnmanifested }) => isUnmanifested)
            .map(
              ({
                id,
                preassignedId,
                senderFullName,
                senderContactNumber,
                senderEmailAddress,
                senderStreetAddress,
                senderCity,
                senderStateOrProvince,
                senderCountryCode,
                senderPostalCode,
                receiverFullName,
                receiverContactNumber,
                receiverEmailAddress,
                receiverStreetAddress,
                receiverCity,
                receiverBarangay,
                receiverStateOrProvince,
                receiverCountryCode,
                receiverPostalCode,
              }) => ({
                id,
                preassignedId,
                senderFullName,
                senderContactNumber,
                senderEmailAddress,
                senderStreetAddress,
                senderCity,
                senderStateOrProvince,
                senderCountryCode,
                senderPostalCode,
                receiverFullName,
                receiverContactNumber,
                receiverEmailAddress,
                receiverStreetAddress,
                receiverCity,
                receiverBarangay,
                receiverStateOrProvince,
                receiverCountryCode,
                receiverPostalCode,
              }),
            )

          await notifyByEmailWithHtmlifiedComponent({
            to: incomingShipment.agentEmailAddress,
            subject: "Shipment Arrival Report",
            component: (
              <IncomingShipmentReportEmail
                agentName={incomingShipment.agentName}
                warehouseName={warehouseDisplayName}
                manifestedPackages={manifestedPackages}
                unmanifestedPackages={unmanifestedPackages}
              />
            ),
          })
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
        manifestId: z.number().optional(),
        sentByAgentId: z.string().length(28),
        destinationWarehouseId: z.number(),
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

      const newPackagePromises = input.newPackages.map(async (newPackage) => ({
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
        areaCode: await getAreaCode({
          db: ctx.db,
          provinceName: newPackage.receiverStateOrProvince,
          cityName: newPackage.receiverCity,
          barangayName: newPackage.receiverBarangay,
        }),
        sentByAgentId: input.sentByAgentId,
      }))

      const newPackages = await Promise.all(newPackagePromises)
      const newPackageStatusLogs = newPackages.map(({ id }) => ({
        packageId: id,
        createdById: ctx.user.id,
        description: getDescriptionForNewPackageStatusLog({
          status: "INCOMING",
        }),
        status: "INCOMING" as const,
        createdAt,
      }))

      const emailNotifications = [
        ...newPackages.map(({ senderFullName, senderEmailAddress, id }) => ({
          to: senderEmailAddress,
          subject: `Your package has been registered`,
          componentProps: {
            type: "package-status-update" as const,
            body: `Hi, ${senderFullName}. Your package with RRG tracking number ${id} has been registered to our system. Click the button below to track your package.`,
            callToAction: {
              label: "Track your Package",
              href: `https://www.rrgfreight.services/tracking?id=${id}`,
            },
          },
        })),
        ...newPackages.map(
          ({ receiverFullName, receiverEmailAddress, id }) => ({
            to: receiverEmailAddress,
            subject: `A Package will be sent to you`,
            componentProps: {
              type: "package-status-update" as const,
              body: `Hi, ${receiverFullName}. Your package is now forwarded to RRG Freight Services with a tracking number of ${id}. Click the button below to track your package.`,
              callToAction: {
                label: "Track your Package",
                href: `https://www.rrgfreight.services/tracking?id=${id}`,
              },
            },
          }),
        ),
      ]

      const result = await ctx.db.transaction(async (tx) => {
        await tx.insert(packages).values(newPackages)
        await tx.insert(packageStatusLogs).values(newPackageStatusLogs)

        const [{ id: shipmentId }] = await tx
          .insert(shipments)
          .values({
            type: "INCOMING",
            status: "IN_TRANSIT",
          })
          .returning()

        await tx.insert(incomingShipments).values({
          shipmentId,
          sentByAgentId: input.sentByAgentId,
          destinationWarehouseId: input.destinationWarehouseId,
          createdAt,
        })

        const newShipmentPackages = newPackages.map(({ id }) => ({
          shipmentId,
          packageId: id,
          status: "IN_TRANSIT" as const,
          createdAt,
        }))

        if (input.manifestId !== undefined) {
          console.log("updated manifests")
          await tx
            .update(uploadedManifests)
            .set({
              status: "SHIPMENT_CREATED",
              shipmentId,
            })
            .where(eq(uploadedManifests.id, input.manifestId))
        }

        await tx.insert(shipmentPackages).values(newShipmentPackages)
        await createLog(tx, {
          verb: "CREATE",
          entity: "INCOMING_SHIPMENT",
          createdById: ctx.user.id,
        })

        return {
          shipmentId,
        }
      })

      await batchNotifyByEmailWithComponentProps({
        messages: emailNotifications,
      })

      return {
        shipmentId: result.shipmentId,
      }
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
  createIndividual: protectedProcedure
    .input(
      z.object({
        currentUserId: z.string(),
        sentByAgentId: z.string().length(28),
        shipmentId: z.number(),
        preassignedId: z.string().min(1).max(100),
        shippingMode: z.custom<PackageShippingMode>((val) =>
          SUPPORTED_PACKAGE_SHIPPING_MODES.includes(val as PackageShippingMode),
        ),
        shippingType: z.custom<PackageShippingType>((val) =>
          SUPPORTED_PACKAGE_SHIPPING_TYPES.includes(val as PackageShippingType),
        ),
        receptionMode: z.custom<PackageReceptionMode>((val) =>
          SUPPORTED_PACKAGE_RECEPTION_MODES.includes(
            val as PackageReceptionMode,
          ),
        ),
        weightInKg: z.number(),
        volumeInCubicMeter: z.number(),
        isFragile: z.boolean(),
        declaredValue: z.number().nullable(),
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()

      await ctx.db.transaction(async (tx) => {
        const generatedPackagedId = generateUniqueId()
        let validateDeliberable
        await tx.insert(shipmentPackages).values({
          packageId: generatedPackagedId,
          shipmentId: input.shipmentId,
          status: "IN_TRANSIT",
          createdAt: createdAt,
        })
        //list of table needs to update 1by1
        //package status logs

        const barangayById = await tx
          .select()
          .from(barangays)
          .where(eq(barangays.code, input.receiverBarangay))

        const cityById = await tx
          .select()
          .from(cities)
          .where(eq(cities.cityId, input.receiverCity))

        const provinceById = await tx
          .select()
          .from(provinces)
          .where(eq(provinces.provinceId, input.receiverStateOrProvince))

        if (
          provinceById[0].name === "National Capital Region (First District)" ||
          provinceById[0].name ===
            "National Capital Region (Second District)" ||
          provinceById[0].name === "National Capital Region (Third District)" ||
          provinceById[0].name === "National Capital Region (Fourth District)"
        ) {
          validateDeliberable = await tx
            .select()
            .from(deliverableProvinces)
            .where(
              eq(deliverableProvinces.displayName, "National Capital Region"),
            )
        } else {
          validateDeliberable = await tx
            .select()
            .from(deliverableProvinces)
            .where(eq(deliverableProvinces.displayName, provinceById[0].name))
        }

        await tx.insert(packages).values({
          id: generatedPackagedId,
          preassignedId: input.preassignedId,
          shippingMode: input.shippingMode,
          shippingType: input.shippingType,
          receptionMode: input.receptionMode,
          weightInKg: input.weightInKg,
          volumeInCubicMeter: input.volumeInCubicMeter,
          senderFullName: input.senderFullName,
          senderContactNumber: input.senderContactNumber,
          senderEmailAddress: input.senderEmailAddress,
          senderStreetAddress: input.senderStreetAddress,
          senderCity: input.senderCity,
          senderStateOrProvince: input.senderStateOrProvince,
          senderCountryCode: input.senderCountryCode,
          senderPostalCode: input.senderPostalCode,
          receiverFullName: input.receiverFullName,
          receiverContactNumber: input.receiverContactNumber,
          receiverEmailAddress: input.receiverEmailAddress,
          receiverStreetAddress: input.receiverStreetAddress,
          receiverBarangay: barangayById[0].name,
          receiverCity: cityById[0].name,
          receiverStateOrProvince: provinceById[0].name,
          receiverCountryCode: input.receiverCountryCode,
          receiverPostalCode: input.receiverPostalCode,
          createdAt: createdAt,
          createdById: input.currentUserId,
          updatedById: input.currentUserId,
          isArchived: 0,
          isDeliverable: validateDeliberable.length > 0 ? 1 : 0,
          isUnmanifested: 1,
          isFragile: input.isFragile ? 1 : 0,
          status: "INCOMING",
          failedAttempts: 0,
          areaCode: barangayById[0].code,
          sentByAgentId: input.sentByAgentId,
        })

        await tx.insert(packageStatusLogs).values({
          packageId: generatedPackagedId,
          status: "INCOMING",
          description: getDescriptionForNewPackageStatusLog({
            status: "INCOMING",
          }),
          createdAt: createdAt,
          createdById: input.currentUserId,
        })
      })
    }),
})

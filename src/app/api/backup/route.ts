import { db } from "@/server/db/client"
import {
  shipmentPackages,
  shipments,
  deliveryShipments,
  packages,
  activities,
  forwarderTransferShipments,
  packageCategories,
  packageStatusLogs,
  shipmentLocations,
  shipmentPackageOtps,
  users,
  vehicles,
  warehouses,
  warehouseTransferShipments,
  webauthnChallenges,
  webauthnCredentials,
  webpushSubscriptions,
  incomingShipments,
} from "@/server/db/schema"
import { gt } from "drizzle-orm"
import { DateTime } from "luxon"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { uploadJsonToBucket } from "@/server/auth"

const inputSchema = z.object({
  entity: z
    .union([
      z.literal("USERS"),
      z.literal("SHIPMENTS"),
      z.literal("SHIPMENT_PACKAGES"),
      z.literal("SHIPMENT_PACKAGE_OTPS"),
      z.literal("SHIPMENT_LOCATIONS"),
      z.literal("INCOMING_SHIPMENTS"),
      z.literal("FORWARDER_TRANSFER_SHIPMENTS"),
      z.literal("WAREHOUSE_TRANSFER_SHIPMENTS"),
      z.literal("DELIVERY_SHIPMENTS"),
      z.literal("WAREHOUSES"),
      z.literal("VEHICLES"),
      z.literal("PACKAGE_CATEGORIES"),
      z.literal("PACKAGES"),
      z.literal("PACKAGE_STATUS_LOGS"),
      z.literal("ACTIVITIES"),
      z.literal("WEBPUSH_SUBSCRIPTIONS"),
      z.literal("WEBAUTHN_CHALLENGES"),
      z.literal("WEBAUTHN_CREDENTIALS"),
    ])
    .nullable(),
})

export async function GET(req: NextRequest) {
  // TODO: Only allow firing this function from a cron job.
  const searchParams = req.nextUrl.searchParams
  const entity = searchParams.get("entity")
  const startAt = DateTime.now()
    .setZone("Asia/Manila")
    .minus({
      month: 1,
    })
    .startOf("month")
    .toISO()!

  const parseResult = inputSchema.safeParse({
    entity,
  })

  if (!parseResult.success) {
    return Response.json(
      {
        message: "Bad request",
        error: parseResult.error,
      },
      {
        status: 400,
      },
    )
  }

  if (parseResult.data.entity === "ACTIVITIES") {
    const entity = await db
      .select()
      .from(activities)
      .where(gt(activities.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "DELIVERY_SHIPMENTS") {
    const entity = await db
      .select()
      .from(deliveryShipments)
      .where(gt(deliveryShipments.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "FORWARDER_TRANSFER_SHIPMENTS") {
    const entity = await db
      .select()
      .from(forwarderTransferShipments)
      .where(gt(forwarderTransferShipments.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "PACKAGES") {
    const entity = await db
      .select()
      .from(packages)
      .where(gt(packages.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "PACKAGE_CATEGORIES") {
    const entity = await db
      .select()
      .from(packageCategories)
      .where(gt(packageCategories.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "PACKAGE_STATUS_LOGS") {
    const entity = await db
      .select()
      .from(packageStatusLogs)
      .where(gt(packageStatusLogs.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "SHIPMENTS") {
    const entity = await db
      .select()
      .from(shipments)
      .where(gt(shipments.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "SHIPMENT_LOCATIONS") {
    const entity = await db
      .select()
      .from(shipmentLocations)
      .where(gt(shipmentLocations.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "SHIPMENT_PACKAGES") {
    const entity = await db
      .select()
      .from(shipmentPackages)
      .where(gt(shipmentPackages.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "SHIPMENT_PACKAGE_OTPS") {
    const entity = await db
      .select()
      .from(shipmentPackageOtps)
      .where(gt(shipmentPackageOtps.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "USERS") {
    const entity = await db
      .select()
      .from(users)
      .where(gt(users.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "VEHICLES") {
    const entity = await db
      .select()
      .from(vehicles)
      .where(gt(vehicles.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "WAREHOUSES") {
    const entity = await db
      .select()
      .from(warehouses)
      .where(gt(warehouses.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "WAREHOUSE_TRANSFER_SHIPMENTS") {
    const entity = await db
      .select()
      .from(warehouseTransferShipments)
      .where(gt(warehouseTransferShipments.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "WEBAUTHN_CHALLENGES") {
    const entity = await db
      .select()
      .from(webauthnChallenges)
      .where(gt(webauthnChallenges.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "WEBAUTHN_CREDENTIALS") {
    const entity = await db
      .select()
      .from(webauthnCredentials)
      .where(gt(webauthnCredentials.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "WEBPUSH_SUBSCRIPTIONS") {
    const entity = await db
      .select()
      .from(webpushSubscriptions)
      .where(gt(webpushSubscriptions.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else if (parseResult.data.entity === "INCOMING_SHIPMENTS") {
    const entity = await db
      .select()
      .from(incomingShipments)
      .where(gt(incomingShipments.createdAt, startAt))

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      entity,
    })
  } else {
    const activitiesResults = await db
      .select()
      .from(activities)
      .where(gt(activities.createdAt, startAt))

    const deliveryShipmentsResults = await db
      .select()
      .from(deliveryShipments)
      .where(gt(deliveryShipments.createdAt, startAt))

    const forwarderTransferShipmentsResults = await db
      .select()
      .from(forwarderTransferShipments)
      .where(gt(forwarderTransferShipments.createdAt, startAt))

    const packagesResults = await db
      .select()
      .from(packages)
      .where(gt(packages.createdAt, startAt))

    const packageCategoriesResults = await db
      .select()
      .from(packageCategories)
      .where(gt(packageCategories.createdAt, startAt))

    const packageStatusLogsResults = await db
      .select()
      .from(packageStatusLogs)
      .where(gt(packageStatusLogs.createdAt, startAt))

    const shipmentsResults = await db
      .select()
      .from(shipments)
      .where(gt(shipments.createdAt, startAt))

    const shipmentLocationsResults = await db
      .select()
      .from(shipmentLocations)
      .where(gt(shipmentLocations.createdAt, startAt))

    const shipmentPackagesResults = await db
      .select()
      .from(shipmentPackages)
      .where(gt(shipmentPackages.createdAt, startAt))

    const shipmentPackageOtpsResults = await db
      .select()
      .from(shipmentPackageOtps)
      .where(gt(shipmentPackageOtps.createdAt, startAt))

    const usersResults = await db
      .select()
      .from(users)
      .where(gt(users.createdAt, startAt))

    const vehiclesResults = await db
      .select()
      .from(vehicles)
      .where(gt(vehicles.createdAt, startAt))

    const warehousesResults = await db
      .select()
      .from(warehouses)
      .where(gt(warehouses.createdAt, startAt))

    const warehouseTransferShipmentsResults = await db
      .select()
      .from(warehouseTransferShipments)
      .where(gt(warehouseTransferShipments.createdAt, startAt))

    const webauthnChallengesResults = await db
      .select()
      .from(webauthnChallenges)
      .where(gt(webauthnChallenges.createdAt, startAt))

    const webauthnCredentialsResults = await db
      .select()
      .from(webauthnCredentials)
      .where(gt(webauthnCredentials.createdAt, startAt))

    const webpushSubscriptionsResults = await db
      .select()
      .from(webpushSubscriptions)
      .where(gt(webpushSubscriptions.createdAt, startAt))

    const incomingShipmentsResults = await db
      .select()
      .from(incomingShipments)
      .where(gt(incomingShipments.createdAt, startAt))

    const entities = {
      activities: activitiesResults,
      deliveryShipments: deliveryShipmentsResults,
      forwarderTransferShipments: forwarderTransferShipmentsResults,
      packages: packagesResults,
      packageCategories: packageCategoriesResults,
      packageStatusLogs: packageStatusLogsResults,
      shipments: shipmentsResults,
      shipmentLocations: shipmentLocationsResults,
      shipmentPackages: shipmentPackagesResults,
      shipmentPackageOtps: shipmentPackageOtpsResults,
      users: usersResults,
      vehicles: vehiclesResults,
      warehouses: warehousesResults,
      warehouseTransferShipments: warehouseTransferShipmentsResults,
      webauthnChallenges: webauthnChallengesResults,
      webauthnCredentials: webauthnCredentialsResults,
      webpushSubscriptions: webpushSubscriptionsResults,
      incomingShipments: incomingShipmentsResults,
    }

    const downloadUrl = await uploadJsonToBucket({
      filename: `backups/backup-${startAt}.json`,
      body: JSON.stringify(entities),
    })

    return Response.json({
      message: `Entity retrieved starting ${startAt}`,
      downloadUrl,
      entities,
    })
  }
}

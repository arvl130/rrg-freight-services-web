import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  packageStatusLogs,
  shipments,
  shipmentPackages,
  forwarderTransferShipments,
  packages,
  users,
  assignedDrivers,
  assignedVehicles,
  domesticAgents,
} from "@/server/db/schema"
import { serverEnv } from "@/server/env.mjs"
import {
  batchNotifyByEmailWithComponentProps,
  batchNotifyBySms,
} from "@/server/notification"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { and, eq, getTableColumns, inArray } from "drizzle-orm"
import { DateTime } from "luxon"
import { ZodError, z } from "zod"

const inputSchema = z.object({
  transferShipmentId: z.number(),
  imageUrl: z.string().url(),
})

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const { user } = await validateSessionWithHeaders({ req })
    if (user === null) {
      return Response.json(
        { message: "Unauthorized." },
        {
          status: 401,
        },
      )
    }

    const body = await req.json()
    const { transferShipmentId, imageUrl } = inputSchema.parse({
      transferShipmentId: Number(ctx.params.id),
      imageUrl: body.imageUrl,
    })

    const createdAt = DateTime.now().toISO()
    const forwarderTransferShipmentColumns = getTableColumns(
      forwarderTransferShipments,
    )

    const transferShipmentResults = await db
      .select({
        ...forwarderTransferShipmentColumns,
        agentDisplayName: users.displayName,
        agentContactNumber: users.contactNumber,
        agentCompanyName: domesticAgents.companyName,
      })
      .from(forwarderTransferShipments)
      .innerJoin(users, eq(forwarderTransferShipments.sentToAgentId, users.id))
      .innerJoin(
        domesticAgents,
        eq(forwarderTransferShipments.sentToAgentId, domesticAgents.userId),
      )
      .where(eq(forwarderTransferShipments.shipmentId, transferShipmentId))

    if (transferShipmentResults.length === 0) {
      return Response.json(
        { message: "No such delivery" },
        {
          status: 404,
        },
      )
    }

    if (transferShipmentResults.length > 1) {
      return Response.json(
        { message: "Expected 1 result, but got more" },
        {
          status: 412,
        },
      )
    }

    const [transferShipment] = transferShipmentResults

    const packageColumns = getTableColumns(packages)
    const shipmentPackageResults = await db
      .select(packageColumns)
      .from(shipmentPackages)
      .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
      .where(eq(shipmentPackages.shipmentId, transferShipmentId))

    const packageIdsToUpdate = shipmentPackageResults.map(({ id }) => id)
    const newPackageStatusLogs = shipmentPackageResults.map(({ id }) => ({
      packageId: id,
      createdById: user.id,
      description: getDescriptionForNewPackageStatusLog({
        status: "TRANSFERRED_FORWARDER",
        forwarderName: transferShipment.agentDisplayName,
      }),
      status: "TRANSFERRED_FORWARDER" as const,
      createdAt,
    }))

    const emailNotifications = [
      ...shipmentPackageResults.map(
        ({ senderFullName, senderEmailAddress, id }) => ({
          to: senderEmailAddress,
          subject: "Your package has been transferred",
          componentProps: {
            type: "package-status-update" as const,
            body: `Hi, ${senderFullName}. Your package with RRG tracking number ${id} has been transferred to another forwarder: ${transferShipment.agentDisplayName} (${transferShipment.agentCompanyName}). You may contact them through this number: ${transferShipment.agentContactNumber}. Click the button below to see your package tracking history.`,
            callToAction: {
              label: "View Tracking History",
              href: `https://www.rrgfreight.services/tracking?id=${id}`,
            },
          },
        }),
      ),
      ...shipmentPackageResults.map(
        ({ receiverFullName, receiverEmailAddress, id }) => ({
          to: receiverEmailAddress,
          subject: "Your package has been transferred",
          componentProps: {
            type: "package-status-update" as const,
            body: `Hi, ${receiverFullName}. Your package with RRG tracking number ${id} has been transferred to another forwarder: ${transferShipment.agentDisplayName} (${transferShipment.agentCompanyName}). You may contact them through this number: ${transferShipment.agentContactNumber}. Click the button below to see your package tracking history.`,
            callToAction: {
              label: "View Tracking History",
              href: `https://www.rrgfreight.services/tracking?id=${id}`,
            },
          },
        }),
      ),
    ]

    const smsNotifications = shipmentPackageResults.map(
      ({ id, receiverContactNumber }) => ({
        to: receiverContactNumber,
        body: `Your package with tracking number ${id} has been transferred. Monitor your tracking history here: ${serverEnv.BITLY_TRACKING_PAGE_URL}`,
      }),
    )

    await db.transaction(async (tx) => {
      await tx
        .update(shipments)
        .set({
          status: "COMPLETED",
        })
        .where(eq(shipments.id, transferShipmentId))

      await tx
        .update(forwarderTransferShipments)
        .set({
          proofOfTransferImgUrl: imageUrl,
        })
        .where(eq(forwarderTransferShipments.shipmentId, transferShipmentId))

      await tx
        .update(shipmentPackages)
        .set({
          status: "COMPLETED" as const,
        })
        .where(
          and(
            eq(shipmentPackages.shipmentId, transferShipmentId),
            inArray(shipmentPackages.packageId, packageIdsToUpdate),
          ),
        )

      await tx
        .update(packages)
        .set({
          status: "TRANSFERRED_FORWARDER",
        })
        .where(inArray(packages.id, packageIdsToUpdate))

      await tx.insert(packageStatusLogs).values(newPackageStatusLogs)

      await tx
        .delete(assignedDrivers)
        .where(eq(assignedDrivers.driverId, transferShipment.driverId))

      await tx
        .delete(assignedVehicles)
        .where(eq(assignedVehicles.vehicleId, transferShipment.vehicleId))
    })

    await batchNotifyByEmailWithComponentProps({
      messages: emailNotifications,
    })

    await batchNotifyBySms({
      messages: smsNotifications,
    })

    return Response.json({
      message: "Transfer shipment status updated",
      transferShipment: {
        ...transferShipment,
        status: "COMPLETED",
      },
    })
  } catch (e) {
    if (e instanceof ZodError) {
      return Response.json(
        {
          message: "Invalid input",
          error: e.flatten(),
        },
        {
          status: 400,
        },
      )
    } else {
      return Response.json(
        {
          message: "Unknown error occured",
          error: e,
        },
        {
          status: 500,
        },
      )
    }
  }
}

import { getServerSessionFromFetchRequest } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  packageStatusLogs,
  shipments,
  shipmentPackages,
  forwarderTransferShipments,
  packages,
  users,
} from "@/server/db/schema"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { and, eq, inArray } from "drizzle-orm"
import { ZodError, z } from "zod"

const getLocationsSchema = z.object({
  transferShipmentId: z.number(),
  imageUrl: z.string().url(),
})

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSessionFromFetchRequest({ req })
    if (session === null) {
      return Response.json(
        { message: "Unauthorized" },
        {
          status: 401,
        },
      )
    }

    const body = await req.json()
    const { transferShipmentId, imageUrl } = getLocationsSchema.parse({
      transferShipmentId: Number(ctx.params.id),
      imageUrl: body.imageUrl,
    })

    const transferShipmentResultsPreformatted = await db
      .select()
      .from(forwarderTransferShipments)
      .innerJoin(users, eq(forwarderTransferShipments.sentToAgentId, users.id))
      .where(eq(forwarderTransferShipments.shipmentId, transferShipmentId))

    const transferShipmentResults = transferShipmentResultsPreformatted.map(
      ({ forwarder_transfer_shipments, users }) => ({
        ...forwarder_transfer_shipments,
        agentDisplayName: users.displayName,
      }),
    )

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
    await db
      .update(shipments)
      .set({
        status: "COMPLETED",
      })
      .where(eq(shipments.id, transferShipmentId))

    await db
      .update(forwarderTransferShipments)
      .set({
        proofOfTransferImgUrl: imageUrl,
      })
      .where(eq(forwarderTransferShipments.shipmentId, transferShipmentId))

    const transferShipmentPackagesResults = await db
      .select()
      .from(shipmentPackages)
      .where(eq(shipmentPackages.shipmentId, transferShipmentId))

    const newPackageStatusLogs = transferShipmentPackagesResults.map(
      ({ packageId }) => ({
        packageId,
        createdById: session.user.uid,
        description: getDescriptionForNewPackageStatusLog({
          status: "TRANSFERRED_FORWARDER",
          forwarderName: transferShipment.agentDisplayName,
        }),
        status: "TRANSFERRED_FORWARDER" as const,
        createdAt: new Date(),
      }),
    )

    await db
      .update(shipmentPackages)
      .set({
        status: "COMPLETED" as const,
      })
      .where(
        and(
          eq(shipmentPackages.shipmentId, transferShipmentId),
          inArray(
            shipmentPackages.packageId,
            transferShipmentPackagesResults.map(({ packageId }) => packageId),
          ),
        ),
      )

    await db
      .update(packages)
      .set({
        status: "TRANSFERRED_FORWARDER",
      })
      .where(
        inArray(
          packages.id,
          transferShipmentPackagesResults.map(({ packageId }) => packageId),
        ),
      )
    await db.insert(packageStatusLogs).values(newPackageStatusLogs)

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

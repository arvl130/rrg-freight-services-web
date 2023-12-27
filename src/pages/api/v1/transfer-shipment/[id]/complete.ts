import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  packageStatusLogs,
  shipments,
  shipmentPackages,
  transferForwarderShipments,
} from "@/server/db/schema"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { eq } from "drizzle-orm"
import type { NextApiRequest, NextApiResponse } from "next"
import { ZodError, z } from "zod"

const getLocationsSchema = z.object({
  transferShipmentId: z.number(),
  imageUrl: z.string().url(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({
      message: "Unsupported method",
    })
    return
  }

  try {
    const session = await getServerSession({ req, res })
    if (session === null) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const { transferShipmentId, imageUrl } = getLocationsSchema.parse({
      transferShipmentId: parseInt(req.query.id as string),
      imageUrl: req.body.imageUrl as string,
    })

    const transferShipmentResults = await db
      .select()
      .from(transferForwarderShipments)
      .where(eq(transferForwarderShipments.shipmentId, transferShipmentId))

    if (transferShipmentResults.length === 0) {
      res.status(404).json({ message: "No such delivery" })
      return
    }

    if (transferShipmentResults.length > 1) {
      res.status(412).json({ message: "Expected 1 result, but got more" })
      return
    }

    const [transferShipment] = transferShipmentResults
    await db
      .update(shipments)
      .set({
        status: "ARRIVED",
      })
      .where(eq(shipments.id, transferShipmentId))

    await db
      .update(transferForwarderShipments)
      .set({
        proofOfTransferImgUrl: imageUrl,
      })
      .where(eq(transferForwarderShipments.shipmentId, transferShipmentId))

    const transferShipmentPackagesResults = await db
      .select()
      .from(shipmentPackages)
      .where(eq(shipmentPackages.shipmentId, transferShipmentId))

    for (const { packageId } of transferShipmentPackagesResults) {
      await db.insert(packageStatusLogs).values({
        packageId,
        createdById: session.user.uid,
        description: getDescriptionForNewPackageStatusLog(
          "TRANSFERRED_FORWARDER",
        ),
        status: "TRANSFERRED_FORWARDER",
        createdAt: new Date(),
      })
    }

    res.json({
      message: "Transfer shipment status updated",
      transferShipment: {
        ...transferShipment,
        status: "ARRIVED",
      },
    })
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json({
        message: "Invalid input",
        error: e.flatten(),
      })
    } else {
      res.status(500).json({
        message: "Unknown error occured",
        error: e,
      })
    }
  }
}

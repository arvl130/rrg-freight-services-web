import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import { packages, shipments, shipmentPackages } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import type { NextApiRequest, NextApiResponse } from "next"
import { ZodError, z } from "zod"

const getLocationsSchema = z.object({
  deliveryId: z.number(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
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

    const { deliveryId } = getLocationsSchema.parse({
      deliveryId: parseInt(req.query.id as string),
    })

    const deliveryResults = await db
      .select()
      .from(shipments)
      .where(eq(shipments.id, deliveryId))

    if (deliveryResults.length === 0) {
      res.status(404).json({ message: "No such delivery" })
      return
    }

    if (deliveryResults.length > 1) {
      res.status(412).json({ message: "Expected 1 result, but got more" })
      return
    }

    const shipmentPackagesResults = await db
      .select()
      .from(shipmentPackages)
      .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))

    const packagesResults = shipmentPackagesResults.map(
      ({ packages }) => packages,
    )

    res.json({
      message: "Delivery packages retrieved",
      packages: packagesResults,
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

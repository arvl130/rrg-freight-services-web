import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  transferShipmentLocations,
  transferShipments,
} from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { ResultSetHeader } from "mysql2"
import type { NextApiRequest, NextApiResponse } from "next"
import { ZodError, z } from "zod"

const getLocationsSchema = z.object({
  transferShipmentId: z.number(),
})

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession({ req, res })
    if (session === null) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const { transferShipmentId } = getLocationsSchema.parse({
      transferShipmentId: parseInt(req.query.id as string),
    })

    const transferShipmentsResults = await db
      .select()
      .from(transferShipments)
      .where(eq(transferShipments.id, transferShipmentId))

    if (transferShipmentsResults.length === 0) {
      res.status(404).json({ message: "No such transfer shipment" })
      return
    }

    if (transferShipmentsResults.length > 1) {
      res.status(412).json({ message: "Expected 1 result, but got more" })
      return
    }

    const transferShipmentLocationsResults = await db
      .select()
      .from(transferShipmentLocations)
      .where(
        eq(transferShipmentLocations.transferShipmentId, transferShipmentId),
      )

    res.json({
      message: "Transfer shipment locations retrieved",
      locations: transferShipmentLocationsResults,
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

const newLocationSchema = z.object({
  transferShipmentId: z.number(),
  location: z.object({
    long: z.number(),
    lat: z.number(),
  }),
})

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession({ req, res })
    if (session === null) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const { transferShipmentId, location } = newLocationSchema.parse({
      transferShipmentId: parseInt(req.query.id as string),
      location: {
        long: req.body.long,
        lat: req.body.lat,
      },
    })

    const transferShipmentsResults = await db
      .select()
      .from(transferShipments)
      .where(eq(transferShipments.id, transferShipmentId))

    if (transferShipmentsResults.length === 0) {
      res.status(404).json({ message: "No such transfer shipment" })
      return
    }

    if (transferShipmentsResults.length > 1) {
      res.status(412).json({ message: "Expected 1 result, but got more" })
      return
    }

    const createdById = session.user.uid
    const [result] = (await db.insert(transferShipmentLocations).values({
      transferShipmentId,
      long: location.long,
      lat: location.lat,
      createdById,
    })) as unknown as [ResultSetHeader]

    res.status(200).json({
      message: "Transfer shipment location recorded",
      newLocation: {
        id: result.insertId,
        transferShipmentId,
        long: location.long,
        lat: location.lat,
        createdById,
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    await handleGet(req, res)
    return
  }

  if (req.method === "POST") {
    await handlePost(req, res)
    return
  }

  res.status(405).json({
    message: "Unsupported method",
  })
}

import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import { deliveryLocations, deliveries } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { ResultSetHeader } from "mysql2"
import type { NextApiRequest, NextApiResponse } from "next"
import { ZodError, z } from "zod"

const getLocationsSchema = z.object({
  deliveryId: z.number(),
})

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
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
      .from(deliveries)
      .where(eq(deliveries.id, deliveryId))

    if (deliveryResults.length === 0) {
      res.status(404).json({ message: "No such delivery" })
      return
    }

    if (deliveryResults.length > 1) {
      res.status(412).json({ message: "Expected 1 result, but got more" })
      return
    }

    const deliveryLocationResults = await db
      .select()
      .from(deliveryLocations)
      .where(eq(deliveryLocations.deliveryId, deliveryId))

    res.json({
      message: "Delivery locations retrieved",
      locations: deliveryLocationResults,
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
  deliveryId: z.number(),
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

    const { deliveryId, location } = newLocationSchema.parse({
      deliveryId: parseInt(req.query.id as string),
      location: {
        long: req.body.long,
        lat: req.body.lat,
      },
    })

    const deliveryResults = await db
      .select()
      .from(deliveries)
      .where(eq(deliveries.id, deliveryId))

    if (deliveryResults.length === 0) {
      res.status(404).json({ message: "No such delivery" })
      return
    }

    if (deliveryResults.length > 1) {
      res.status(412).json({ message: "Expected 1 result, but got more" })
      return
    }

    const createdById = session.user.uid
    const [result] = (await db.insert(deliveryLocations).values({
      deliveryId,
      long: location.long,
      lat: location.lat,
      createdById,
    })) as unknown as [ResultSetHeader]

    res.status(200).json({
      message: "Delivery location recorded",
      data: {
        id: result.insertId,
        deliveryId,
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

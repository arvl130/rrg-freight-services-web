import { getServerSessionFromNextRequest } from "@/server/auth"
import { db } from "@/server/db/client"
import { NormalizedDeliveryShipment } from "@/server/db/entities"
import { deliveryShipments, shipments } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

const inputSchema = z.object({
  id: z.number(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string
    delivery?: NormalizedDeliveryShipment
  }>,
) {
  if (req.method !== "GET") {
    res.status(405).json({
      message: "Unsupported method",
    })
    return
  }

  const session = await getServerSessionFromNextRequest({ req })
  if (session === null) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const { id } = inputSchema.parse({
    id: parseInt(req.query.id as string),
  })

  const results = await db
    .select()
    .from(deliveryShipments)
    .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))
    .where(eq(shipments.id, id))

  if (results.length === 0) {
    res.status(404).json({ message: "No such delivery" })
    return
  }

  if (results.length > 1) {
    res.status(412).json({ message: "Expected 1 result, but got more" })
    return
  }

  const { delivery_shipments } = results[0]
  const { shipmentId, ...other } = delivery_shipments

  res.json({
    message: "Delivery retrieved",
    delivery: {
      ...results[0].shipments,
      ...other,
    },
  })
}

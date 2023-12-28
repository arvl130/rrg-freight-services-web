import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import { deliveryShipments, shipments } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { NextApiRequest, NextApiResponse } from "next"

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

  const session = await getServerSession({ req, res })
  if (session === null) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const results = await db
    .select()
    .from(deliveryShipments)
    .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))

  res.json({
    message: "Deliveries retrieved",
    deliveries: results.map(({ shipments, delivery_shipments }) => {
      const { shipmentId, ...other } = delivery_shipments

      return {
        ...shipments,
        ...other,
      }
    }),
  })
}

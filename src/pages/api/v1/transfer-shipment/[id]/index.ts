import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import { NormalizedForwarderTransferShipment } from "@/server/db/entities"
import { forwarderTransferShipments, shipments } from "@/server/db/schema"
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
    transferShipment?: NormalizedForwarderTransferShipment
  }>,
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

  const { id } = inputSchema.parse({
    id: parseInt(req.query.id as string),
  })

  const results = await db
    .select()
    .from(forwarderTransferShipments)
    .innerJoin(
      shipments,
      eq(forwarderTransferShipments.shipmentId, shipments.id),
    )
    .where(eq(shipments.id, id))

  if (results.length === 0) {
    res.status(404).json({ message: "No such transfer shipment" })
    return
  }

  if (results.length > 1) {
    res.status(412).json({ message: "Expected 1 result, but got more" })
    return
  }

  const { forwarder_transfer_shipments } = results[0]
  const { shipmentId, ...other } = forwarder_transfer_shipments

  res.json({
    message: "Transfer shipment retrieved",
    transferShipment: {
      ...results[0].shipments,
      ...other,
    },
  })
}

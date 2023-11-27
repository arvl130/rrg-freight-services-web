import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import { transferShipments } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

const inputSchema = z.object({
  id: z.number(),
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

  const session = await getServerSession({ req, res })
  if (session === null) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const { id } = inputSchema.parse({
    id: parseInt(req.query.id as string),
  })

  const transferShipmentsResults = await db
    .select()
    .from(transferShipments)
    .where(eq(transferShipments.id, id))

  if (transferShipmentsResults.length === 0) {
    res.status(404).json({ message: "No such transfer shipment" })
    return
  }

  if (transferShipmentsResults.length > 1) {
    res.status(412).json({ message: "Expected 1 result, but got more" })
    return
  }

  const [transferShipment] = transferShipmentsResults

  res.json({
    message: "Transfer shipment retrieved",
    transferShipment,
  })
}
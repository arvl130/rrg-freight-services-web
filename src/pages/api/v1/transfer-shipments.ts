import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import { forwarderTransferShipments, shipments } from "@/server/db/schema"
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
    .from(forwarderTransferShipments)
    .innerJoin(
      shipments,
      eq(forwarderTransferShipments.shipmentId, shipments.id),
    )

  res.json({
    message: "Transfer shipments retrieved",
    transferShipments: results.map(
      ({ shipments, forwarder_transfer_shipments }) => {
        const { shipmentId, ...other } = forwarder_transfer_shipments

        return {
          ...shipments,
          ...other,
        }
      },
    ),
  })
}

import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import { transferShipments } from "@/server/db/schema"
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

  const transferShipmentsResults = await db
    .select()
    .from(transferShipments)
    .where(eq(transferShipments.driverId, session.user.uid))

  res.json({
    message: "Transfer shipments retrieved",
    transferShipments: transferShipmentsResults,
  })
}

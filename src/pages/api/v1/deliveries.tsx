import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import { deliveries } from "@/server/db/schema"
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

  const deliveriesResults = await db
    .select()
    .from(deliveries)
    .where(eq(deliveries.driverId, session.user.uid))

  res.json({
    message: "Deliveries retrieved",
    deliveries: deliveriesResults,
  })
}

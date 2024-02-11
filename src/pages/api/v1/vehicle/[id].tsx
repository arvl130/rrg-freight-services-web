import { getServerSessionFromNextRequest } from "@/server/auth"
import { db } from "@/server/db/client"
import { vehicles } from "@/server/db/schema"
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

  const session = await getServerSessionFromNextRequest({ req, res })
  if (session === null) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const { id } = inputSchema.parse({
    id: parseInt(req.query.id as string),
  })

  const vehiclesResults = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, id))

  if (vehiclesResults.length === 0) {
    res.status(404).json({ message: "No such vehicle" })
    return
  }

  if (vehiclesResults.length > 1) {
    res.status(412).json({ message: "Expected 1 result, but got more" })
    return
  }

  const [vehicle] = vehiclesResults
  res.json({
    message: "Vehicle retrieved",
    vehicle,
  })
}

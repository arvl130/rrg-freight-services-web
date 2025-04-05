import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { forwarderTransferShipments, shipments } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

const inputSchema = z.object({
  id: z.number(),
})

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { user } = await validateSessionWithHeaders({ req })
  if (user === null) {
    return Response.json(
      { message: "Unauthorized." },
      {
        status: 401,
      },
    )
  }

  const params = await ctx.params
  const { id } = inputSchema.parse({
    id: Number(params.id),
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
    return Response.json(
      { message: "No such transfer shipment" },
      {
        status: 404,
      },
    )
  }

  if (results.length > 1) {
    return Response.json(
      { message: "Expected 1 result, but got more" },
      {
        status: 412,
      },
    )
  }

  const { forwarder_transfer_shipments } = results[0]
  const { shipmentId, ...other } = forwarder_transfer_shipments

  return Response.json({
    message: "Transfer shipment retrieved",
    shipment: {
      ...results[0].shipments,
      ...other,
    },
  })
}

import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { deliveryShipments, shipments } from "@/server/db/schema"
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
    .from(deliveryShipments)
    .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))
    .where(eq(shipments.id, id))

  if (results.length === 0) {
    return Response.json(
      { message: "No such delivery" },
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

  const { delivery_shipments } = results[0]
  const { shipmentId, ...other } = delivery_shipments

  return Response.json({
    message: "Delivery retrieved",
    delivery: {
      ...results[0].shipments,
      ...other,
    },
  })
}

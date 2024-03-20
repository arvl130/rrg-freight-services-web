import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { deliveryShipments, shipments } from "@/server/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
  const { user } = await validateSessionWithHeaders({ req })
  if (user === null) {
    return Response.json(
      { message: "Unauthorized." },
      {
        status: 401,
      },
    )
  }

  const results = await db
    .select()
    .from(deliveryShipments)
    .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))

  return Response.json({
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

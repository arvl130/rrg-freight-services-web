import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { forwarderTransferShipments, shipments } from "@/server/db/schema"
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
    .from(forwarderTransferShipments)
    .innerJoin(
      shipments,
      eq(forwarderTransferShipments.shipmentId, shipments.id),
    )

  return Response.json({
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

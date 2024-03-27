import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  deliveryShipments,
  shipmentPackages,
  shipments,
} from "@/server/db/schema"
import { eq, getTableColumns } from "drizzle-orm"
import { sql } from "drizzle-orm"

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

  const shipmentColumns = getTableColumns(shipments)
  const { shipmentId, ...deliveryShipmentColumns } =
    getTableColumns(deliveryShipments)

  const deliveries = await db
    .select({
      ...shipmentColumns,
      ...deliveryShipmentColumns,
      packageCount: sql`count(${shipmentPackages.packageId})`.mapWith(Number),
    })
    .from(deliveryShipments)
    .innerJoin(shipments, eq(deliveryShipments.shipmentId, shipments.id))
    .innerJoin(
      shipmentPackages,
      eq(deliveryShipments.shipmentId, shipmentPackages.shipmentId),
    )
    .groupBy(deliveryShipments.shipmentId)

  return Response.json({
    message: "Deliveries retrieved",
    deliveries,
  })
}

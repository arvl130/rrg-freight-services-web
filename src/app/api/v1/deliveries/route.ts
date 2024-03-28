import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  deliveryShipments,
  shipmentPackages,
  shipments,
} from "@/server/db/schema"
import {
  SUPPORTED_SHIPMENT_PACKAGE_STATUSES,
  type ShipmentStatus,
} from "@/utils/constants"
import { eq, getTableColumns } from "drizzle-orm"
import { sql } from "drizzle-orm"
import type { NextRequest } from "next/server"
import { ZodError, z } from "zod"

const inputSchema = z.object({
  status: z
    .custom<ShipmentStatus>((val) =>
      SUPPORTED_SHIPMENT_PACKAGE_STATUSES.includes(val as ShipmentStatus),
    )
    .nullable(),
})

export async function GET(req: NextRequest) {
  const { user } = await validateSessionWithHeaders({ req })
  if (user === null) {
    return Response.json(
      { message: "Unauthorized." },
      {
        status: 401,
      },
    )
  }

  try {
    const statusParam = req.nextUrl.searchParams.get("status")
    const { status } = inputSchema.parse({
      status: statusParam,
    })

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
      .where(status ? eq(shipments.status, status) : undefined)
      .groupBy(deliveryShipments.shipmentId)

    return Response.json({
      message: "Deliveries retrieved",
      deliveries,
    })
  } catch (e) {
    if (e instanceof ZodError) {
      return Response.json(
        {
          message: "Invalid input",
          error: e.flatten(),
        },
        {
          status: 400,
        },
      )
    } else {
      return Response.json(
        {
          message: "Unknown error occured",
          error: e,
        },
        {
          status: 500,
        },
      )
    }
  }
}

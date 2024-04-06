import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  warehouseTransferShipments,
  shipmentPackages,
  shipments,
} from "@/server/db/schema"
import {
  SUPPORTED_SHIPMENT_PACKAGE_STATUSES,
  type ShipmentStatus,
} from "@/utils/constants"
import { and, eq, getTableColumns, sql } from "drizzle-orm"
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
    const { shipmentId, ...warehouseTransferShipmentColumns } = getTableColumns(
      warehouseTransferShipments,
    )

    const results = await db
      .select({
        ...shipmentColumns,
        ...warehouseTransferShipmentColumns,
        packageCount: sql`count(${shipmentPackages.packageId})`.mapWith(Number),
      })
      .from(warehouseTransferShipments)
      .innerJoin(
        shipments,
        eq(warehouseTransferShipments.shipmentId, shipments.id),
      )
      .innerJoin(
        shipmentPackages,
        eq(warehouseTransferShipments.shipmentId, shipmentPackages.shipmentId),
      )
      .where(
        and(
          eq(warehouseTransferShipments.driverId, user.id),
          status ? eq(shipments.status, status) : undefined,
        ),
      )
      .groupBy(warehouseTransferShipments.shipmentId)

    return Response.json({
      message: "Forwarder transfer shipments retrieved.",
      shipments: results,
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

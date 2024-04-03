import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  forwarderTransferShipments,
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
    const { shipmentId, ...forwarderTransferShipmentColumns } = getTableColumns(
      forwarderTransferShipments,
    )

    const results = await db
      .select({
        ...shipmentColumns,
        ...forwarderTransferShipmentColumns,
        packageCount: sql`count(${shipmentPackages.packageId})`.mapWith(Number),
      })
      .from(forwarderTransferShipments)
      .innerJoin(
        shipments,
        eq(forwarderTransferShipments.shipmentId, shipments.id),
      )
      .innerJoin(
        shipmentPackages,
        eq(forwarderTransferShipments.shipmentId, shipmentPackages.shipmentId),
      )
      .where(
        and(
          eq(forwarderTransferShipments.driverId, user.id),
          status ? eq(shipments.status, status) : undefined,
        ),
      )
      .groupBy(forwarderTransferShipments.shipmentId)

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

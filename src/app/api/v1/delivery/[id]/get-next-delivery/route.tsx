import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  deliveryShipments,
  packages,
  shipmentPackages,
} from "@/server/db/schema"
import { getPackagesWithDistanceFromOrigin } from "@/server/geocoding"
import { HttpError } from "@/utils/errors"
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
} from "@/utils/http-status-codes"
import { and, eq, getTableColumns } from "drizzle-orm"
import { DateTime } from "luxon"
import { z } from "zod"

const inputSchema = z.object({
  shipmentId: z.number(),
  lat: z.number(),
  long: z.number(),
})

export async function POST(
  req: Request,
  ctx: { params: { id: string; packageId: string } },
) {
  try {
    const { user } = await validateSessionWithHeaders({ req })
    if (user === null)
      throw new HttpError({
        message: "Unauthorized.",
        statusCode: HTTP_STATUS_UNAUTHORIZED,
      })

    const body = await req.json()
    const parseResult = inputSchema.safeParse({
      shipmentId: Number(ctx.params.id),
      lat: body.lat,
      long: body.long,
    })

    if (!parseResult.success)
      throw new HttpError({
        message: "Bad request.",
        statusCode: HTTP_STATUS_BAD_REQUEST,
        validationError: parseResult.error,
      })

    const date = DateTime.now().setZone("Asia/Manila")
    if (!date.isValid)
      throw new HttpError({
        message: "Current date is invalid.",
        statusCode: HTTP_STATUS_SERVER_ERROR,
      })

    const { shipmentId, long, lat } = parseResult.data
    const packageColumns = getTableColumns(packages)
    const packageResults = await db
      .select(packageColumns)
      .from(packages)
      .innerJoin(shipmentPackages, eq(packages.id, shipmentPackages.packageId))
      .where(
        and(
          eq(shipmentPackages.shipmentId, shipmentId),
          eq(shipmentPackages.status, "IN_TRANSIT"),
        ),
      )

    if (packageResults.length === 0)
      return Response.json({
        message: "No more packages to deliver.",
        packageId: null,
      })

    const packagesWithDistance = await getPackagesWithDistanceFromOrigin({
      packages: packageResults,
      origin: {
        long,
        lat,
      },
    })

    const packagesSortedByDistance = packagesWithDistance.toSorted((a, b) => {
      if (a.distance > b.distance) {
        return 1
      }
      if (a.distance < b.distance) {
        return -1
      }
      return 0
    })

    const nextToBeDeliveredPackageId = packagesSortedByDistance[0].id

    await db
      .update(deliveryShipments)
      .set({
        nextToBeDeliveredPackageId,
      })
      .where(eq(deliveryShipments.shipmentId, shipmentId))

    return Response.json({
      message: "Package set as next delivery.",
      packageId: nextToBeDeliveredPackageId,
    })
  } catch (e) {
    if (e instanceof HttpError) {
      return Response.json(
        {
          message: e.message,
          errors: e.validationError ? e.validationError : undefined,
        },
        {
          status: e.statusCode,
        },
      )
    }

    if (e instanceof Error) {
      return Response.json(
        {
          message: e.message,
        },
        {
          status: 500,
        },
      )
    }

    return Response.json(
      {
        message: "Unknown error occured.",
      },
      {
        status: 500,
      },
    )
  }
}

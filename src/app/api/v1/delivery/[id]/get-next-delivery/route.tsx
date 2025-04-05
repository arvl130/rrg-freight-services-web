import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  deliveryShipments,
  packageMonitoringAccessKeys,
  packages,
  shipmentPackages,
} from "@/server/db/schema"
import { getPackagesWithDistanceFromOrigin } from "@/server/geocoding"
import { batchNotifyByEmailWithComponentProps } from "@/server/notification"
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
  ctx: { params: Promise<{ id: string; packageId: string }> },
) {
  try {
    const { user } = await validateSessionWithHeaders({ req })
    if (user === null)
      throw new HttpError({
        message: "Unauthorized.",
        statusCode: HTTP_STATUS_UNAUTHORIZED,
      })

    const body = await req.json()
    const params = await ctx.params
    const parseResult = inputSchema.safeParse({
      shipmentId: Number(params.id),
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

    const [
      {
        id: nextToBeDeliveredPackageId,
        receiverEmailAddress,
        receiverFullName,
      },
    ] = packagesSortedByDistance

    const [{ accessKey }] = await db
      .select()
      .from(packageMonitoringAccessKeys)
      .where(
        eq(packageMonitoringAccessKeys.packageId, nextToBeDeliveredPackageId),
      )
      .limit(1)

    await db
      .update(deliveryShipments)
      .set({
        nextToBeDeliveredPackageId,
      })
      .where(eq(deliveryShipments.shipmentId, shipmentId))

    await batchNotifyByEmailWithComponentProps({
      messages: [
        {
          to: receiverEmailAddress,
          subject: "Your package has been assigned as the next delivery.",
          componentProps: {
            type: "package-status-update",
            body: `Hi, ${receiverFullName}. Your package with tracking number ${nextToBeDeliveredPackageId} has been automatically selected by our system as the next package to be delivered. Live viewing of your package for shipment ID ${shipmentId} is now available. Click the button below to view the location of your package.`,
            callToAction: {
              label: "View Location History",
              href: `https://www.rrgfreight.services/tracking/${nextToBeDeliveredPackageId}/location?accessKey=${accessKey}`,
            },
          },
        },
      ],
    })

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

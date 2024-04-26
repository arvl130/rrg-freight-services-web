import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  packageStatusLogs,
  packages,
  shipmentPackageOtps,
  shipmentPackages,
} from "@/server/db/schema"
import {
  CLIENT_TIMEZONE,
  getDescriptionForNewPackageStatusLog,
} from "@/utils/constants"
import { HttpError } from "@/utils/errors"
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
} from "@/utils/http-status-codes"
import { and, eq, gt } from "drizzle-orm"
import { DateTime } from "luxon"
import { z } from "zod"

const inputSchema = z.object({
  shipmentId: z.number(),
  packageId: z.string(),
  failureReason: z.string(),
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
      packageId: ctx.params.packageId,
      failureReason: body.failureReason,
    })

    if (!parseResult.success)
      throw new HttpError({
        message: "Bad request.",
        statusCode: HTTP_STATUS_BAD_REQUEST,
        validationError: parseResult.error,
      })

    const date = DateTime.now().setZone(CLIENT_TIMEZONE)
    if (!date.isValid)
      throw new HttpError({
        message: "Current date is invalid.",
        statusCode: HTTP_STATUS_SERVER_ERROR,
      })

    const { shipmentId, packageId, failureReason } = parseResult.data

    await db.transaction(async (tx) => {
      await tx
        .update(packages)
        .set({
          status: "FAILED_DELIVERY",
        })
        .where(eq(packages.id, packageId))

      await tx
        .update(shipmentPackages)
        .set({
          status: "FAILED",
        })
        .where(
          and(
            eq(shipmentPackages.shipmentId, shipmentId),
            eq(shipmentPackages.packageId, packageId),
          ),
        )

      await tx
        .update(shipmentPackageOtps)
        .set({
          isValid: 0,
        })
        .where(
          and(
            eq(shipmentPackageOtps.shipmentId, shipmentId),
            eq(shipmentPackageOtps.packageId, packageId),
          ),
        )

      const createdAt = DateTime.now().toISO()
      await tx.insert(packageStatusLogs).values({
        packageId,
        createdAt,
        createdById: user.id,
        description: getDescriptionForNewPackageStatusLog({
          status: "FAILED_DELIVERY",
          reason: failureReason,
        }),
        status: "FAILED_DELIVERY",
      })
    })

    return Response.json({
      message: "Package marked as failed delivery.",
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

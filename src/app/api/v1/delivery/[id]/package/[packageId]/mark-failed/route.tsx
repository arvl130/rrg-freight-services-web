import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  packageStatusLogs,
  packages,
  shipmentPackageOtps,
  shipmentPackages,
} from "@/server/db/schema"
import { batchNotifyBySms } from "@/server/notification"
import {
  CLIENT_TIMEZONE,
  getDescriptionForNewPackageStatusLog,
} from "@/utils/constants"
import { HttpError } from "@/utils/errors"
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
} from "@/utils/http-status-codes"
import { and, eq, sql } from "drizzle-orm"
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

    const now = DateTime.now().setZone(CLIENT_TIMEZONE)
    if (!now.isValid)
      throw new HttpError({
        message: "Current date is invalid.",
        statusCode: HTTP_STATUS_SERVER_ERROR,
      })

    const { shipmentId, packageId, failureReason } = parseResult.data
    const packagesResults = await db
      .select()
      .from(packages)
      .where(eq(packages.id, packageId))

    if (packagesResults.length === 0) {
      throw new HttpError({
        message: "No such package",
        statusCode: HTTP_STATUS_NOT_FOUND,
      })
    }

    if (packagesResults.length > 1) {
      throw new HttpError({
        message: "Expected 1 package, but got more",
        statusCode: HTTP_STATUS_SERVER_ERROR,
      })
    }

    const [_package] = packagesResults
    const isForPickup = _package.failedAttempts + 1 >= 2

    await db.transaction(async (tx) => {
      await tx
        .update(packages)
        .set({
          status: "FAILED_DELIVERY",
          failedAttempts: sql`${packages.failedAttempts} + 1`,
          receptionMode: isForPickup ? "FOR_PICKUP" : undefined,
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

      await tx.insert(packageStatusLogs).values({
        packageId,
        createdAt: now.toISO(),
        createdById: user.id,
        description: getDescriptionForNewPackageStatusLog({
          status: "FAILED_DELIVERY",
          reason: failureReason,
        }),
        status: "FAILED_DELIVERY",
      })
    })

    await batchNotifyBySms({
      messages: [
        {
          to: _package.receiverContactNumber,
          body: `The delivery for your package with tracking number ${packageId} failed. ${
            isForPickup
              ? "Please contact customer service (+02) 8461 6027 for further actions."
              : "A re-delivery will be automatically scheduled. No further action is required."
          }`,
        },
      ],
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

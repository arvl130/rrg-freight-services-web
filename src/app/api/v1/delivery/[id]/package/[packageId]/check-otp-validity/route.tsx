import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { shipmentPackageOtps } from "@/server/db/schema"
import { CLIENT_TIMEZONE } from "@/utils/constants"
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
  code: z.number(),
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
      code: Number(body.code),
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

    const { shipmentId, packageId, code } = parseResult.data
    const otpResults = await db
      .select()
      .from(shipmentPackageOtps)
      .where(
        and(
          eq(shipmentPackageOtps.shipmentId, shipmentId),
          eq(shipmentPackageOtps.packageId, packageId),
          eq(shipmentPackageOtps.code, code),
          eq(shipmentPackageOtps.isValid, 1),
          gt(shipmentPackageOtps.expireAt, date.toISO()),
        ),
      )

    if (otpResults.length === 0) {
      throw new HttpError({
        message: "Invalid or expired OTP.",
        statusCode: HTTP_STATUS_BAD_REQUEST,
      })
    }

    if (otpResults.length > 1) {
      throw new HttpError({
        message: "Expected 1 OTP, but got more.",
        statusCode: HTTP_STATUS_SERVER_ERROR,
      })
    }

    return Response.json({
      isValid: true,
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

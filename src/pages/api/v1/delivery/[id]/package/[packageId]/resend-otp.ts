import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  packages,
  shipmentPackageOtps,
  deliveryShipments,
} from "@/server/db/schema"
import { HttpError } from "@/utils/errors"
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_METHOD_NOT_ALLOWED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
} from "@/utils/http-status-codes"
import { generateOtp } from "@/utils/uuid"
import { eq } from "drizzle-orm"
import { DateTime } from "luxon"
import type { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

const getLocationsSchema = z.object({
  shipmentId: z.number(),
  packageId: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "GET")
      throw new HttpError({
        message: "Method not allowed.",
        statusCode: HTTP_STATUS_METHOD_NOT_ALLOWED,
      })

    const session = await getServerSession({ req, res })
    if (session === null)
      throw new HttpError({
        message: "Unauthorized.",
        statusCode: HTTP_STATUS_UNAUTHORIZED,
      })

    const parseResult = getLocationsSchema.safeParse({
      shipmentId: Number(req.query.id as string),
      packageId: req.query.packageId as string,
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

    const { shipmentId, packageId } = parseResult.data

    await db.transaction(async (tx) => {
      const deliveryResults = await tx
        .select()
        .from(deliveryShipments)
        .where(eq(deliveryShipments.shipmentId, shipmentId))

      if (deliveryResults.length === 0)
        throw new HttpError({
          message: "No such delivery.",
          statusCode: HTTP_STATUS_NOT_FOUND,
        })

      if (deliveryResults.length > 1)
        throw new HttpError({
          message: "Expected 1 delivery, but got more.",
          statusCode: HTTP_STATUS_SERVER_ERROR,
        })

      const packagesResults = await tx
        .select()
        .from(packages)
        .where(eq(packages.id, packageId))

      if (packagesResults.length === 0)
        throw new HttpError({
          message: "No such package",
          statusCode: HTTP_STATUS_NOT_FOUND,
        })

      if (packagesResults.length > 1)
        throw new HttpError({
          message: "Expected 1 package, but got more",
          statusCode: HTTP_STATUS_SERVER_ERROR,
        })

      await tx.insert(shipmentPackageOtps).values({
        shipmentId,
        packageId,
        code: generateOtp(),
        expireAt: date.toISO(),
      })
    })

    res.json({
      message: "New OTP created.",
    })
  } catch (e) {
    if (e instanceof HttpError) {
      res.status(e.statusCode).json({
        message: e.message,
        errors: e.validationError ? e.validationError : undefined,
      })
    } else if (e instanceof Error) {
      res.status(500).json({
        message: e.message,
      })
    } else {
      res.status(500).json({
        message: "Unknown error occured.",
      })
    }
  }
}

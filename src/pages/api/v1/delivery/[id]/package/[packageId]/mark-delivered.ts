import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  packageStatusLogs,
  packages,
  shipmentPackageOtps,
  shipmentPackages,
} from "@/server/db/schema"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { HttpError } from "@/utils/errors"
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_METHOD_NOT_ALLOWED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
} from "@/utils/http-status-codes"
import { and, eq, gt } from "drizzle-orm"
import { DateTime } from "luxon"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

const inputSchema = z.object({
  shipmentId: z.number(),
  packageId: z.string(),
  imageUrl: z.string().url(),
  code: z.number(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST")
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

    const parseResult = inputSchema.safeParse({
      shipmentId: Number(req.query.id as string),
      packageId: req.query.packageId as string,
      imageUrl: req.body.imageUrl as string,
      code: Number(req.body.code as string),
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

    const { shipmentId, packageId, imageUrl, code } = parseResult.data

    await db.transaction(async (tx) => {
      const otpResults = await tx
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

      await tx
        .update(shipmentPackageOtps)
        .set({
          isValid: 0,
        })
        .where(
          and(
            eq(shipmentPackageOtps.shipmentId, shipmentId),
            eq(shipmentPackageOtps.packageId, packageId),
            eq(shipmentPackageOtps.isValid, 1),
            gt(shipmentPackageOtps.expireAt, date.toISO()),
          ),
        )

      const packagesResults = await tx
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

      await tx
        .update(packages)
        .set({
          proofOfDeliveryImgUrl: imageUrl,
        })
        .where(eq(packages.id, packageId))

      await tx
        .update(shipmentPackages)
        .set({
          status: "COMPLETED" as const,
        })
        .where(
          and(
            eq(shipmentPackages.shipmentId, shipmentId),
            eq(shipmentPackages.packageId, packageId),
          ),
        )

      await tx
        .update(packages)
        .set({
          status: "DELIVERED",
        })
        .where(eq(packages.id, packageId))

      await tx.insert(packageStatusLogs).values({
        packageId,
        createdById: session.user.uid,
        description: getDescriptionForNewPackageStatusLog("DELIVERED"),
        status: "DELIVERED",
      })

      res.json({
        message: "Package marked as delivered.",
        package: {
          ..._package,
          proofOfDeliveryImgUrl: imageUrl,
        },
      })
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

import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  packages,
  shipmentPackageOtps,
  deliveryShipments,
} from "@/server/db/schema"
import {
  batchNotifyByEmailWithComponentProps,
  batchNotifyBySms,
} from "@/server/notification"
import { HttpError } from "@/utils/errors"
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
} from "@/utils/http-status-codes"
import { generateOtp } from "@/utils/uuid"
import { eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { z } from "zod"

const getLocationsSchema = z.object({
  shipmentId: z.number(),
  packageId: z.string(),
})

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string; packageId: string }> },
) {
  const createdAt = DateTime.now().toISO()

  try {
    const { user } = await validateSessionWithHeaders({ req })
    if (user === null)
      throw new HttpError({
        message: "Unauthorized.",
        statusCode: HTTP_STATUS_UNAUTHORIZED,
      })

    const params = await ctx.params
    const parseResult = getLocationsSchema.safeParse({
      shipmentId: Number(params.id),
      packageId: params.packageId,
    })

    if (!parseResult.success)
      throw new HttpError({
        message: "Bad request.",
        statusCode: HTTP_STATUS_BAD_REQUEST,
        validationError: parseResult.error,
      })

    const date = DateTime.now().setZone("Asia/Manila").plus({
      days: 3,
    })

    if (!date.isValid)
      throw new HttpError({
        message: "Current date is invalid.",
        statusCode: HTTP_STATUS_SERVER_ERROR,
      })

    const expireAt = date.toISO()
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

      const code = generateOtp()
      const [{ id, receiverEmailAddress, receiverContactNumber }] =
        packagesResults

      await tx
        .insert(shipmentPackageOtps)
        .values({
          shipmentId,
          packageId,
          code,
          expireAt,
          createdAt,
        })
        .onConflictDoUpdate({
          target: [
            shipmentPackageOtps.shipmentId,
            shipmentPackageOtps.packageId,
          ],
          set: { code, expireAt, createdAt },
        })

      await batchNotifyBySms({
        messages: [
          {
            to: receiverContactNumber,
            body: `Your package ${id} will be delivered soon. Enter the code ${code} for verification. This code will be valid for 3 days.`,
          },
        ],
      })
      await batchNotifyByEmailWithComponentProps({
        messages: [
          {
            to: receiverEmailAddress,
            subject: `Your package will be delivered soon`,
            componentProps: {
              type: "otp",
              id,
              otp: code.toString(),
              validityMessage: "This code will be valid for 3 days.",
            },
          },
        ],
      })
    })

    return Response.json({
      message: "New OTP created.",
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

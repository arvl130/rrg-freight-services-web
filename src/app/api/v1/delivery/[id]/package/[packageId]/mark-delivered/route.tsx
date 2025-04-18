import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  packageMonitoringAccessKeys,
  packageStatusLogs,
  packages,
  shipmentPackageOtps,
  shipmentPackages,
  users,
} from "@/server/db/schema"
import { serverEnv } from "@/server/env.mjs"
import {
  batchNotifyByEmailWithComponentProps,
  batchNotifyBySms,
} from "@/server/notification"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { HttpError } from "@/utils/errors"
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
} from "@/utils/http-status-codes"
import { and, eq, getTableColumns, gt } from "drizzle-orm"
import { DateTime } from "luxon"
import { z } from "zod"

const inputSchema = z.object({
  shipmentId: z.number(),
  packageId: z.string(),
  imageUrl: z.string().url(),
  code: z.number(),
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
      packageId: params.packageId,
      imageUrl: body.imageUrl,
      code: Number(body.code),
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

    const [accessKey] = await db
      .select()
      .from(packageMonitoringAccessKeys)
      .where(eq(packageMonitoringAccessKeys.packageId, packageId))
      .limit(1)

    const { package: _package } = await db.transaction(async (tx) => {
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
          ),
        )

      const packageColumns = getTableColumns(packages)
      const packagesResults = await tx
        .select({
          ...packageColumns,
          sentByAgentDisplayName: users.displayName,
          sentByAgentEmailAddress: users.emailAddress,
        })
        .from(packages)
        .innerJoin(users, eq(packages.sentByAgentId, users.id))
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

      const createdAt = DateTime.now().toISO()
      await tx
        .update(packages)
        .set({
          status: "DELIVERED",
          settledAt: createdAt,
        })
        .where(eq(packages.id, packageId))

      await tx.insert(packageStatusLogs).values({
        packageId,
        createdAt,
        createdById: user.id,
        description: getDescriptionForNewPackageStatusLog({
          status: "DELIVERED",
        }),
        status: "DELIVERED",
      })

      await batchNotifyByEmailWithComponentProps({
        messages: [
          {
            to: _package.sentByAgentEmailAddress,
            subject: "Your package has been delivered",
            componentProps: {
              type: "package-status-update",
              body: `Hi, ${_package.sentByAgentDisplayName}. Your package with RRG tracking number ${_package.id} has been delivered. Visit our agents dashboard for more information on your packages.`,
              callToAction: {
                label: "Monitor your Packages",
                href: "https://www.rrgfreight.services/overseas/packages",
              },
            },
          },
          {
            to: _package.receiverEmailAddress,
            subject: "Your package has been delivered",
            componentProps: {
              type: "package-status-update",
              body: `Hi, ${_package.receiverFullName}. Your package with RRG tracking number ${_package.id} has been delivered. We would love to hear more from you on how we can improve.`,
              callToAction: {
                label: "Fill up our Survey",
                href: `https://www.rrgfreight.services/tracking/${_package.id}/survey?accessKey=${accessKey.accessKey}`,
              },
            },
          },
        ],
      })

      await batchNotifyBySms({
        messages: [
          {
            to: _package.receiverContactNumber,
            body: `Your package with tracking number ${_package.id} has been delivered. Monitor your tracking history here: ${serverEnv.BITLY_TRACKING_PAGE_URL}`,
          },
        ],
      })

      return {
        package: {
          ..._package,
          proofOfDeliveryImgUrl: imageUrl,
        },
      }
    })

    return Response.json({
      message: "Package marked as delivered.",
      package: _package,
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

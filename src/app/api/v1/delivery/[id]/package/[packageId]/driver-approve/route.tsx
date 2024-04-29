import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { shipmentPackages } from "@/server/db/schema"
import { HttpError } from "@/utils/errors"
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
} from "@/utils/http-status-codes"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

const inputSchema = z.object({
  shipmentId: z.number(),
  packageId: z.string(),
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

    const parseResult = inputSchema.safeParse({
      shipmentId: Number(ctx.params.id),
      packageId: ctx.params.packageId,
    })

    if (!parseResult.success)
      throw new HttpError({
        message: "Bad request.",
        statusCode: HTTP_STATUS_BAD_REQUEST,
        validationError: parseResult.error,
      })

    const { shipmentId, packageId } = parseResult.data

    await db
      .update(shipmentPackages)
      .set({
        isDriverApproved: 1,
      })
      .where(
        and(
          eq(shipmentPackages.shipmentId, shipmentId),
          eq(shipmentPackages.packageId, packageId),
        ),
      )

    return Response.json({
      message: "Package approved by driver.",
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

import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { packageStatusLogs, packages } from "@/server/db/schema"
import type { PackageStatus } from "@/utils/constants"
import {
  getDescriptionForNewPackageStatusLog,
  SUPPORTED_PACKAGE_STATUSES,
} from "@/utils/constants"
import { eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { ZodError, z } from "zod"

const inputSchema = z
  .object({
    packageId: z.string(),
    status: z.custom<PackageStatus>((val) =>
      SUPPORTED_PACKAGE_STATUSES.includes(val as PackageStatus),
    ),
    warehouseName: z.string().optional(),
    forwarderName: z.string().optional(),
  })
  .superRefine(({ status, warehouseName }, ctx) => {
    if (
      (status === "IN_WAREHOUSE" || status === "TRANSFERRING_WAREHOUSE") &&
      typeof warehouseName === "undefined"
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Warehouse name must be provided when setting this status.",
      })
    } else if (
      (status === "TRANSFERRING_FORWARDER" ||
        status === "TRANSFERRED_FORWARDER") &&
      typeof warehouseName === "undefined"
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Forwarder name must be provided when setting this status.",
      })
    }
  })

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const { user } = await validateSessionWithHeaders({ req })
    if (user === null) {
      return Response.json(
        { message: "Unauthorized." },
        {
          status: 401,
        },
      )
    }

    const body = await req.json()
    const input = inputSchema.parse({
      packageId: Number(ctx.params.id),
      status: body.status,
    })

    const packageResults = await db
      .select()
      .from(packages)
      .where(eq(packages.id, input.packageId))

    if (packageResults.length === 0) {
      return Response.json(
        { message: "No such package" },
        {
          status: 404,
        },
      )
    }

    if (packageResults.length > 1) {
      return Response.json(
        { message: "Expected 1 result, but got more" },
        {
          status: 412,
        },
      )
    }

    if (packageResults[0].status === input.status) {
      return Response.json(
        {
          message: "Already updated",
        },
        {
          status: 400,
        },
      )
    }

    await db
      .update(packages)
      .set({
        status: input.status,
      })
      .where(eq(packages.id, input.packageId))

    const createdAt = DateTime.now().toISO()
    const createdById = user.id

    if (
      input.status === "IN_WAREHOUSE" ||
      input.status === "TRANSFERRING_WAREHOUSE"
    ) {
      const description = getDescriptionForNewPackageStatusLog({
        status: input.status,
        warehouseName: input.warehouseName!,
      })

      const [{ insertId }] = await db.insert(packageStatusLogs).values({
        ...input,
        createdAt,
        createdById,
        description,
      })

      return Response.json({
        message: "Package status updated",
        data: {
          id: insertId,
          packageId: input.packageId,
          status: input.status,
          createdAt,
          description,
          createdById,
        },
      })
    } else if (
      input.status === "TRANSFERRING_FORWARDER" ||
      input.status === "TRANSFERRED_FORWARDER"
    ) {
      const description = getDescriptionForNewPackageStatusLog({
        status: input.status,
        forwarderName: input.forwarderName!,
      })

      const [{ insertId }] = await db.insert(packageStatusLogs).values({
        ...input,
        createdAt,
        createdById,
        description,
      })

      return Response.json({
        message: "Package status updated",
        data: {
          id: insertId,
          packageId: input.packageId,
          status: input.status,
          createdAt,
          description,
          createdById,
        },
      })
    } else {
      const description = getDescriptionForNewPackageStatusLog({
        status: input.status,
      })

      const [{ insertId }] = await db.insert(packageStatusLogs).values({
        ...input,
        createdAt,
        createdById,
        description,
      })

      return Response.json({
        message: "Package status updated",
        data: {
          id: insertId,
          packageId: input.packageId,
          status: input.status,
          createdAt,
          description,
          createdById,
        },
      })
    }
  } catch (e) {
    if (e instanceof ZodError) {
      return Response.json(
        {
          message: "Invalid input",
          error: e.flatten(),
        },
        {
          status: 400,
        },
      )
    } else {
      return Response.json(
        {
          message: "Unknown error occured",
          error: e,
        },
        {
          status: 500,
        },
      )
    }
  }
}

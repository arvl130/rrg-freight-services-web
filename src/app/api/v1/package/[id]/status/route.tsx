import {
  getServerSessionFromFetchRequest,
  getServerSessionFromNextRequest,
} from "@/server/auth"
import { db } from "@/server/db/client"
import { packageStatusLogs, packages } from "@/server/db/schema"
import type {
  PackageStatus} from "@/utils/constants";
import {
  getDescriptionForNewPackageStatusLog,
  SUPPORTED_PACKAGE_STATUSES,
} from "@/utils/constants"
import { eq } from "drizzle-orm"
import type { ResultSetHeader } from "mysql2"
import { ZodError, z } from "zod"

const inputSchema = z.object({
  packageId: z.string(),
  status: z.custom<PackageStatus>((val) =>
    SUPPORTED_PACKAGE_STATUSES.includes(val as PackageStatus),
  ),
})

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSessionFromFetchRequest({ req })
    if (session === null) {
      return Response.json(
        { message: "Unauthorized" },
        {
          status: 401,
        },
      )
    }

    const body = await req.json()
    const { packageId, status } = inputSchema.parse({
      packageId: Number(ctx.params.id),
      status: body.status,
    })

    const packageResults = await db
      .select()
      .from(packages)
      .where(eq(packages.id, packageId))

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

    if (packageResults[0].status === status) {
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
        status,
      })
      .where(eq(packages.id, packageId))

    const createdAt = new Date()
    const description = getDescriptionForNewPackageStatusLog(status)
    const createdById = session.user.uid
    const [result] = (await db.insert(packageStatusLogs).values({
      packageId,
      status,
      createdAt,
      description,
      createdById,
    })) as unknown as [ResultSetHeader]

    return Response.json({
      message: "Package status updated",
      data: {
        id: result.insertId,
        packageId,
        status,
        createdAt,
        description,
        createdById,
      },
    })
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

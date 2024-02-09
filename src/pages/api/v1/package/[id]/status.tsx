import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import { packageStatusLogs, packages } from "@/server/db/schema"
import {
  PackageStatus,
  getDescriptionForNewPackageStatusLog,
  SUPPORTED_PACKAGE_STATUSES,
} from "@/utils/constants"
import { and, eq, isNull, lt } from "drizzle-orm"
import { alias } from "drizzle-orm/mysql-core"
import { ResultSetHeader } from "mysql2"
import type { NextApiRequest, NextApiResponse } from "next"
import { ZodError, z } from "zod"

const inputSchema = z.object({
  packageId: z.string(),
  status: z.custom<PackageStatus>((val) =>
    SUPPORTED_PACKAGE_STATUSES.includes(val as PackageStatus),
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({
      message: "Unsupported method",
    })
    return
  }

  try {
    const session = await getServerSession({ req, res })
    if (session === null) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const { packageId, status } = inputSchema.parse({
      packageId: parseInt(req.query.id as string),
      status: req.body.status,
    })

    const packageResults = await db
      .select()
      .from(packages)
      .where(eq(packages.id, packageId))

    if (packageResults.length === 0) {
      res.status(404).json({ message: "No such package" })
      return
    }

    if (packageResults.length > 1) {
      res.status(412).json({ message: "Expected 1 result, but got more" })
      return
    }

    if (packageResults[0].status === status) {
      res.status(400).json({
        message: "Already updated",
      })
      return
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

    res.status(200).json({
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
      res.status(400).json({
        message: "Invalid input",
        error: e.flatten(),
      })
    } else {
      res.status(500).json({
        message: "Unknown error occured",
        error: e,
      })
    }
  }
}

import { getServerSessionFromNextRequest } from "@/server/auth"
import { db } from "@/server/db/client"
import { packageStatusLogs, packages } from "@/server/db/schema"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { eq } from "drizzle-orm"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

const inputSchema = z.object({
  id: z.string(),
  imageUrl: z.string().url(),
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

  const session = await getServerSessionFromNextRequest({ req })
  if (session === null) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const parseResult = inputSchema.safeParse({
    id: req.query.id as string,
    imageUrl: req.body.imageUrl as string,
  })

  if (!parseResult.success) {
    res.status(400).json({
      message: "Bad request",
      error: parseResult.error,
    })
    return
  }

  const { id, imageUrl } = parseResult.data
  const packagesResults = await db
    .select()
    .from(packages)
    .where(eq(packages.id, id))

  if (packagesResults.length === 0) {
    res.status(404).json({ message: "No such delivery" })
    return
  }

  if (packagesResults.length > 1) {
    res.status(412).json({ message: "Expected 1 result, but got more" })
    return
  }

  const [_package] = packagesResults

  await db
    .update(packages)
    .set({
      status: "DELIVERED",
      proofOfDeliveryImgUrl: imageUrl,
    })
    .where(eq(packages.id, id))

  await db.insert(packageStatusLogs).values({
    packageId: id,
    createdById: session.user.uid,
    description: getDescriptionForNewPackageStatusLog("DELIVERED"),
    status: "DELIVERED",
  })

  res.json({
    message: "Package retrieved",
    package: {
      ..._package,
      proofOfDeliveryImgUrl: imageUrl,
    },
  })
}

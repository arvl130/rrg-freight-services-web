import { getServerSessionFromFetchRequest } from "@/server/auth"
import { db } from "@/server/db/client"
import { packageStatusLogs, packages } from "@/server/db/schema"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { eq } from "drizzle-orm"
import { z } from "zod"

const inputSchema = z.object({
  id: z.string(),
  imageUrl: z.string().url(),
})

export async function POST(req: Request, ctx: { params: { id: string } }) {
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
  const parseResult = inputSchema.safeParse({
    id: ctx.params.id,
    imageUrl: body.imageUrl,
  })

  if (!parseResult.success) {
    return Response.json(
      {
        message: "Bad request",
        error: parseResult.error,
      },
      {
        status: 400,
      },
    )
  }

  const { id, imageUrl } = parseResult.data
  const packagesResults = await db
    .select()
    .from(packages)
    .where(eq(packages.id, id))

  if (packagesResults.length === 0) {
    return Response.json(
      { message: "No such delivery" },
      {
        status: 404,
      },
    )
  }

  if (packagesResults.length > 1) {
    return Response.json(
      { message: "Expected 1 result, but got more" },
      {
        status: 412,
      },
    )
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

  return Response.json({
    message: "Package retrieved",
    package: {
      ..._package,
      proofOfDeliveryImgUrl: imageUrl,
    },
  })
}

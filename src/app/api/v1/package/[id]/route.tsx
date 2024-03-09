import { getServerSessionFromFetchRequest } from "@/server/auth"
import { db } from "@/server/db/client"
import { packages } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { ZodError, z } from "zod"

const inputSchema = z.object({
  packageId: z.string(),
})

export async function GET(req: Request, ctx: { params: { id: string } }) {
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

    const input = inputSchema.parse({
      packageId: ctx.params.id,
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

    return Response.json({
      message: "Package status updated",
      package: packageResults[0],
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

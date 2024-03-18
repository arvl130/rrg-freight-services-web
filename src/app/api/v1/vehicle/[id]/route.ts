import { validateSessionFromHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { vehicles } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

const inputSchema = z.object({
  id: z.number(),
})

export async function GET(req: Request, ctx: { params: { id: string } }) {
  const session = await validateSessionFromHeaders({ req })
  if (session === null) {
    return Response.json(
      { message: "Unauthorized" },
      {
        status: 401,
      },
    )
  }

  const { id } = inputSchema.parse({
    id: Number(ctx.params.id),
  })

  const vehiclesResults = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, id))

  if (vehiclesResults.length === 0) {
    return Response.json(
      { message: "No such vehicle" },
      {
        status: 404,
      },
    )
  }

  if (vehiclesResults.length > 1) {
    return Response.json(
      { message: "Expected 1 result, but got more" },
      {
        status: 412,
      },
    )
  }

  const [vehicle] = vehiclesResults
  return Response.json({
    message: "Vehicle retrieved",
    vehicle,
  })
}

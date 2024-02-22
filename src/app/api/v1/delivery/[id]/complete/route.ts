import { getServerSessionFromFetchRequest } from "@/server/auth"
import { db } from "@/server/db/client"
import { shipments } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { ZodError, z } from "zod"

const getLocationsSchema = z.object({
  deliveryId: z.number(),
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

    const { deliveryId } = getLocationsSchema.parse({
      deliveryId: Number(ctx.params.id),
    })

    const deliveryResults = await db
      .select()
      .from(shipments)
      .where(eq(shipments.id, deliveryId))

    if (deliveryResults.length === 0) {
      return Response.json(
        { message: "No such delivery" },
        {
          status: 404,
        },
      )
    }

    if (deliveryResults.length > 1) {
      return Response.json(
        { message: "Expected 1 result, but got more" },
        {
          status: 412,
        },
      )
    }

    const [delivery] = deliveryResults
    await db
      .update(shipments)
      .set({
        status: "COMPLETED",
      })
      .where(eq(shipments.id, deliveryId))

    return Response.json({
      message: "Delivery status updated",
      delivery: {
        ...delivery,
        status: "COMPLETED",
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

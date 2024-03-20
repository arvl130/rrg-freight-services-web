import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { shipments, shipmentLocations } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { DateTime } from "luxon"
import type { ResultSetHeader } from "mysql2"
import { ZodError, z } from "zod"

const getLocationsSchema = z.object({
  deliveryId: z.number(),
})

export async function GET(req: Request, ctx: { params: { id: string } }) {
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

    const deliveryLocationResults = await db
      .select()
      .from(shipmentLocations)
      .where(eq(shipmentLocations.shipmentId, deliveryId))

    return Response.json({
      message: "Delivery locations retrieved",
      locations: deliveryLocationResults,
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

const newLocationSchema = z.object({
  deliveryId: z.number(),
  location: z.object({
    long: z.number(),
    lat: z.number(),
  }),
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
    const { deliveryId, location } = newLocationSchema.parse({
      deliveryId: Number(ctx.params.id),
      location: {
        long: body.long,
        lat: body.lat,
      },
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

    const createdAt = DateTime.now().toISO()
    const createdById = user.id
    const [result] = (await db.insert(shipmentLocations).values({
      shipmentId: deliveryId,
      long: location.long,
      lat: location.lat,
      createdById,
      createdAt,
    })) as unknown as [ResultSetHeader]

    return Response.json({
      message: "Delivery location recorded",
      newLocation: {
        id: result.insertId,
        deliveryId,
        long: location.long,
        lat: location.lat,
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

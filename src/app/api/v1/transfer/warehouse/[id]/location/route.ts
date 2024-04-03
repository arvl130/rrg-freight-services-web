import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { shipments, shipmentLocations } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { DateTime } from "luxon"
import { ZodError, z } from "zod"

const getLocationsInputSchema = z.object({
  shipmentId: z.number(),
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

    const { shipmentId } = getLocationsInputSchema.parse({
      shipmentId: Number(ctx.params.id),
    })

    const shipmentResults = await db
      .select()
      .from(shipments)
      .where(eq(shipments.id, shipmentId))

    if (shipmentResults.length === 0) {
      return Response.json(
        { message: "No such shipment." },
        {
          status: 404,
        },
      )
    }

    if (shipmentResults.length > 1) {
      return Response.json(
        { message: "Expected 1 result, but got more." },
        {
          status: 412,
        },
      )
    }

    const shipmentLocationResults = await db
      .select()
      .from(shipmentLocations)
      .where(eq(shipmentLocations.shipmentId, shipmentId))

    return Response.json({
      message: "Shipment locations retrieved.",
      locations: shipmentLocationResults,
    })
  } catch (e) {
    if (e instanceof ZodError) {
      return Response.json(
        {
          message: "Invalid input.",
          error: e.flatten(),
        },
        {
          status: 400,
        },
      )
    } else {
      return Response.json(
        {
          message: "Unknown error occured.",
          error: e,
        },
        {
          status: 500,
        },
      )
    }
  }
}

const newLocationInputSchema = z.object({
  shipmentId: z.number(),
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
    const { shipmentId, location } = newLocationInputSchema.parse({
      shipmentId: Number(ctx.params.id),
      location: {
        long: body.long,
        lat: body.lat,
      },
    })

    const shipmentsResults = await db
      .select()
      .from(shipments)
      .where(eq(shipments.id, shipmentId))

    if (shipmentsResults.length === 0) {
      return Response.json(
        { message: "No such shipment." },
        {
          status: 404,
        },
      )
    }

    if (shipmentsResults.length > 1) {
      return Response.json(
        { message: "Expected 1 result, but got more." },
        {
          status: 412,
        },
      )
    }

    const createdAt = DateTime.now().toISO()
    const createdById = user.id
    const [{ insertId }] = await db.insert(shipmentLocations).values({
      shipmentId: shipmentId,
      long: location.long,
      lat: location.lat,
      createdAt,
      createdById,
    })

    return Response.json({
      message: "Shipment location recorded.",
      location: {
        id: insertId,
        shipmentId,
        long: location.long,
        lat: location.lat,
        createdById,
        createdAt,
      },
    })
  } catch (e) {
    if (e instanceof ZodError) {
      return Response.json(
        {
          message: "Invalid input.",
          error: e.flatten(),
        },
        {
          status: 400,
        },
      )
    } else {
      return Response.json(
        {
          message: "Unknown error occured.",
          error: e,
        },
        {
          status: 500,
        },
      )
    }
  }
}

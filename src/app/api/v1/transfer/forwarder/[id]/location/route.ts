import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { shipments, shipmentLocations } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { DateTime } from "luxon"
import type { ResultSetHeader } from "mysql2"
import { ZodError, z } from "zod"

const getLocationsSchema = z.object({
  transferShipmentId: z.number(),
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

    const { transferShipmentId } = getLocationsSchema.parse({
      transferShipmentId: Number(ctx.params.id),
    })

    const transferShipmentsResults = await db
      .select()
      .from(shipments)
      .where(eq(shipments.id, transferShipmentId))

    if (transferShipmentsResults.length === 0) {
      return Response.json(
        { message: "No such transfer shipment" },
        {
          status: 404,
        },
      )
    }

    if (transferShipmentsResults.length > 1) {
      return Response.json(
        { message: "Expected 1 result, but got more" },
        {
          status: 412,
        },
      )
    }

    const transferShipmentLocationsResults = await db
      .select()
      .from(shipmentLocations)
      .where(eq(shipmentLocations.shipmentId, transferShipmentId))

    return Response.json({
      message: "Transfer shipment locations retrieved",
      locations: transferShipmentLocationsResults,
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
  transferShipmentId: z.number(),
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
    const { transferShipmentId, location } = newLocationSchema.parse({
      transferShipmentId: Number(ctx.params.id),
      location: {
        long: body.long,
        lat: body.lat,
      },
    })

    const transferShipmentsResults = await db
      .select()
      .from(shipments)
      .where(eq(shipments.id, transferShipmentId))

    if (transferShipmentsResults.length === 0) {
      return Response.json(
        { message: "No such transfer shipment" },
        {
          status: 404,
        },
      )
    }

    if (transferShipmentsResults.length > 1) {
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
      shipmentId: transferShipmentId,
      long: location.long,
      lat: location.lat,
      createdAt,
      createdById,
    })) as unknown as [ResultSetHeader]

    return Response.json({
      message: "Transfer shipment location recorded",
      newLocation: {
        id: result.insertId,
        transferShipmentId,
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

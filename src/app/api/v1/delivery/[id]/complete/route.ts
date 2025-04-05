import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  assignedDrivers,
  assignedVehicles,
  deliveryShipments,
  shipments,
} from "@/server/db/schema"
import { eq, getTableColumns } from "drizzle-orm"
import { ZodError, z } from "zod"

const inputSchema = z.object({
  deliveryId: z.number(),
})

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
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

    const params = await ctx.params
    const { deliveryId } = inputSchema.parse({
      deliveryId: Number(params.id),
    })

    const shipmentColumns = getTableColumns(shipments)
    const { shipmentId: _, ...deliveryShipmentColumns } =
      getTableColumns(deliveryShipments)

    const deliveryResults = await db
      .select({
        ...shipmentColumns,
        ...deliveryShipmentColumns,
      })
      .from(shipments)
      .innerJoin(
        deliveryShipments,
        eq(shipments.id, deliveryShipments.shipmentId),
      )
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

    await db.transaction(async (tx) => {
      await tx
        .update(shipments)
        .set({
          status: "COMPLETED",
        })
        .where(eq(shipments.id, deliveryId))

      await tx
        .delete(assignedDrivers)
        .where(eq(assignedDrivers.driverId, delivery.driverId))

      await tx
        .delete(assignedVehicles)
        .where(eq(assignedVehicles.vehicleId, delivery.vehicleId))
    })

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

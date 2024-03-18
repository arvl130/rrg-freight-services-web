import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import { packages, shipments, shipmentPackages } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { ZodError, z } from "zod"

const getLocationsSchema = z.object({
  deliveryId: z.number(),
})

export async function GET(req: Request, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSession({ req })
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

    const shipmentPackagesResults = await db
      .select()
      .from(shipmentPackages)
      .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
      .where(eq(shipmentPackages.shipmentId, deliveryId))

    const packagesResults = shipmentPackagesResults.map(
      ({ packages }) => packages,
    )

    return Response.json({
      message: "Delivery packages retrieved",
      packages: packagesResults,
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

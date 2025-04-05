import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { packages, shipments, shipmentPackages } from "@/server/db/schema"
import { eq, getTableColumns } from "drizzle-orm"
import { ZodError, z } from "zod"

const inputSchema = z.object({
  shipmentId: z.number(),
})

export async function GET(
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
    const { shipmentId } = inputSchema.parse({
      shipmentId: Number(params.id),
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

    const packageColumns = getTableColumns(packages)
    const packageResults = await db
      .select({
        ...packageColumns,
        shipmentPackageStatus: shipmentPackages.status,
        shipmentPackageIsDriverApproved: shipmentPackages.isDriverApproved,
      })
      .from(shipmentPackages)
      .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
      .where(eq(shipmentPackages.shipmentId, shipmentId))

    return Response.json({
      message: "Shipment packages retrieved.",
      packages: packageResults,
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

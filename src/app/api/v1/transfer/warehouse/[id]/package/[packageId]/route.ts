import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { packages, shipmentPackages } from "@/server/db/schema"
import { and, eq, getTableColumns } from "drizzle-orm"
import { ZodError, z } from "zod"

const inputSchema = z.object({
  shipmentId: z.number(),
  packageId: z.string(),
})

export async function GET(
  req: Request,
  ctx: { params: { id: string; packageId: string } },
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

    const input = inputSchema.parse({
      shipmentId: Number(ctx.params.id),
      packageId: ctx.params.packageId,
    })

    const packageColumns = getTableColumns(packages)
    const packageResults = await db
      .select({
        ...packageColumns,
        shipmentPackageStatus: shipmentPackages.status,
        shipmentPackageIsDriverApproved: shipmentPackages.isDriverApproved,
      })
      .from(shipmentPackages)
      .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
      .where(
        and(
          eq(shipmentPackages.shipmentId, input.shipmentId),
          eq(shipmentPackages.packageId, input.packageId),
        ),
      )

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

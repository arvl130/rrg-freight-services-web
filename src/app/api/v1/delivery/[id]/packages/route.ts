import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import type { Package } from "@/server/db/entities"
import { packages, shipments, shipmentPackages } from "@/server/db/schema"
import { eq, getTableColumns } from "drizzle-orm"
import { ZodError, z } from "zod"
import { getDistance } from "geolib"
import { getLongitudeLatitudeWithGoogle } from "@/server/geocoding"

async function getPackagesWithDistanceFromOrigin(options: {
  packages: Package[]
  origin: {
    long: number
    lat: number
  }
}) {
  const packagesWithDistancePromises = options.packages.map(
    async (_package) => {
      const fullAddress = `${_package.receiverStreetAddress}, ${_package.receiverCity}, ${_package.receiverStateOrProvince}, ${_package.receiverCountryCode}`
      const { lat, long } = await getLongitudeLatitudeWithGoogle(fullAddress)

      return {
        ..._package,
        distance: getDistance(
          {
            longitude: options.origin.long,
            latitude: options.origin.lat,
          },
          {
            longitude: long,
            latitude: lat,
          },
        ),
      }
    },
  )

  return await Promise.all(packagesWithDistancePromises)
}

const inputSchema = z.object({
  deliveryId: z.number(),
  orderRelativeTo: z
    .object({
      lat: z.number(),
      long: z.number(),
    })
    .optional(),
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

    const { searchParams } = new URL(req.url)
    const currLat = searchParams.get("lat")
    const currLong = searchParams.get("long")
    const { deliveryId, orderRelativeTo } = inputSchema.parse({
      deliveryId: Number(ctx.params.id),
      orderRelativeTo:
        currLat !== null && currLong !== null
          ? {
              lat: Number(currLat),
              long: Number(currLong),
            }
          : undefined,
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

    const packageColumns = getTableColumns(packages)
    const packageResults = await db
      .select(packageColumns)
      .from(shipmentPackages)
      .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
      .where(eq(shipmentPackages.shipmentId, deliveryId))

    if (orderRelativeTo) {
      const packagesWithDistance = await getPackagesWithDistanceFromOrigin({
        packages: packageResults,
        origin: {
          long: orderRelativeTo.long,
          lat: orderRelativeTo.lat,
        },
      })

      const packagesSortedByDistance = packagesWithDistance.toSorted((a, b) => {
        if (a.distance > b.distance) {
          return 1
        }
        if (a.distance < b.distance) {
          return -1
        }
        return 0
      })

      return Response.json({
        message: "Delivery packages retrieved",
        packages: packagesSortedByDistance,
      })
    } else
      return Response.json({
        message: "Delivery packages retrieved",
        packages: packageResults,
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

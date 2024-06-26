import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  shipmentPackages,
  shipments,
  deliveryShipments,
  packages,
} from "@/server/db/schema"
import { serverEnv } from "@/server/env.mjs"
import { eq, and, or } from "drizzle-orm"

type Coordinates = {
  lat: number
  lon: number
}

async function getCoordinatesFromAddresses(
  addresses: string[],
): Promise<Coordinates[]> {
  const coordinatesPromises = addresses.map(async (address) => {
    const response = await fetch(
      `${serverEnv.GEOAPIFY_API_URL}${encodeURI(
        address,
      )}&limit=1&format=json&apiKey=${serverEnv.GEOAPIFY_API_KEY}`,
    )

    const { results } = await response.json()
    return { lat: results[0].lat, lon: results[0].lon }
  })

  return await Promise.all(coordinatesPromises)
}

export async function GET(req: Request) {
  const { user } = await validateSessionWithHeaders({ req })
  if (user === null) {
    return Response.json(
      { message: "Unauthorized." },
      {
        status: 401,
      },
    )
  }

  const deliveryPackageResults = await db
    .select()
    .from(shipmentPackages)
    .innerJoin(shipments, eq(shipmentPackages.shipmentId, shipments.id))
    .innerJoin(
      deliveryShipments,
      eq(shipmentPackages.shipmentId, deliveryShipments.shipmentId),
    )
    .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
    .where(and(eq(deliveryShipments.driverId, user.id)))

  try {
    const pendingPackages = deliveryPackageResults.filter(
      ({ shipment_packages: shipmentPackage }) =>
        shipmentPackage.status === "IN_TRANSIT",
    )

    const completedPackages = deliveryPackageResults.filter(
      ({ shipment_packages: shipmentPackage }) =>
        shipmentPackage.status === "COMPLETED",
    )

    const packageAddresses = pendingPackages.map(({ packages: _package }) => {
      return `${_package.receiverStreetAddress}, ${_package.receiverCity}, ${_package.receiverStateOrProvince}, Philippines`
    })

    const coordinates = await getCoordinatesFromAddresses([
      ...new Set(packageAddresses),
    ])

    return Response.json({
      total: deliveryPackageResults.length,
      completePackagesCount: completedPackages.length,
      pendingPackagesCount: pendingPackages.length,
      packageCoordinates: coordinates,
      message: "Statistics retrieved",
    })
  } catch (e) {
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

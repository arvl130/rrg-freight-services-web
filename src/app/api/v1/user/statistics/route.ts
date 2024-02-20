// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSessionFromFetchRequest } from "@/server/auth"
import { db } from "@/server/db/client"
import {
  shipmentPackages,
  shipments,
  deliveryShipments,
  packages,
} from "@/server/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET(req: Request) {
  const session = await getServerSessionFromFetchRequest({ req })
  if (session === null) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }
  const deliveryResults = await db
    .select()
    .from(shipmentPackages)
    .innerJoin(shipments, eq(shipmentPackages.shipmentId, shipments.id))
    .innerJoin(
      deliveryShipments,
      eq(shipmentPackages.shipmentId, deliveryShipments.shipmentId),
    )
    .innerJoin(packages, eq(shipmentPackages.packageId, packages.id))
    .where(
      and(
        eq(shipments.status, "IN_TRANSIT"),
        eq(shipmentPackages.status, "IN_TRANSIT"),
        eq(deliveryShipments.driverId, session.user.uid),
      ),
    )

  try {
    const pending = deliveryResults.filter((item) => {
      if (item.shipment_packages.status === "IN_TRANSIT") {
        return true
      } else {
        return false
      }
    })

    const complete = deliveryResults.filter((item) => {
      if (item.shipment_packages.status === "COMPLETED") {
        return true
      } else {
        return false
      }
    })

    const packageAddresses = deliveryResults.map((item) => {
      const addressList = item.packages
      const address =
        addressList.receiverStreetAddress +
        " " +
        addressList.receiverBarangay +
        " " +
        addressList.receiverCity +
        " " +
        addressList.receiverCountryCode

      return address
    })

    return Response.json({
      total: deliveryResults.length,
      completePackagesCount: complete.length,
      pendingPackagesCount: pending.length,
      packageAddresses: [...new Set(packageAddresses)],
      message: "Statistics retrieved",
    })
  } catch (e) {}
}

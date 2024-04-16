import { db } from "@/server/db/client"
import {
  incomingShipments,
  packages,
  shipmentPackages,
} from "@/server/db/schema"
import { Package } from "@phosphor-icons/react/dist/ssr/Package"
import { and, count, countDistinct, eq, gt, like } from "drizzle-orm"
import { unstable_noStore as noStore } from "next/cache"
import { DateTime } from "luxon"

export function SkeletonPackagesDeliveredTile() {
  return (
    <article className="text-[#29727C] grid grid-cols-[1fr_auto] shadow-md px-8 py-6 rounded-lg bg-gradient-to-b from-[#79CFDCCC] to-[#79CFDC00]">
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">...</p>
        <p>Total Delivered Packages</p>
      </div>
      <div>
        <Package
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

export async function PackagesDeliveredTile(props: { userId: string }) {
  noStore()

  const currentYear = DateTime.now().year
  const [{ value }] = await db
    .select({ value: count() })
    .from(incomingShipments)
    .innerJoin(
      shipmentPackages,
      and(
        eq(incomingShipments.shipmentId, shipmentPackages.shipmentId),
        eq(shipmentPackages.status, "COMPLETED"),
      ),
    )
    .innerJoin(
      packages,
      and(
        eq(packages.id, shipmentPackages.packageId),
        eq(packages.status, "DELIVERED"),
        like(packages.createdAt, `%${currentYear}%`),
      ),
    )
    .where(eq(incomingShipments.sentByAgentId, props.userId))

  return (
    <article className="text-[#29727C] grid grid-cols-[1fr_auto] shadow-md px-8 py-6 rounded-lg bg-gradient-to-b from-[#79CFDCCC] to-[#79CFDC40]">
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">{value}</p>
        <p>Total Delivered Packages</p>
      </div>
      <div>
        <Package
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

import { db } from "@/server/db/client"
import {
  forwarderTransferShipments,
  packages,
  shipmentPackages,
} from "@/server/db/schema"
import { Package } from "@phosphor-icons/react/dist/ssr/Package"
import { BoxArrowDown } from "@phosphor-icons/react/dist/ssr/BoxArrowDown"
import { and, count, eq, gt } from "drizzle-orm"
import { unstable_noStore as noStore } from "next/cache"
import { DateTime } from "luxon"
import { forwarderTransferShipmentRouter } from "@/server/trpc/routers/shipment/forwarder-transfer"

export function SkeletonPackagesInWarehouseTile() {
  return (
    <article className="text-[#29727C] grid grid-cols-[1fr_auto] shadow-md px-8 py-6 rounded-lg bg-gradient-to-b from-[#79CFDCCC] to-[#79CFDC00]">
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">...</p>
        <p>Total Received Packages</p>
      </div>
      <div>
        <BoxArrowDown
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

export async function PackagesInWarehouseTile(props: { userId: string }) {
  noStore()

  const [{ value }] = await db
    .select({
      value: count(),
    })
    .from(forwarderTransferShipments)
    .innerJoin(
      shipmentPackages,
      and(
        eq(forwarderTransferShipments.shipmentId, shipmentPackages.shipmentId),
        eq(shipmentPackages.status, "COMPLETED"),
      ),
    )
    .where(eq(forwarderTransferShipments.sentToAgentId, props.userId))

  return (
    <article className="text-[#29727C] grid grid-cols-[1fr_auto] shadow-md px-8 py-6 rounded-lg bg-gradient-to-b from-[#79CFDCCC] to-[#79CFDC40]">
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">{value}</p>
        <p>Total Received Packages</p>
      </div>
      <div>
        <BoxArrowDown
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

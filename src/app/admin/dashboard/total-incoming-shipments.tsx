import { db } from "@/server/db/client"
import { shipments } from "@/server/db/schema"
import { Article } from "@phosphor-icons/react/dist/ssr/Article"
import { and, count, eq } from "drizzle-orm"
import { unstable_noStore as noStore } from "next/cache"
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck"
export async function SkeletonIncomingShipmentsTile() {
  return (
    <article
      className="
        text-[#AC873C]
        grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#EDAD3E80] to-[#EDAD3E00]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">...</p>
        <p>Total Incoming Shipments</p>
      </div>
      <div>
        <Truck
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

export async function IncomingShipmentsTile() {
  noStore()
  const [{ value }] = await db
    .select({
      value: count(),
    })
    .from(shipments)
    .where(
      and(eq(shipments.status, "IN_TRANSIT"), eq(shipments.type, "INCOMING")),
    )

  return (
    <article
      className="
        text-[#AC873C]
        grid grid-cols-[1fr_auto] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#EDAD3E80] to-[#EDAD3E20]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">{value}</p>
        <p>Total Incoming Shipments</p>
      </div>
      <div>
        <Truck
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

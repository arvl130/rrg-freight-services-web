import { db } from "@/server/db/client"
import { incomingShipments } from "@/server/db/schema"

import { and, count, eq, like } from "drizzle-orm"
import { unstable_noStore as noStore } from "next/cache"

import { Boat } from "@phosphor-icons/react/dist/ssr/Boat"
import { DateTime } from "luxon"
export async function SkeletonSentShipmentsTile() {
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
        <p>Total Sent Shipments</p>
      </div>
      <div>
        <Boat
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

export async function SentShipmentsTile(props: { userId: string }) {
  noStore()
  const currentYear = DateTime.now().year
  const [{ value }] = await db
    .select({
      value: count(),
    })
    .from(incomingShipments)
    .where(
      and(
        eq(incomingShipments.sentByAgentId, props.userId),
        like(incomingShipments.createdAt, `%${currentYear}%`),
      ),
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
        <p>Total Sent Shipments</p>
      </div>
      <div>
        <Boat
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

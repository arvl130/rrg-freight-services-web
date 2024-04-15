import { db } from "@/server/db/client"
import { packages } from "@/server/db/schema"
import { and, count, eq, lt } from "drizzle-orm"
import { unstable_noStore as noStore } from "next/cache"
import { CalendarX } from "@phosphor-icons/react/dist/ssr/CalendarX"
import { DateTime } from "luxon"
export function SkeletonDelayPackagesTile() {
  return (
    <article
      className="
        text-[#C61717]
        grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#ED5959CC] to-[#ED595900]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">...</p>
        <p>Total Delay Packages</p>
      </div>
      <div>
        <CalendarX
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

export async function DelayPackagesTile() {
  noStore()
  const today = DateTime.now()
  const [{ value }] = await db
    .select({
      value: count(),
    })
    .from(packages)
    .where(
      and(
        eq(packages.status, "IN_WAREHOUSE"),
        lt(packages.expectedHasDeliveryAt, today.toISO()),
      ),
    )

  return (
    <article
      className="
        text-[#C61717]
        grid grid-cols-[1fr_auto] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#ED5959CC] to-[#ED595940]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">{value}</p>
        <p>Total Delay Packages</p>
      </div>
      <div>
        <CalendarX
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

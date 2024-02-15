import { db } from "@/server/db/client"
import { shipments } from "@/server/db/schema"
import { Article } from "@phosphor-icons/react/dist/ssr/Article"
import { count, eq } from "drizzle-orm"
import { unstable_noStore as noStore } from "next/cache"

export async function SkeletonManifestsShippedTile() {
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
        <p>Shipments shipped</p>
      </div>
      <div>
        <Article size={96} />
      </div>
    </article>
  )
}

export async function ManifestsShippedTile() {
  noStore()
  const [{ value }] = await db
    .select({
      value: count(),
    })
    .from(shipments)
    .where(eq(shipments.status, "COMPLETED"))

  return (
    <article
      className="
        text-[#AC873C]
        grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#EDAD3E80] to-[#EDAD3E00]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">{value}</p>
        <p>Shipments shipped</p>
      </div>
      <div>
        <Article size={96} />
      </div>
    </article>
  )
}

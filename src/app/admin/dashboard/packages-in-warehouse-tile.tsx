import { db } from "@/server/db/client"
import { packages } from "@/server/db/schema"
import { Package } from "@phosphor-icons/react/dist/ssr/Package"
import { count, eq } from "drizzle-orm"
import { unstable_noStore as noStore } from "next/cache"

export function SkeletonPackagesInWarehouseTile() {
  return (
    <article className="text-[#29727C] grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg bg-gradient-to-b from-[#79CFDCCC] to-[#79CFDC00]">
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">...</p>
        <p>Packages in-warehouse</p>
      </div>
      <div>
        <Package size={96} />
      </div>
    </article>
  )
}

export async function PackagesInWarehouseTile() {
  noStore()
  const [{ value }] = await db
    .select({
      value: count(),
    })
    .from(packages)
    .where(eq(packages.status, "IN_WAREHOUSE"))

  return (
    <article className="text-[#29727C] grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg bg-gradient-to-b from-[#79CFDCCC] to-[#79CFDC00]">
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">{value}</p>
        <p>Packages in-warehouse</p>
      </div>
      <div>
        <Package size={96} />
      </div>
    </article>
  )
}

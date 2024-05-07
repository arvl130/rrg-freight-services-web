import { db } from "@/server/db/client"
import { shipments, uploadedManifests } from "@/server/db/schema"
import { Article } from "@phosphor-icons/react/dist/ssr/Article"
import { and, count, eq } from "drizzle-orm"
import { unstable_noStore as noStore } from "next/cache"
import { Files } from "@phosphor-icons/react/dist/ssr/Files"
export async function SkeletonManifestReviewTile() {
  return (
    <article
      className="
      text-[#4fac3c]
      grid grid-cols-[1fr_auto] shadow-md px-8 py-6 rounded-lg
      bg-gradient-to-b from-[#3eed3e80] to-[#61ed3e20]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">...</p>
        <p>Manifests To Review</p>
      </div>
      <div>
        <Files
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

export async function ManifestReviewTile() {
  noStore()
  const [{ value }] = await db
    .select({
      value: count(),
    })
    .from(uploadedManifests)
    .where(eq(uploadedManifests.status, "PENDING_REVIEW"))

  return (
    <article
      className="
        text-[#4fac3c]
        grid grid-cols-[1fr_auto] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#3eed3e80] to-[#61ed3e20]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">{value}</p>
        <p>Manifests To Review</p>
      </div>
      <div>
        <Files
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

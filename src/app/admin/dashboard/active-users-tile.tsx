import { db } from "@/server/db/client"
import { users } from "@/server/db/schema"
import { UsersThree } from "@phosphor-icons/react/dist/ssr/UsersThree"
import { count, eq } from "drizzle-orm"
import { unstable_noStore as noStore } from "next/cache"

export function SkeletonActiveUsersTile() {
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
        <p>Active users</p>
      </div>
      <div>
        <UsersThree
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

export async function ActiveUsersTile() {
  noStore()
  const [{ value }] = await db
    .select({
      value: count(),
    })
    .from(users)
    .where(eq(users.isEnabled, 1))

  return (
    <article
      className="
        text-[#C61717]
        grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#ED5959CC] to-[#ED595900]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">{value}</p>
        <p>Active users</p>
      </div>
      <div>
        <UsersThree
          className="h-16 sm:h-24 aspect-square"
          width="auto"
          height="auto"
        />
      </div>
    </article>
  )
}

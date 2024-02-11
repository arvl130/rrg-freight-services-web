"use client"

import { api } from "@/utils/api"
import { UsersThree } from "@phosphor-icons/react/UsersThree"

export function ActiveUsersTile() {
  const { status, data } = api.user.getTotalActiveUsers.useQuery()

  return (
    <article
      className="
        text-[#C61717]
        grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#ED5959CC] to-[#ED595900]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">
          {status === "loading" && <>...</>}
          {status === "error" && <>error</>}
          {status === "success" && <>{data.count}</>}
        </p>
        <p>Active users</p>
      </div>
      <div>
        <UsersThree size={96} />
      </div>
    </article>
  )
}

"use client"

import { api } from "@/utils/api"
import { Article } from "@phosphor-icons/react/Article"

export function ManifestsShippedTile() {
  const { status, data } =
    api.shipment.package.getTotalShipmentShipped.useQuery()

  return (
    <article
      className="
        text-[#AC873C]
        grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#EDAD3E80] to-[#EDAD3E00]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">
          {status === "loading" && <>...</>}
          {status === "error" && <>error</>}
          {status === "success" && <>{data.count}</>}
        </p>
        <p>Shipments shipped</p>
      </div>
      <div>
        <Article size={96} />
      </div>
    </article>
  )
}

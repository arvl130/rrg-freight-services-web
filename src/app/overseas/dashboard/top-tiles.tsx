"use client"

import { Article } from "@phosphor-icons/react/dist/ssr/Article"
import { Package } from "@phosphor-icons/react/dist/ssr/Package"
import { api } from "@/utils/api"

export function TotalRushPackageTile() {
  const { status, data } =
    api.package.getTotalIncomingRushPackageSentByAgentId.useQuery()

  return (
    <article className="text-[#29727C] grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg bg-gradient-to-b from-[#79CFDCCC] to-[#79CFDC00]">
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">
          {status === "loading" && <>...</>}
          {status === "error" && <>error</>}
          {status === "success" && <>{data.count}</>}
        </p>
        <p>Total Rush Package</p>
      </div>
      <div>
        <Package size={96} />
      </div>
    </article>
  )
}

export function TotalPackageTile() {
  const { status, data } =
    api.package.getTotalIncomingPackagesSentByAgentId.useQuery()

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
        <p>Total Package</p>
      </div>
      <div>
        <Package size={96} />
      </div>
    </article>
  )
}

export function TotalUnsendShipmentTile() {
  const { status, data } =
    api.shipment.incoming.getTotalInTransitSentByAgentId.useQuery()

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
        <p>Total Unsend Shipment</p>
      </div>
      <div>
        <Article size={96} />
      </div>
    </article>
  )
}

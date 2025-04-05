"use client"

import { Article } from "@phosphor-icons/react/Article"
import { Package } from "@phosphor-icons/react/Package"
import { api } from "@/utils/api"

export function PendingShipmentsTile() {
  const { status, data } =
    api.shipment.delivery.getTotalPreparingAssignedToDriverId.useQuery()

  return (
    <article className="text-[#29727C] grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg bg-gradient-to-b from-[#79CFDCCC] to-[#79CFDC00]">
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">
          {status === "pending" && <>...</>}
          {status === "error" && <>error</>}
          {status === "success" && <>{data.count}</>}
        </p>
        <p>Pending Shipments</p>
      </div>
      <div>
        <Package size={96} />
      </div>
    </article>
  )
}

export function InTransitShipmentsTile() {
  const { status, data } =
    api.shipment.delivery.getTotalInTransitAssignedToDriverId.useQuery()

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
          {status === "pending" && <>...</>}
          {status === "error" && <>error</>}
          {status === "success" && <>{data.count}</>}
        </p>
        <p>In Transit Shipments</p>
      </div>
      <div>
        <Package size={96} />
      </div>
    </article>
  )
}

export function CompletedShipmentsTile() {
  const { status, data } =
    api.shipment.delivery.getTotalCompletedAssignedToDriverId.useQuery()

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
          {status === "pending" && <>...</>}
          {status === "error" && <>error</>}
          {status === "success" && <>{data.count}</>}
        </p>
        <p>Completed Shipments</p>
      </div>
      <div>
        <Article size={96} />
      </div>
    </article>
  )
}

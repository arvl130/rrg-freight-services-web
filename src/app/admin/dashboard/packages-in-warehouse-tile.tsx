"use client"

import { api } from "@/app/api"
import { Package } from "@phosphor-icons/react/Package"

export function PackagesInWarehouseTile() {
  const { status, data } = api.package.getTotalPackageInWarehouse.useQuery()

  return (
    <article
      className="
        text-[#29727C]
        grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#79CFDCCC] to-[#79CFDC00]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <>
          <p className="text-4xl font-semibold">
            {status === "loading" && <>...</>}
            {status === "error" && <>error</>}
            {status === "success" && <>{data.count}</>}
          </p>
          <p>Packages in-warehouse</p>
        </>
      </div>
      <div>
        <Package size={96} />
      </div>
    </article>
  )
}

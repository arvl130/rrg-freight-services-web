import { useState } from "react"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass"
import type { Package, Vehicle } from "@/server/db/entities"
import type { PackageShippingType } from "@/utils/constants"
import { getHumanizedOfPackageShippingType } from "@/utils/humanize"
import { api } from "@/utils/api"
import { SortAscending } from "@phosphor-icons/react/dist/ssr/SortAscending"
import { SortDescending } from "@phosphor-icons/react/dist/ssr/SortDescending"
import { XCircle } from "@phosphor-icons/react/dist/ssr/XCircle"
import { DateTime } from "luxon"

function PackagesTableItem({
  selectedPackageIds,
  package: _package,
  onCheckboxChange,
}: {
  selectedPackageIds: string[]
  package: Package
  onCheckboxChange: (isChecked: boolean) => void
}) {
  const isSelected = selectedPackageIds.includes(_package.id)

  return (
    <button
      className="grid grid-cols-subgrid col-span-7 border-b border-gray-300 hover:bg-gray-50 transition-colors text-sm text-justify"
      onClick={() => {
        if (isSelected) onCheckboxChange(false)
        else onCheckboxChange(true)
      }}
    >
      <div className="py-2 pl-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onCheckboxChange(e.currentTarget.checked)}
        />
      </div>
      <div className="py-2 px-3 gap-1 whitespace-nowrap">{_package.id}</div>
      <div className="py-2 px-3">
        <p>{_package.senderFullName}</p>
        <p className="text-gray-500 text-sm">{_package.senderContactNumber}</p>
      </div>
      <div className="py-2 px-3">
        <p>{_package.receiverFullName}</p>
        <p className="text-gray-500 text-sm">
          {_package.receiverContactNumber}
        </p>
      </div>
      <div className="py-2 px-3">{_package.weightInKg} KG</div>
      <div className="py-2 px-3">
        <p className="text-gray-500 text-sm">
          {_package.receiverStreetAddress}, Brgy. {_package.receiverBarangay},
        </p>
        <p className="text-gray-500 text-sm">
          {_package.receiverCity}, {_package.receiverStateOrProvince}
        </p>
        <p className="text-gray-500 text-sm">
          {_package.receiverCountryCode}, {_package.receiverPostalCode}
        </p>
      </div>
    </button>
  )
}

function filterBySearchTerm(items: Package[], searchTerm: string) {
  return items.filter((_package) =>
    _package.id.toString().toLowerCase().includes(searchTerm.toLowerCase()),
  )
}

export function ChoosePackageTable({
  hasExceededWeightLimit,
  totalWeightOfSelectedPackages,
  selectedPackageIds,
  selectedVehicle,
  onAutoSelect,
  onCheckboxChange,
  onResetSelection,
}: {
  hasExceededWeightLimit: boolean
  totalWeightOfSelectedPackages: number
  selectedPackageIds: string[]
  selectedVehicle: Vehicle | null
  onAutoSelect: (packages: Package[]) => void
  onCheckboxChange: (props: { isChecked: boolean; package: Package }) => void
  onResetSelection: () => void
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC")

  const {
    refetch,
    status,
    data: packages,
  } = api.package.getInWarehouseAndCanBeForwarderTransferred.useQuery({
    sortOrder,
    searchTerm,
  })

  return (
    <div className="grid grid-rows-[auto_1fr_auto]">
      <div className="mb-3">
        <div className="grid grid-cols-[1fr_auto]">
          <div className="flex justify-between items-center font-medium text-gray-700">
            <div>
              <p>Showing Transferrable Packages</p>
            </div>
            <button
              type="button"
              className="inline-flex text-sm items-center"
              onClick={() => {
                setSortOrder((currSortOrder) =>
                  currSortOrder === "DESC" ? "ASC" : "DESC",
                )
                onResetSelection()
              }}
            >
              {sortOrder === "DESC" ? (
                <>
                  <SortDescending size={24} />
                  <span className="ml-0.5">DSC</span>
                </>
              ) : (
                <>
                  <SortAscending size={24} />
                  <span className="ml-0.5">ASC</span>
                </>
              )}
            </button>
          </div>
          <div className="flex justify-end">
            <div className="flex-col grid grid-cols-[1fr_2.25rem] h-[2.375rem] ml-2">
              <input
                type="text"
                className="rounded-l-lg px-3 border-l border-y border-brand-cyan-500 py-1.5 text-sm"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.currentTarget.value)
                  onResetSelection()
                }}
              />
              <button
                type="button"
                className="text-white bg-brand-cyan-500 flex justify-center items-center rounded-r-lg border-r border-y border-brand-cyan-500"
              >
                <MagnifyingGlass size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {status === "loading" && (
        <article className="bg-white rounded-lg px-6 py-3 text-center flex justify-center items-center">
          Loading ...
        </article>
      )}

      {status === "error" && (
        <article className="bg-white rounded-lg px-6 py-3 text-center flex flex-col justify-center items-center">
          <p className="mb-1">An error occured :(</p>
          <button
            type="button"
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </article>
      )}

      {status === "success" && (
        <article className="border border-gray-200 bg-white rounded-t-lg overflow-auto text-sm grid grid-cols-[repeat(5,_auto)_18rem] auto-rows-min">
          <div className="font-bold bg-gray-100 pl-3 py-2"></div>
          <div className="font-bold bg-gray-100 px-3 py-2 flex items-center gap-1">
            Tracking Number
          </div>
          <div className="font-bold bg-gray-100 px-3 py-2">Shipper</div>
          <div className="font-bold bg-gray-100 px-3 py-2">Consignee</div>
          <div className="font-bold bg-gray-100 px-3 py-2">Weight</div>
          <div className="font-bold bg-gray-100 px-3 py-2">Address</div>
          {filterBySearchTerm(packages, searchTerm).length === 0 ? (
            <p className="text-center col-span-7 py-3">No packages available</p>
          ) : (
            <>
              {filterBySearchTerm(packages, searchTerm).map((_package) => (
                <PackagesTableItem
                  key={_package.id}
                  selectedPackageIds={selectedPackageIds}
                  package={_package}
                  onCheckboxChange={(isChecked) => {
                    onCheckboxChange({
                      isChecked,
                      package: _package,
                    })
                  }}
                />
              ))}
            </>
          )}
        </article>
      )}
      <div className="mt-3 grid grid-cols-2">
        <div>
          {status === "success" && packages.length > 0 && (
            <button
              type="button"
              className="font-medium bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 transition-colors text-white px-4 py-2 rounded-md"
              onClick={() => {
                if (status === "success") onAutoSelect(packages)
              }}
            >
              Auto-select Packages
            </button>
          )}
        </div>
        <div>
          <p className="text-right">
            Vehicle&apos;s Weight Limit:{" "}
            {selectedVehicle === null ? (
              "N/A"
            ) : (
              <span className={hasExceededWeightLimit ? "text-red-500" : ""}>
                {selectedVehicle.weightCapacityInKg} KG
              </span>
            )}
          </p>
          <div
            className={`text-right ${
              hasExceededWeightLimit ? "font-semibold" : ""
            }`}
          >
            {hasExceededWeightLimit ? (
              <p>Total Weight of Selected Packages: </p>
            ) : (
              <span>Total Weight of Selected Packages: </span>
            )}
            <span
              className={`inline-flex ${
                hasExceededWeightLimit ? "text-red-500" : ""
              }`}
            >
              {hasExceededWeightLimit && (
                <XCircle
                  size={24}
                  weight="fill"
                  className="text-red-500 mr-1"
                />
              )}
              {totalWeightOfSelectedPackages} KG{" "}
              {hasExceededWeightLimit && selectedVehicle != null && (
                <>
                  (exceeded capacity by{" "}
                  {totalWeightOfSelectedPackages -
                    selectedVehicle.weightCapacityInKg}{" "}
                  KG)
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

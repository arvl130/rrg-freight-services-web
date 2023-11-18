import React from "react"
import { useEffect } from "react"
import { WarehouseLayout } from "@/layouts/warehouse"
import { useSession } from "@/utils/auth"
import { Plus } from "@phosphor-icons/react/Plus"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple"
import { Export } from "@phosphor-icons/react/Export"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { ArrowsDownUp } from "@phosphor-icons/react/ArrowsDownUp"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import { Package } from "@/server/db/entities"
import { getColorFromPackageStatus } from "@/utils/colors"
import { api } from "@/utils/api"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { PackagesViewWaybillModal } from "@/components/packages/view-waybill-modal"
import { PackagesViewDetailsModal } from "@/components/packages/view-details-modal"

function PackageStatus({ packageId }: { packageId: number }) {
  const {
    isLoading,
    isError,
    data: packageStatusLog,
  } = api.package.getLatestStatus.useQuery({
    id: packageId,
  })

  if (isLoading)
    return (
      <div
        className="
  w-36 py-0.5 text-white text-center rounded-md
  "
      >
        ...
      </div>
    )

  if (isError)
    return (
      <div
        className="
  w-36 py-0.5 text-white text-center rounded-md
  "
      >
        error
      </div>
    )

  if (packageStatusLog === null)
    return (
      <div
        className="
  w-36 py-0.5 text-white text-center rounded-md
  "
      >
        n/a
      </div>
    )

  return (
    <div
      style={{ fontSize: "12px" }}
      className={`w-36 py-0.5 text-white text-center rounded-md
    ${getColorFromPackageStatus(packageStatusLog.status)}
  `}
    >
      {packageStatusLog.status.replaceAll("_", " ")}
    </div>
  )
}

function SearchBar() {
  return (
    <div className="flex justify-between gap-3 bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 mb-6">
      <div className="grid grid-cols-[1fr_2.25rem] h-[2.375rem]">
        <input
          type="text"
          className="rounded-l-lg px-3 border-l border-y border-brand-cyan-500 py-1.5 text-sm"
          placeholder="Quick search"
        />
        <button
          type="button"
          className="text-white bg-brand-cyan-500 flex justify-center items-center rounded-r-lg border-r border-y border-brand-cyan-500"
        >
          <span className="sr-only">Search</span>
          <MagnifyingGlass size={16} />
        </button>
      </div>
      <div className="flex gap-3 text-sm">
        <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
          <option value="">Status</option>
        </select>
        <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
          <option value="">Warehouse</option>
        </select>
        <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
          <option value="">City</option>
        </select>
        <button
          type="button"
          className="bg-white border border-gray-300 px-3 py-1.5 rounded-md text-gray-400 font-medium"
        >
          Clear Filter
        </button>
      </div>
      <div className="flex gap-3 text-sm">
        <button
          type="button"
          className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium"
        >
          <DownloadSimple size={16} />
          <span>Import</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium"
        >
          <Export size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>
  )
}

function RecentActivityTile({ packages }: { packages: Package[] }) {
  const [selectedTab, setSelectedTab] = useState<"ALL" | "ARCHIVED">("ALL")
  const allPackages = packages.filter((_package) => _package.isArchived === 0)
  const archivedPackages = packages.filter(
    (_package) => _package.isArchived === 1,
  )
  return (
    <div className="bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 min-h-[36rem]">
      <div className="flex justify-between mb-3">
        <div className="flex gap-6">
          <button
            type="button"
            className={`
              text-lg pb-1 font-semibold border-b-2
              ${
                selectedTab === "ALL"
                  ? "text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
            onClick={() => setSelectedTab("ALL")}
          >
            All Packages
          </button>
          <button
            type="button"
            className={`
              text-lg pb-1 font-semibold border-b-2
              ${
                selectedTab === "ARCHIVED"
                  ? "text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
            onClick={() => setSelectedTab("ARCHIVED")}
          >
            Archived Packages
          </button>
        </div>
        <div className="flex gap-8">
          <div>
            Showing{" "}
            <select className="bg-white border border-gray-300 px-2 py-1 w-16">
              <option>All</option>
            </select>{" "}
            entries
          </div>
          <div className="flex items-center gap-3 text-sm">
            <CaretLeft size={16} />
            <CaretDoubleLeft size={16} />
            <button
              type="button"
              className="bg-brand-cyan-500 text-white w-6 h-6 rounded-md"
            >
              1
            </button>
            <button type="button" className="text-gray-400">
              2
            </button>
            <button type="button" className="text-gray-400">
              3
            </button>
            <button type="button" className="text-gray-400">
              4
            </button>
            <span className="text-gray-400">...</span>
            <button type="button" className="text-gray-400">
              10
            </button>
            <CaretRight size={16} />
            <CaretDoubleRight size={16} />
          </div>
        </div>
      </div>
      {/* Table */}
      <table className="min-w-full	text-left">
        {/* Header */}
        <thead
          className="uppercase"
          style={{ fontSize: "15px", borderBottom: "1px solid #C9C1C1" }}
        >
          <tr>
            <th>
              <input type="checkbox"></input>&nbsp; Product Id{" "}
              <button>
                <ArrowsDownUp size={15} />
              </button>
            </th>
            <th>Sender</th>
            <th>Reciever</th>
            <th>
              Status{" "}
              <button>
                <ArrowsDownUp size={15} />
              </button>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        {/* Body */}
        {selectedTab === "ALL" ? (
          <>
            {allPackages.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-3">
                  No Package Found
                </td>
              </tr>
            ) : (
              <>
                {allPackages.map((_package) => (
                  <TableItem key={_package.id} package={_package} />
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {archivedPackages.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-3">
                  No Package Found
                </td>
              </tr>
            ) : (
              <>
                {archivedPackages.map((_package) => (
                  <TableItem key={_package.id} package={_package} />
                ))}
              </>
            )}
          </>
        )}
      </table>
    </div>
  )
}
function TableItem({ package: _package }: { package: Package }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "VIEW_WAYBILL"
  >(null)

  return (
    <tbody>
      <tr
        className=""
        style={{ height: "50px", borderBottom: "1px solid #C9C1C1" }}
      >
        <td>
          <input type="checkbox"></input>&nbsp;
          <span>{_package.id}</span>
        </td>
        <td>
          <h2 className="font-bold	">{_package.senderFullName}</h2>
          <div style={{ fontSize: "11px" }} className="">
            {_package.senderStreetAddress}
            <p>{_package.senderCity}</p>
            <p>
              {_package.senderStateOrProvince} {_package.senderPostalCode}{" "}
              {_package.senderCountryCode}
            </p>
          </div>
        </td>
        <td>
          <h2 className="font-bold	">{_package.receiverFullName}</h2>
          <div style={{ fontSize: "11px" }} className="">
            <p>{_package.receiverStreetAddress}</p>
            <p>
              Brgy. {_package.receiverBarangay}, {_package.receiverCity}
            </p>
            <p>
              {_package.receiverStateOrProvince} {_package.receiverPostalCode}{" "}
              {_package.receiverCountryCode}
            </p>
          </div>
        </td>
        <td>
          <PackageStatus packageId={_package.id} />
        </td>
        <td>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button type="button">
                <span className="sr-only">Actions</span>
                <DotsThree size={16} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white rounded-lg drop-shadow-lg text-sm">
                <DropdownMenu.Item
                  className="transition-colors hover:bg-sky-50 px-3 py-2"
                  onClick={() => setVisibleModal("VIEW_DETAILS")}
                >
                  View Details
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="transition-colors hover:bg-sky-50 px-3 py-2"
                  onClick={() => setVisibleModal("VIEW_WAYBILL")}
                >
                  View Waybill
                </DropdownMenu.Item>

                <DropdownMenu.Arrow className="fill-white" />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <PackagesViewDetailsModal
            package={_package}
            isOpen={visibleModal === "VIEW_DETAILS"}
            close={() => setVisibleModal(null)}
          />
          <PackagesViewWaybillModal
            package={_package}
            isOpen={visibleModal === "VIEW_WAYBILL"}
            close={() => setVisibleModal(null)}
          />
        </td>
      </tr>
    </tbody>
  )
}

export default function PackageList() {
  const { user, role } = useSession()
  const {
    isLoading,
    isError,
    data: packages,
  } = api.package.getAll.useQuery(undefined, {
    enabled: user !== null && role === "WAREHOUSE",
  })
  return (
    <>
      <WarehouseLayout title="Dashboard">
        <div className="flex	justify-between	my-4">
          <h1 className="text-3xl font-black [color:_#00203F] mb-4">
            Packages
          </h1>
        </div>
        <SearchBar />

        <section className="mb-6"></section>

        <section className="grid grid-cols-1 gap-x-11 [color:_#404040] mb-6">
          {isLoading ? (
            <div className="flex justify-center pt-4">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {isError ? (
                <>Error :{"("}</>
              ) : (
                <>
                  <RecentActivityTile packages={packages} />
                </>
              )}
            </>
          )}
        </section>
      </WarehouseLayout>
    </>
  )
}

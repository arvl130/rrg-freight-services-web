"use client"

import { WarehouseLayout } from "@/app/warehouse/auth"
import { useSession } from "@/hooks/session"
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree"
import type { Package } from "@/server/db/entities"
import { api } from "@/utils/api"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Table from "@/components/table"
import * as Page from "@/components/page"
import { ViewWaybillModal } from "@/components/packages/view-waybill-modal"
import { ViewDetailsModal } from "@/components/packages/view-details-modal"
import type { PackageShippingType } from "@/utils/constants"
import { usePaginatedItems } from "@/hooks/paginated-items"
import { getColorFromPackageStatus } from "@/utils/colors"
import { supportedPackageStatusToHumanized } from "@/utils/humanize"

function TableItem({ package: _package }: { package: Package }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "VIEW_WAYBILL"
  >(null)

  return (
    <>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {_package.id}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <div>{_package.senderFullName}</div>
        <div className="text-gray-400">
          <p>{_package.senderStreetAddress}</p>
          <p>{_package.senderCity}</p>
          <p>
            {_package.senderStateOrProvince} {_package.senderPostalCode}{" "}
            {_package.senderCountryCode}
          </p>
        </div>
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <div>{_package.receiverFullName}</div>
        <div className="text-gray-400">
          <p>{_package.receiverStreetAddress}</p>
          <p>
            Brgy. {_package.receiverBarangay}, {_package.receiverCity}
          </p>
          <p>
            {_package.receiverStateOrProvince} {_package.receiverPostalCode}{" "}
            {_package.receiverCountryCode}
          </p>
        </div>
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <div
          className={`
            w-36 py-0.5 text-white text-center rounded-md
            ${getColorFromPackageStatus(_package.status)}
          `}
        >
          {supportedPackageStatusToHumanized(_package.status)}
        </div>
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
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

        <ViewDetailsModal
          package={_package}
          isOpen={visibleModal === "VIEW_DETAILS"}
          close={() => setVisibleModal(null)}
        />
        <ViewWaybillModal
          package={_package}
          isOpen={visibleModal === "VIEW_WAYBILL"}
          close={() => setVisibleModal(null)}
        />
      </div>
    </>
  )
}

function filterBySearchTerm(items: Package[], searchTerm: string) {
  return items.filter((_package) =>
    _package.id.toString().toLowerCase().includes(searchTerm),
  )
}

function filterBySelectedTab(
  items: Package[],
  selectedTab: PackageShippingType | "ALL",
) {
  if (selectedTab === "ALL") return items

  return items.filter((_package) => _package.shippingType === selectedTab)
}

function filterByArchiveStatus(items: Package[], isArchived: boolean) {
  if (isArchived) return items.filter((_package) => _package.isArchived === 1)

  return items.filter((_package) => _package.isArchived === 0)
}

function PackagesTable({ packages }: { packages: Package[] }) {
  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

  const [selectedTab, setSelectedTab] = useState<
    "EXPRESS" | "STANDARD" | "ALL"
  >("EXPRESS")

  const [searchTerm, setSearchTerm] = useState("")
  const visiblePackages = filterBySearchTerm(
    filterBySelectedTab(
      filterByArchiveStatus(packages, visibleArchiveStatus === "ARCHIVED"),
      selectedTab,
    ),
    searchTerm,
  )

  const {
    pageNumber,
    pageSize,
    pageCount,
    isOnFirstPage,
    isOnLastPage,
    paginatedItems,
    updatePageSize,
    resetPageNumber,
    gotoFirstPage,
    gotoLastPage,
    gotoPage,
    gotoNextPage,
    gotoPreviousPage,
  } = usePaginatedItems({
    items: visiblePackages,
  })

  return (
    <>
      <Table.Filters>
        <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3">
          <div>
            <Table.SearchForm
              updateSearchTerm={(searchTerm) => setSearchTerm(searchTerm)}
              resetPageNumber={resetPageNumber}
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-[repeat(3,_minmax(0,_1fr))_auto] gap-3 text-sm">
            <select className="bg-white border border-gray-300 px-2 py-1.5 w-full sm:w-32 h-[2.375rem] rounded-md text-gray-400 font-medium">
              <option>Status</option>
            </select>
            <select className="bg-white border border-gray-300 px-2 py-1.5 w-full sm:w-32 h-[2.375rem] rounded-md text-gray-400 font-medium">
              <option>Warehouse</option>
            </select>
            <select
              className="bg-white border border-gray-300 px-2 py-1.5 w-full sm:w-32 h-[2.375rem] rounded-md text-gray-400 font-medium"
              value={visibleArchiveStatus}
              onChange={(e) => {
                if (e.currentTarget.value === "ARCHIVED")
                  setVisibleArchiveStatus("ARCHIVED")
                else setVisibleArchiveStatus("NOT_ARCHIVED")
              }}
            >
              <option value="NOT_ARCHIVED">Not Archived</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <button
              type="button"
              className="bg-white border border-gray-300 px-3 py-1.5 w-full sm:w-auto rounded-md text-gray-400 font-medium"
            >
              Clear Filter
            </button>
          </div>
          <div className="flex items-start justify-end">
            <Table.ExportButton records={paginatedItems} />
          </div>
        </div>
      </Table.Filters>
      <Table.Content>
        <div className="flex flex-wrap gap-3 justify-between mb-3">
          <div className="flex gap-3">
            <button
              type="button"
              className={`
              text-lg pb-1 font-semibold border-b-2
              ${
                selectedTab === "EXPRESS"
                  ? "text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
              onClick={() => setSelectedTab("EXPRESS")}
            >
              Express
            </button>
            <button
              type="button"
              className={`
              text-lg pb-1 font-semibold border-b-2
              ${
                selectedTab === "STANDARD"
                  ? "text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
              onClick={() => setSelectedTab("STANDARD")}
            >
              Standard
            </button>
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
              All
            </button>
          </div>
          <Table.Pagination
            pageNumber={pageNumber}
            pageSize={pageSize}
            pageCount={pageCount}
            isOnFirstPage={isOnFirstPage}
            isOnLastPage={isOnLastPage}
            updatePageSize={updatePageSize}
            gotoFirstPage={gotoFirstPage}
            gotoLastPage={gotoLastPage}
            gotoPage={gotoPage}
            gotoNextPage={gotoNextPage}
            gotoPreviousPage={gotoPreviousPage}
          />
        </div>
        <div className="grid grid-cols-[repeat(4,_auto)_1fr] auto-rows-min overflow-auto">
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Package ID
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Sender
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Receiver
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Status
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Actions
          </div>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4 col-span-5">
              No packages found.
            </div>
          ) : (
            <>
              {paginatedItems.map((_package) => (
                <TableItem key={_package.id} package={_package} />
              ))}
            </>
          )}
        </div>
      </Table.Content>
    </>
  )
}

export default function PackagesPage() {
  const { user, role } = useSession()
  const {
    status,
    data: packages,
    error,
  } = api.package.getAll.useQuery(undefined, {
    enabled: user !== null && role === "WAREHOUSE",
  })

  return (
    <WarehouseLayout title="Packages">
      <Page.Header>
        <h1 className="text-2xl font-black [color:_#00203F] mb-2">Packages</h1>
      </Page.Header>
      {status === "loading" && (
        <div className="flex justify-center pt-4">
          <LoadingSpinner />
        </div>
      )}
      {status === "error" && (
        <div className="flex justify-center pt-4">
          An error occured: {error.message}
        </div>
      )}
      {status === "success" && <PackagesTable packages={packages} />}
    </WarehouseLayout>
  )
}

"use client"

import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree"
import type { Package, Warehouse } from "@/server/db/entities"
import { api } from "@/utils/api"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Table from "@/components/table"
import { ViewWaybillModal } from "@/components/packages/view-waybill-modal"
import { ViewDetailsModal } from "@/components/packages/view-details-modal"
import { EditDetailsModal } from "./edit-details-modal"
import {
  SUPPORTED_PACKAGE_STATUSES,
  type PackageShippingType,
  type PackageStatus,
} from "@/utils/constants"
import { usePaginatedItems } from "@/hooks/paginated-items"
import { getColorFromPackageStatus } from "@/utils/colors"
import { getHumanizedOfPackageStatus } from "@/utils/humanize"

function WarehouseDetails(props: { warehouseId: number }) {
  const { status, data, error } = api.warehouse.getById.useQuery({
    id: props.warehouseId,
  })

  if (status === "loading") return <>...</>
  if (status === "error") return <>Error: {error.message}</>

  return <>{data.displayName}</>
}

function TableItem({ package: _package }: { package: Package }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "EDIT_DETAILS" | "VIEW_WAYBILL"
  >(null)

  return (
    <>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {_package.id}
        </p>
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
      <div className="px-4 py-2 border-b border-gray-300 text-sm text-center">
        {_package.lastWarehouseId === null ? (
          "Not Received Yet"
        ) : (
          <WarehouseDetails warehouseId={_package.lastWarehouseId} />
        )}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <div
          className={`
            w-36 py-0.5 text-white text-center rounded-md
            ${getColorFromPackageStatus(_package.status)}
          `}
        >
          {getHumanizedOfPackageStatus(_package.status)}
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
                className="transition-colors rounded-t-lg hover:bg-sky-50 px-3 py-2"
                onClick={() => setVisibleModal("VIEW_DETAILS")}
              >
                View Details
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="transition-colors hover:bg-sky-50 px-3 py-2"
                onClick={() => setVisibleModal("EDIT_DETAILS")}
              >
                Edit Details
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="transition-colors rounded-b-lg hover:bg-sky-50 px-3 py-2"
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
        <EditDetailsModal
          package={_package}
          isOpen={visibleModal === "EDIT_DETAILS"}
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
    _package.id.toString().toLowerCase().includes(searchTerm.toLowerCase()),
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

function filterByPackageStatus(
  items: Package[],
  status: "ALL" | PackageStatus,
) {
  if (status === "ALL") return items

  return items.filter((_package) => _package.status === status)
}

function filterByWarehouseId(
  items: Package[],
  warehouseId: "ALL" | "NONE" | number,
) {
  if (warehouseId === "ALL") return items
  if (warehouseId === "NONE")
    return items.filter(({ lastWarehouseId }) => lastWarehouseId === null)

  return items.filter((_package) => _package.lastWarehouseId === warehouseId)
}

type InsuranceStatus = "INSURED" | "NOT_INSURED" | "BOTH"

function filterByInsuranceStatus(
  items: Package[],
  insuranceStatus: InsuranceStatus,
) {
  if (insuranceStatus === "BOTH") return items
  if (insuranceStatus === "NOT_INSURED")
    return items.filter(({ declaredValue }) => declaredValue === null)

  return items.filter(({ declaredValue }) => declaredValue !== null)
}

function PackagesTable({
  packages,
  warehouses,
}: {
  packages: Package[]
  warehouses: Warehouse[]
}) {
  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

  const [selectedTab, setSelectedTab] = useState<"ALL" | PackageShippingType>(
    "STANDARD",
  )

  const [selectedStatus, setSelectedStatus] = useState<"ALL" | PackageStatus>(
    "ALL",
  )

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<
    "ALL" | "NONE" | number
  >("ALL")

  const [selectedInsuranceStatus, setSelectedInsuranceStatus] =
    useState<InsuranceStatus>("BOTH")

  const [searchTerm, setSearchTerm] = useState("")
  const visiblePackages = filterBySearchTerm(
    filterBySelectedTab(
      filterByInsuranceStatus(
        filterByPackageStatus(
          filterByWarehouseId(
            filterByArchiveStatus(
              packages,
              visibleArchiveStatus === "ARCHIVED",
            ),
            selectedWarehouseId,
          ),
          selectedStatus,
        ),
        selectedInsuranceStatus,
      ),
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
          <div className="flex justify-center gap-x-3 gap-y-2 flex-wrap text-sm">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.currentTarget.value as PackageStatus)
              }}
              className="bg-white border border-gray-300 px-2 py-1.5 w-full sm:w-32 h-[2.375rem] rounded-md text-gray-400 font-medium"
            >
              <option value="ALL">All Statuses</option>
              {SUPPORTED_PACKAGE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {getHumanizedOfPackageStatus(status)}
                </option>
              ))}
            </select>
            <select
              value={
                typeof selectedWarehouseId === "number"
                  ? selectedWarehouseId.toString()
                  : selectedWarehouseId
              }
              className="bg-white border border-gray-300 px-2 py-1.5 w-full sm:w-32 h-[2.375rem] rounded-md text-gray-400 font-medium"
              onChange={(e) => {
                if (
                  e.currentTarget.value === "ALL" ||
                  e.currentTarget.value === "NONE"
                ) {
                  setSelectedWarehouseId(e.currentTarget.value)
                } else {
                  setSelectedWarehouseId(Number(e.currentTarget.value))
                }
              }}
            >
              <option value="ALL">All Warehouses</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id.toString()}>
                  {warehouse.displayName}
                </option>
              ))}
              <option value="NONE">Not Received Yet</option>
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
            <select
              className="bg-white border border-gray-300 px-2 py-1.5 w-full sm:w-32 h-[2.375rem] rounded-md text-gray-400 font-medium"
              value={selectedInsuranceStatus}
              onChange={(e) => {
                setSelectedInsuranceStatus(
                  e.currentTarget.value as InsuranceStatus,
                )
              }}
            >
              <option value="BOTH">Either Insurance</option>
              <option value="NOT_INSURED">Not Insured</option>
              <option value="INSURED">Insured</option>
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
        <div className="grid grid-cols-[repeat(5,_auto)_1fr] auto-rows-min overflow-auto">
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
            Last Warehouse
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Status
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Actions
          </div>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4 col-span-6">
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

export function MainSection() {
  const getAllPackagesQuery = api.package.getAll.useQuery()
  const getAllWarehousesQuery = api.warehouse.getAll.useQuery()

  if (
    getAllPackagesQuery.status === "loading" ||
    getAllWarehousesQuery.status === "loading"
  )
    return (
      <div className="flex justify-center pt-4">
        <LoadingSpinner />
      </div>
    )

  if (getAllPackagesQuery.status === "error")
    return (
      <div className="flex justify-center pt-4">
        An error occured: {getAllPackagesQuery.error.message}{" "}
      </div>
    )

  if (getAllWarehousesQuery.status === "error")
    return (
      <div className="flex justify-center pt-4">
        An error occured: {getAllWarehousesQuery.error.message}{" "}
      </div>
    )

  return (
    <PackagesTable
      packages={getAllPackagesQuery.data}
      warehouses={getAllWarehousesQuery.data}
    />
  )
}

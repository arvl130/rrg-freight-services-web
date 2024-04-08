"use client"

import { useState } from "react"
import { Plus } from "@phosphor-icons/react/dist/ssr/Plus"
import { CreateModal } from "./create-modal"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Table from "@/components/table"
import { getColorFromShipmentStatus } from "@/utils/colors"
import { DateTime } from "luxon"
import type { NormalizedWarehouseTransferShipment } from "@/server/db/entities"
import {
  SUPPORTED_SHIPMENT_STATUSES,
  type ShipmentStatus,
} from "@/utils/constants"
import { WarehouseDisplayName } from "@/components/warehouse-display-name"
import { usePaginatedItems } from "@/hooks/paginated-items"
import { ViewDetailsModal } from "@/components/shipments/view-details-modal"
import { ViewLocationsModal } from "@/components/shipments/view-locations-modal"
import { getHumanizedOfShipmentStatus } from "@/utils/humanize"

function TableItem({ item }: { item: NormalizedWarehouseTransferShipment }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "VIEW_LOCATIONS"
  >(null)

  return (
    <>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {item.id}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <WarehouseDisplayName id={item.sentToWarehouseId} />
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {DateTime.fromISO(item.createdAt).toLocaleString(
          DateTime.DATETIME_FULL,
        )}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <div
          className={`
            w-36 py-0.5 text-white text-center rounded-md
            ${getColorFromShipmentStatus(item.status as ShipmentStatus)}
          `}
        >
          {item.status.replaceAll("_", " ")}
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
                onClick={() => setVisibleModal("VIEW_LOCATIONS")}
              >
                View Locations
              </DropdownMenu.Item>

              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <ViewDetailsModal
          shipmentId={item.id}
          isOpen={visibleModal === "VIEW_DETAILS"}
          close={() => setVisibleModal(null)}
        />
        <ViewLocationsModal
          isOpen={visibleModal === "VIEW_LOCATIONS"}
          close={() => setVisibleModal(null)}
          shipment={item}
        />
      </div>
    </>
  )
}

function filterBySearchTerm(
  items: NormalizedWarehouseTransferShipment[],
  searchTerm: string,
) {
  return items.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm),
  )
}

function filterByArchiveStatus(
  items: NormalizedWarehouseTransferShipment[],
  isArchived: boolean,
) {
  if (isArchived) return items.filter((item) => item.isArchived === 1)

  return items.filter((item) => item.isArchived === 0)
}

function filterByShipmentStatus(
  items: NormalizedWarehouseTransferShipment[],
  status: "ALL" | ShipmentStatus,
) {
  if (status === "ALL") return items

  return items.filter((_package) => _package.status === status)
}

function ShipmentsTable({
  shipments,
}: {
  shipments: NormalizedWarehouseTransferShipment[]
}) {
  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

  const [selectedStatus, setSelectedStatus] = useState<"ALL" | ShipmentStatus>(
    "ALL",
  )

  const [searchTerm, setSearchTerm] = useState("")
  const visibleItems = filterBySearchTerm(
    filterByShipmentStatus(
      filterByArchiveStatus(shipments, visibleArchiveStatus === "ARCHIVED"),
      selectedStatus,
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
  } = usePaginatedItems<NormalizedWarehouseTransferShipment>({
    items: visibleItems,
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
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.currentTarget.value as ShipmentStatus)
              }}
              className="bg-white border border-gray-300 px-2 py-1.5 w-full sm:w-32 h-[2.375rem] rounded-md text-gray-400 font-medium"
            >
              <option value="ALL">All Statuses</option>
              {SUPPORTED_SHIPMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {getHumanizedOfShipmentStatus(status)}
                </option>
              ))}
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
        <div className="flex justify-end mb-3">
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
            Shipment ID
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Sent to Warehouse
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Created At
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Status
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Actions
          </div>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4 col-span-5">
              No shipments found.
            </div>
          ) : (
            <>
              {paginatedItems.map((shipment) => (
                <TableItem key={shipment.id} item={shipment} />
              ))}
            </>
          )}
        </div>
      </Table.Content>
    </>
  )
}

export function HeaderSection() {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)

  return (
    <>
      <h1 className="text-2xl font-black mb-2 [color:_#00203F] flex items-center gap-1">
        <span>Shipments</span> <CaretRight size={20} />
        <span>Warehouse Transfer</span>
      </h1>
      <div className="grid">
        <button
          type="button"
          className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium mt-auto"
          onClick={() => setIsOpenCreateModal(true)}
        >
          <Plus size={16} />
          <span>Create Shipment</span>
        </button>
      </div>
      <CreateModal
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
      />
    </>
  )
}

export function MainSection() {
  const {
    status,
    data: shipments,
    error,
  } = api.shipment.warehouseTransfer.getAll.useQuery()

  if (status === "loading")
    return (
      <div className="flex justify-center pt-4">
        <LoadingSpinner />
      </div>
    )

  if (status === "error")
    return (
      <div className="flex justify-center pt-4">
        An error occured: {error.message}
      </div>
    )

  return <ShipmentsTable shipments={shipments} />
}

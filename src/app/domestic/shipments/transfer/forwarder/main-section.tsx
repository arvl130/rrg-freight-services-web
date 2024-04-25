"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Table from "@/components/table"
import { useState } from "react"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree"
import { getColorFromShipmentStatus } from "@/utils/colors"
import { DateTime } from "luxon"
import type {
  NormalizedForwarderTransferShipment,
  Warehouse,
} from "@/server/db/entities"
import { ConfirmTransferModal } from "@/components/shipments/transfer/forwarder/confirm-transfer-modal"
import { usePaginatedItems } from "@/hooks/paginated-items"
import { getHumanizedOfShipmentStatus } from "@/utils/humanize"
import { ViewDetailsModal } from "@/components/shipments/view-details-modal"
import {
  SUPPORTED_SHIPMENT_STATUSES,
  type ShipmentStatus,
} from "@/utils/constants"

type NormalizedForwarderTransferShipmentWithDetails =
  NormalizedForwarderTransferShipment & {
    agentDisplayName: string
    agentCompanyName: string
    driverDisplayName: string
    warehouseDisplayName: string
  }

function TableItem({
  item,
}: {
  item: NormalizedForwarderTransferShipmentWithDetails
}) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "CONFIRM_TRANSFER"
  >(null)

  return (
    <>
      <div className="px-4 py-2 flex items-center gap-1 border-b border-gray-300 text-sm">
        {item.id}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {item.agentDisplayName} ({item.agentCompanyName})
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
            ${getColorFromShipmentStatus(item.status)}
          `}
        >
          {getHumanizedOfShipmentStatus(item.status)}
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

              {item.proofOfTransferImgUrl !== null &&
                item.isTransferConfirmed === 0 && (
                  <DropdownMenu.Item
                    className="transition-colors hover:bg-sky-50 px-3 py-2"
                    onClick={() => setVisibleModal("CONFIRM_TRANSFER")}
                  >
                    Confirm Transfer
                  </DropdownMenu.Item>
                )}

              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <ViewDetailsModal
          shipmentId={item.id}
          isOpen={visibleModal === "VIEW_DETAILS"}
          close={() => setVisibleModal(null)}
        />

        {item.proofOfTransferImgUrl !== null &&
          item.isTransferConfirmed === 0 && (
            <ConfirmTransferModal
              isOpen={visibleModal === "CONFIRM_TRANSFER"}
              onClose={() => setVisibleModal(null)}
              shipmentId={item.id}
              proofOfTransferImgUrl={item.proofOfTransferImgUrl}
            />
          )}
      </div>
    </>
  )
}

function filterBySearchTerm(
  items: NormalizedForwarderTransferShipmentWithDetails[],
  searchTerm: string,
) {
  return items.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm),
  )
}

function filterByArchiveStatus(
  items: NormalizedForwarderTransferShipmentWithDetails[],
  isArchived: boolean,
) {
  if (isArchived) return items.filter((item) => item.isArchived === 1)

  return items.filter((item) => item.isArchived === 0)
}

function filterByShipmentStatus(
  items: NormalizedForwarderTransferShipmentWithDetails[],
  status: "ALL" | ShipmentStatus,
) {
  if (status === "ALL") return items

  return items.filter((_package) => _package.status === status)
}

function filterByWarehouseId(
  items: NormalizedForwarderTransferShipmentWithDetails[],
  warehouseId: "ALL" | number,
) {
  if (warehouseId === "ALL") return items

  return items.filter((item) => item.departingWarehouseId === warehouseId)
}

function ShipmentsTable({
  items,
  warehouses,
}: {
  items: NormalizedForwarderTransferShipmentWithDetails[]
  warehouses: Warehouse[]
}) {
  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

  const [selectedStatus, setSelectedStatus] = useState<"ALL" | ShipmentStatus>(
    "ALL",
  )

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<
    "ALL" | number
  >("ALL")

  const [searchTerm, setSearchTerm] = useState("")
  const visibleItems = filterBySearchTerm(
    filterByShipmentStatus(
      filterByWarehouseId(
        filterByArchiveStatus(items, visibleArchiveStatus === "ARCHIVED"),
        selectedWarehouseId,
      ),
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
  } = usePaginatedItems<NormalizedForwarderTransferShipmentWithDetails>({
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
            <select
              value={
                typeof selectedWarehouseId === "number"
                  ? selectedWarehouseId.toString()
                  : selectedWarehouseId
              }
              className="bg-white border border-gray-300 px-2 py-1.5 w-full sm:w-32 h-[2.375rem] rounded-md text-gray-400 font-medium"
              onChange={(e) => {
                if (e.currentTarget.value === "ALL") {
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
            Sent By
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
              {paginatedItems.map((item) => (
                <TableItem key={item.id} item={item} />
              ))}
            </>
          )}
        </div>
      </Table.Content>
    </>
  )
}

export function MainSection() {
  const getAllForwarderTransfersQuery =
    api.shipment.forwarderTransfer.getAllForDomesticAgent.useQuery()
  const getAllWarehousesQuery = api.warehouse.getAll.useQuery()

  if (
    getAllForwarderTransfersQuery.status === "loading" ||
    getAllWarehousesQuery.status === "loading"
  )
    return (
      <div className="flex justify-center pt-4">
        <LoadingSpinner />
      </div>
    )

  if (getAllForwarderTransfersQuery.status === "error")
    return (
      <div className="flex justify-center pt-4">
        An error occured: {getAllForwarderTransfersQuery.error.message}
      </div>
    )

  if (getAllWarehousesQuery.status === "error")
    return (
      <div className="flex justify-center pt-4">
        An error occured: {getAllWarehousesQuery.error.message}
      </div>
    )

  return (
    <ShipmentsTable
      items={getAllForwarderTransfersQuery.data}
      warehouses={getAllWarehousesQuery.data}
    />
  )
}

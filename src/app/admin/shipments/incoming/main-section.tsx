"use client"

import { useState } from "react"
import { Plus } from "@phosphor-icons/react/dist/ssr/Plus"
import { CreateModal } from "@/app/admin/shipments/incoming/create-modal"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import toast from "react-hot-toast"
import type {
  NormalizedIncomingShipment,
  Warehouse,
} from "@/server/db/entities"
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple"
import { List } from "@phosphor-icons/react/dist/ssr/List"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Table from "@/components/table"
import { getColorFromShipmentStatus } from "@/utils/colors"
import { DateTime } from "luxon"
import { usePaginatedItems } from "@/hooks/paginated-items"
import { ViewDetailsModal } from "@/components/shipments/view-details-modal"
import { ViewWaybillsModal } from "@/components/shipments/incoming/view-waybills-modal"
import {
  SUPPORTED_SHIPMENT_STATUSES,
  type ShipmentStatus,
} from "@/utils/constants"
import { getHumanizedOfShipmentStatus } from "@/utils/humanize"
import { EditDetailsModal } from "./edit-details-modal"
import { ArchiveModal } from "./archive-modal"
import { UnarchiveModal } from "./unarchive-modal"
import { WarehouseDetails } from "@/components/warehouse-details"
import { MissingPackagesModal } from "./missing-packages-modal"

type NormalizedIncomingShipmentWithAgentDetails = NormalizedIncomingShipment & {
  agentDisplayName: string
  agentCompanyName: string
}

function TableItem({
  item,
}: {
  item: NormalizedIncomingShipmentWithAgentDetails
}) {
  const [visibleModal, setVisibleModal] = useState<
    | null
    | "VIEW_DETAILS"
    | "EDIT_DETAILS"
    | "PRINT_WAYBILLS"
    | "ARCHIVE"
    | "MISSING_PACKAGES"
    | "UNARCHIVE"
  >(null)

  return (
    <>
      <div className="px-4 py-2 border-b border-gray-300 text-sm text-right">
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
        <WarehouseDetails warehouseId={item.destinationWarehouseId} />
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <div
          className={`
            w-36 py-0.5 text-white text-center rounded-md
            ${getColorFromShipmentStatus(item.status)}
          `}
        >
          {item.status.replaceAll("_", " ")}
        </div>
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="border border-gray-300 rounded-full p-2 shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="sr-only">Actions</span>
              <List size={16} weight="bold" />
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
                className="transition-colors rounded-t-lg hover:bg-sky-50 px-3 py-2"
                onClick={() => setVisibleModal("EDIT_DETAILS")}
              >
                Edit Details
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="transition-colors rounded-t-lg hover:bg-sky-50 px-3 py-2"
                onClick={() => setVisibleModal("MISSING_PACKAGES")}
              >
                Missing Packages
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="transition-colors hover:bg-sky-50 px-3 py-2"
                onClick={() => setVisibleModal("PRINT_WAYBILLS")}
              >
                Print Waybills
              </DropdownMenu.Item>

              {item.status === "COMPLETED" ? (
                item.isArchived ? (
                  <DropdownMenu.Item
                    className="transition-colors rounded-b-lg hover:bg-sky-50 px-3 py-2"
                    onClick={() => setVisibleModal("UNARCHIVE")}
                  >
                    Unarchive
                  </DropdownMenu.Item>
                ) : (
                  <DropdownMenu.Item
                    className="transition-colors rounded-b-lg hover:bg-sky-50 px-3 py-2"
                    onClick={() => setVisibleModal("ARCHIVE")}
                  >
                    Archive
                  </DropdownMenu.Item>
                )
              ) : (
                <></>
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
        <EditDetailsModal
          shipment={item}
          isOpen={visibleModal === "EDIT_DETAILS"}
          onClose={() => setVisibleModal(null)}
        />
        <ViewWaybillsModal
          shipmentId={item.id}
          isOpen={visibleModal === "PRINT_WAYBILLS"}
          onClose={() => setVisibleModal(null)}
        />

        <ArchiveModal
          id={item.id}
          close={() => setVisibleModal(null)}
          isOpen={visibleModal === "ARCHIVE"}
        />
        <UnarchiveModal
          id={item.id}
          close={() => setVisibleModal(null)}
          isOpen={visibleModal === "UNARCHIVE"}
        />
        <MissingPackagesModal
          isOpen={visibleModal === "MISSING_PACKAGES"}
          onClose={() => setVisibleModal(null)}
          shipmentId={item.id}
        />
      </div>
    </>
  )
}

function filterBySearchTerm(
  items: NormalizedIncomingShipmentWithAgentDetails[],
  searchTerm: string,
) {
  return items.filter((item) => {
    const searchTermSearchable = searchTerm.toLowerCase()
    const shipmentId = item.id.toString()
    const sender =
      `${item.agentDisplayName} (${item.agentCompanyName})`.toLowerCase()

    return (
      shipmentId.includes(searchTermSearchable) ||
      sender.includes(searchTermSearchable)
    )
  })
}

function filterByArchiveStatus(
  items: NormalizedIncomingShipmentWithAgentDetails[],
  isArchived: boolean,
) {
  if (isArchived) return items.filter((item) => item.isArchived === 1)

  return items.filter((item) => item.isArchived === 0)
}

function filterByShipmentStatus(
  items: NormalizedIncomingShipmentWithAgentDetails[],
  status: "ALL" | ShipmentStatus,
) {
  if (status === "ALL") return items

  return items.filter((_package) => _package.status === status)
}

function filterByWarehouseId(
  items: NormalizedIncomingShipmentWithAgentDetails[],
  warehouseId: "ALL" | number,
) {
  if (warehouseId === "ALL") return items

  return items.filter((item) => item.destinationWarehouseId === warehouseId)
}

function ShipmentsTable({
  items,
  warehouses,
}: {
  items: NormalizedIncomingShipmentWithAgentDetails[]
  warehouses: Warehouse[]
}) {
  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

  const [selectedStatus, setSelectedStatus] = useState<"ALL" | ShipmentStatus>(
    "IN_TRANSIT",
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
  } = usePaginatedItems<NormalizedIncomingShipmentWithAgentDetails>({
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
        <div className="grid grid-cols-[repeat(5,_auto)_1fr] auto-rows-min overflow-auto">
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Shipment ID
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Sender
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Created At
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Received at Warehouse
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Status
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Actions
          </div>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4 col-span-6">
              No shipments found.
            </div>
          ) : (
            <>
              {paginatedItems.map((incomingShipment) => (
                <TableItem key={incomingShipment.id} item={incomingShipment} />
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
  const [shipmentId, setShipmentId] = useState<null | number>(null)

  return (
    <>
      <h1 className="text-2xl font-black mb-2 [color:_#00203F] flex items-center gap-1">
        <span>Shipments</span> <CaretRight size={20} />
        <span>Incoming</span>
      </h1>
      <div className="flex gap-5">
        <button
          type="button"
          className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium mt-auto"
          onClick={() => setIsOpenCreateModal(true)}
        >
          <Plus size={16} />
          <span>New Shipment</span>
        </button>
      </div>
      <CreateModal
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
        onSuccess={(newShipmentId) => {
          setIsOpenCreateModal(false)
          setShipmentId(newShipmentId)
        }}
      />
      {shipmentId !== null && (
        <ViewWaybillsModal
          shipmentId={shipmentId}
          isOpen={true}
          onClose={() => setShipmentId(null)}
        />
      )}
    </>
  )
}

export function MainSection() {
  const getAllShipmentsQuery = api.shipment.incoming.getAll.useQuery()
  const getAllWarehousesQuery = api.warehouse.getAll.useQuery()

  if (
    getAllShipmentsQuery.status === "pending" ||
    getAllWarehousesQuery.status === "pending"
  )
    return (
      <div className="flex justify-center pt-4">
        <LoadingSpinner />
      </div>
    )

  if (getAllShipmentsQuery.status === "error")
    return (
      <div className="flex justify-center pt-4">
        An error occured: {getAllShipmentsQuery.error.message}
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
      items={getAllShipmentsQuery.data}
      warehouses={getAllWarehousesQuery.data}
    />
  )
}

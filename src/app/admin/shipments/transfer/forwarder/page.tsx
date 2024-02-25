"use client"

import { AdminLayout } from "@/app/admin/auth"
import { useState } from "react"
import { useSession } from "@/hooks/session"
import { Plus } from "@phosphor-icons/react/dist/ssr/Plus"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Page from "@/components/page"
import * as Table from "@/components/table"
import { getColorFromShipmentStatus } from "@/utils/colors"
import { DateTime } from "luxon"
import type { NormalizedForwarderTransferShipment } from "@/server/db/entities"
import type { ShipmentStatus } from "@/utils/constants"
import { UserDisplayName } from "@/components/user-display-name"
import { usePaginatedItems } from "@/hooks/paginated-items"
import { CreateModal } from "@/components/shipments/transfer/forwarder/create-modal"
import { ViewDetailsModal } from "@/components/shipments/view-details-modal"
import { ViewLocationsModal } from "@/components/shipments/view-locations-modal"

function TableItem({ item }: { item: NormalizedForwarderTransferShipment }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "VIEW_LOCATIONS"
  >(null)

  return (
    <>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <input type="checkbox" name="" id="" />
        <span>{item.id}</span>
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <UserDisplayName userId={item.sentToAgentId} />
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {DateTime.fromJSDate(item.createdAt).toLocaleString(
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
  items: NormalizedForwarderTransferShipment[],
  searchTerm: string,
) {
  return items.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm),
  )
}

function filterByArchiveStatus(
  items: NormalizedForwarderTransferShipment[],
  isArchived: boolean,
) {
  if (isArchived) return items.filter((item) => item.isArchived === 1)

  return items.filter((item) => item.isArchived === 0)
}

function ShipmentsTable({
  items,
}: {
  items: NormalizedForwarderTransferShipment[]
}) {
  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

  const [searchTerm, setSearchTerm] = useState("")
  const visibleItems = filterBySearchTerm(
    filterByArchiveStatus(items, visibleArchiveStatus === "ARCHIVED"),
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
  } = usePaginatedItems<NormalizedForwarderTransferShipment>({
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

export default function TransferForwarderShipmentsPage() {
  const { user, role } = useSession()
  const {
    status,
    data: items,
    error,
  } = api.shipment.forwarderTransfer.getAll.useQuery(undefined, {
    enabled: user !== null && role === "ADMIN",
  })

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)

  return (
    <AdminLayout title="Shipments">
      <Page.Header>
        <h1 className="text-2xl font-black mb-2 [color:_#00203F] flex items-center gap-1">
          <span>Shipments</span> <CaretRight size={20} />
          <span>Forwarder Transfer</span>
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
          close={() => setIsOpenCreateModal(false)}
        />
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
      {status === "success" && <ShipmentsTable items={items} />}
    </AdminLayout>
  )
}

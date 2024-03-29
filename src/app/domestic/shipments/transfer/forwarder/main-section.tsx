"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Table from "@/components/table"
import { useState } from "react"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree"
import { getColorFromShipmentStatus } from "@/utils/colors"
import { DateTime } from "luxon"
import type { NormalizedForwarderTransferShipment } from "@/server/db/entities"
import { ConfirmTransferModal } from "@/components/shipments/transfer/forwarder/confirm-transfer-modal"
import { usePaginatedItems } from "@/hooks/paginated-items"
import { getHumanizedOfShipmentStatus } from "@/utils/humanize"
import { ViewDetailsModal } from "@/components/shipments/view-details-modal"

function UserDisplayName({ userId }: { userId: string }) {
  const { status, data, error } = api.user.getById.useQuery({
    id: userId,
  })

  if (status === "loading") return <>...</>
  if (status === "error") return <>error: {error.message}</>

  return <>{data?.displayName}</>
}

function TableItem({ item }: { item: NormalizedForwarderTransferShipment }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "CONFIRM_TRANSFER"
  >(null)

  return (
    <>
      <div className="px-4 py-2 flex items-center gap-1 border-b border-gray-300 text-sm">
        {item.id}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <UserDisplayName userId={item.sentToAgentId} />
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
  const { status, data, error } =
    api.shipment.forwarderTransfer.getAll.useQuery()

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

  return <ShipmentsTable items={data} />
}

"use client"

import { Plus } from "@phosphor-icons/react/dist/ssr/Plus"
import { api } from "@/utils/api"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Table from "@/components/table"
import { CreateModal } from "./create-modal"
import { EditModal } from "./edit-modal"
import { DeleteModal } from "./delete-modal"
import { usePaginatedItems } from "@/hooks/paginated-items"
import type { Vehicle } from "@/server/db/entities"
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree"
import { ArchiveModal } from "./archive-modal"
import { UnarchiveModal } from "./unarchive-modal"

function TableItem({ item }: { item: Vehicle }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "EDIT" | "DELETE" | "ARCHIVE" | "UNARCHIVE"
  >(null)

  return (
    <>
      <div className="px-4 py-2 border-b border-gray-300 text-sm text-right">
        {item.id}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {item.plateNumber}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {item.displayName}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {item.type}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {item.isExpressAllowed === 1 ? "Yes" : "No"}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {item.isMaintenance === 1 ? "Yes" : "No"}
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
            <DropdownMenu.Content className="bg-white rounded-lg drop-shadow-lg text-sm font-medium">
              <DropdownMenu.Item
                className="transition-colors rounded-t-lg hover:bg-sky-50 px-3 py-2"
                onClick={() => setVisibleModal("EDIT")}
              >
                Edit
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="transition-colors hover:bg-sky-50 px-3 py-2"
                onClick={() => setVisibleModal("DELETE")}
              >
                Delete
              </DropdownMenu.Item>
              {item.isArchived ? (
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
              )}
              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <EditModal
          id={item.id}
          close={() => setVisibleModal(null)}
          isOpen={visibleModal === "EDIT"}
        />
        <DeleteModal
          id={item.id}
          close={() => setVisibleModal(null)}
          isOpen={visibleModal === "DELETE"}
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
      </div>
    </>
  )
}

function filterBySearchTerm(items: Vehicle[], searchTerm: string) {
  return items.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm),
  )
}

function filterByArchiveStatus(items: Vehicle[], isArchived: boolean) {
  if (isArchived) return items.filter((item) => item.isArchived === 1)

  return items.filter((item) => item.isArchived === 0)
}

function VehiclesTable({ items }: { items: Vehicle[] }) {
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
  } = usePaginatedItems<Vehicle>({
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
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
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
        <div className="grid grid-cols-[repeat(6,_auto)_1fr] auto-rows-min overflow-auto">
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Vehicle ID
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Plate Number
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Display Name
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Type
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Express Allowed
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Ongoing Maintenance
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Actions
          </div>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4 col-span-7">No vehicle found.</div>
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

export function HeaderSection() {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)

  return (
    <>
      <h1 className="text-2xl font-black [color:_#00203F] mb-2">Vehicles</h1>
      <button
        type="button"
        className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium mt-auto"
        onClick={() => setIsOpenCreateModal(true)}
      >
        <Plus size={16} />
        <span>New Vehicle</span>
      </button>
      <CreateModal
        isOpen={isOpenCreateModal}
        close={() => setIsOpenCreateModal(false)}
      />
    </>
  )
}

export function MainSection() {
  const { status, data: vehicles, error } = api.vehicle.getAll.useQuery()

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

  return <VehiclesTable items={vehicles} />
}

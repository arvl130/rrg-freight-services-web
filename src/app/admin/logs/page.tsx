"use client"

import { AdminLayout } from "@/app/admin/auth"
import { useSession } from "@/hooks/session"
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree"
import { api } from "@/utils/api"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Page from "@/components/page"
import * as Table from "@/components/table"
import { usePaginatedItems } from "@/hooks/paginated-items"
import type { Activity } from "@/server/db/entities"
import { getColorFromActivityVerb } from "@/utils/colors"

function TableItem({ item }: { item: Activity }) {
  const [visibleModal, setVisibleModal] = useState<null | "EDIT" | "DELETE">(
    null,
  )

  return (
    <>
      <div className="px-4 py-2 border-b border-gray-300 text-sm text-right">
        {item.id}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {item.createdById}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {item.createdAt}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <span
          className={`${getColorFromActivityVerb(
            item.verb,
          )} text-white px-3 py-1.5 inline-block rounded-md font-semibold`}
        >
          {item.verb}
        </span>
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {item.entity}
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
                className="transition-colors hover:bg-sky-50 px-3 py-2"
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
              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </>
  )
}

function filterBySearchTerm(items: Activity[], searchTerm: string) {
  return items.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm),
  )
}

function filterByArchiveStatus(items: Activity[], isArchived: boolean) {
  if (isArchived) return items.filter((item) => item.isArchived === 1)

  return items.filter((item) => item.isArchived === 0)
}

function ActivitiesTable({ items }: { items: Activity[] }) {
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
  } = usePaginatedItems<Activity>({
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
            ID
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            User
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Date & Time
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Verb
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Entity
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Action
          </div>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4 col-span-5">
              No activity found.
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

export default function ActivitiesPage() {
  const { user, role } = useSession()
  const {
    status,
    data: activities,
    error,
  } = api.activity.getAll.useQuery(undefined, {
    enabled: user !== null && role === "ADMIN",
  })

  return (
    <AdminLayout title="Packages">
      <Page.Header>
        <h1 className="text-2xl font-black [color:_#00203F] mb-2">
          Activities
        </h1>
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
      {status === "success" && <ActivitiesTable items={activities} />}
    </AdminLayout>
  )
}

"use client"

import { api } from "@/utils/api"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import * as Table from "@/components/table"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { usePaginatedItems } from "@/hooks/paginated-items"
import type { Activity } from "@/server/db/entities"
import { getColorFromActivityVerb } from "@/utils/colors"
import { SUPPORTED_ACTIVITY_VERB, type ActivityVerb } from "@/utils/constants"
import { List } from "@phosphor-icons/react/dist/ssr/List"
import { ArchiveModal } from "./archive-modal"
import { UnarchiveModal } from "./unarchive-modal"

type ActivityWithUserDisplayName = Activity & { createdByDisplayName: string }

function TableItem({ item }: { item: ActivityWithUserDisplayName }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "ARCHIVE" | "UNARCHIVE"
  >(null)

  return (
    <>
      <div className="px-4 py-2 border-b border-gray-300 text-sm text-right">
        {item.id}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {item.createdByDisplayName}
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
              {item.isArchived ? (
                <DropdownMenu.Item
                  className="transition-colors rounded-lg hover:bg-sky-50 px-3 py-2"
                  onClick={() => setVisibleModal("UNARCHIVE")}
                >
                  Unarchive
                </DropdownMenu.Item>
              ) : (
                <DropdownMenu.Item
                  className="transition-colors rounded-lg hover:bg-sky-50 px-3 py-2"
                  onClick={() => setVisibleModal("ARCHIVE")}
                >
                  Archive
                </DropdownMenu.Item>
              )}

              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

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

function filterBySearchTerm(
  items: ActivityWithUserDisplayName[],
  searchTerm: string,
) {
  return items.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm),
  )
}

function filterByArchiveStatus(
  items: ActivityWithUserDisplayName[],
  isArchived: boolean,
) {
  if (isArchived) return items.filter((item) => item.isArchived === 1)

  return items.filter((item) => item.isArchived === 0)
}

function filterByVerb(
  items: ActivityWithUserDisplayName[],
  verb: "ALL" | ActivityVerb,
) {
  if (verb === "ALL") return items

  return items.filter((_package) => _package.verb === verb)
}

function ActivitiesTable({ items }: { items: ActivityWithUserDisplayName[] }) {
  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

  const [selectedVerb, setSelectedVerb] = useState<"ALL" | ActivityVerb>("ALL")

  const [searchTerm, setSearchTerm] = useState("")
  const visibleItems = filterBySearchTerm(
    filterByVerb(
      filterByArchiveStatus(items, visibleArchiveStatus === "ARCHIVED"),
      selectedVerb,
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
  } = usePaginatedItems<ActivityWithUserDisplayName>({
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
              value={selectedVerb}
              onChange={(e) => {
                setSelectedVerb(e.currentTarget.value as ActivityVerb)
              }}
              className="bg-white border border-gray-300 px-2 py-1.5 w-full sm:w-32 h-[2.375rem] rounded-md text-gray-400 font-medium"
            >
              <option value="ALL">All Activities</option>
              {SUPPORTED_ACTIVITY_VERB.map((verb) => (
                <option key={verb} value={verb}>
                  {verb}
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
            ID
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            User
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Date & Time
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Activity
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Entity
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Actions
          </div>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4 col-span-6">
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

export function MainSection() {
  const { status, data: activities, error } = api.activity.getAll.useQuery()

  if (status === "pending")
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

  return <ActivitiesTable items={activities} />
}

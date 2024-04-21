"use client"

import { api } from "@/utils/api"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Table from "@/components/table"
import { DeleteModal } from "./delete-modal"
import { usePaginatedItems } from "@/hooks/paginated-items"
import type { Inquiries } from "@/server/db/entities"
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree"
import { ArchiveModal } from "./archive-modal"
import { UnarchiveModal } from "./unarchive-modal"
import { XCircle } from "@phosphor-icons/react/dist/ssr/XCircle"
import { PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt"

function Modal({ onClose, children }) {
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-4 max-w-md w-full">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle size={32} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

function TableItem({ item }: { item: Inquiries }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "UPDATE" | "DELETE" | "ARCHIVE" | "UNARCHIVE"
  >(null)
  const [showModal, setShowModal] = useState(false)

  const toggleModal = () => {
    setShowModal(!showModal)
  }
  return (
    <>
      <div className="px-8 py-2 border-b border-gray-300 text-sm text-right">
        {item.id}
      </div>
      <div className="px-8 py-2 border-b border-gray-300 text-sm">
        {item.fullName}
      </div>
      <div className="px-8 py-2 border-b border-gray-300 text-sm">
        {item.emailAddress}
      </div>
      <div className="px-8 py-2 border-b border-gray-300 text-sm">
        {item.message.length > 25 ? (
          <>
            {item.message.slice(0, 25)}
            <span
              onClick={toggleModal}
              className="text-blue-500 cursor-pointer"
            >
              ...see more
            </span>
            {showModal && (
              <Modal onClose={toggleModal}>
                <div className="px-4 py-2">
                  {item.message}
                  <div className="flex justify-center mt-4">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item.emailAddress}&su=Reply%20to%20Inquiry&body=Hi,%0D%0A%0D%0A`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                    >
                      <span>Write a reply</span>
                      <span>
                        <PaperPlaneTilt size={16} />
                      </span>
                    </a>
                  </div>
                </div>
              </Modal>
            )}
          </>
        ) : (
          <>
            {item.message}
            <div className="flex justify-center mt-4">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item.emailAddress}&su=Inquiry&body=Hi,%0D%0A%0D%0A`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Write a reply (Gmail)
              </a>
            </div>
          </>
        )}
      </div>

      <div className="px-16 py-2 border-b border-gray-300 text-sm">
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

function filterBySearchTerm(items: Inquiries[], searchTerm: string) {
  return items.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm),
  )
}

function filterByArchiveStatus(items: Inquiries[], isArchived: boolean) {
  if (isArchived) return items.filter((item) => item.isArchived === 1)

  return items.filter((item) => item.isArchived === 0)
}

function InquiriesTable({ items }: { items: Inquiries[] }) {
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
  } = usePaginatedItems<Inquiries>({
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
        <div className="grid grid-cols-[repeat(4,_auto)_1fr] auto-rows-min overflow-auto">
          <div className="uppercase px-8 py-2 border-y border-gray-300 font-medium">
            Inquiry ID
          </div>
          <div className="uppercase px-8 py-2 border-y border-gray-300 font-medium">
            Full Name
          </div>
          <div className="uppercase px-8 py-2 border-y border-gray-300 font-medium">
            Email Address
          </div>
          <div className="uppercase px-8 py-2 border-y border-gray-300 font-medium">
            Message
          </div>
          <div className="uppercase px-10 py-2 border-y border-gray-300 font-medium">
            Actions
          </div>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4 col-span-7">No Inquiry found.</div>
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
  return (
    <>
      <h1 className="text-2xl font-black [color:_#00203F] mb-2">Inquiries</h1>
    </>
  )
}

export function MainSection() {
  const { status, data: inquiries, error } = api.inquiries.getAll.useQuery()

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

  return <InquiriesTable items={inquiries} />
}

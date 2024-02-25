import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass"
import { Export } from "@phosphor-icons/react/dist/ssr/Export"
import type { ReactNode } from "react"
import { useRef } from "react"
import { CaretDoubleLeft } from "@phosphor-icons/react/dist/ssr/CaretDoubleLeft"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr/CaretLeft"
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import { CaretDoubleRight } from "@phosphor-icons/react/dist/ssr/CaretDoubleRight"
import { utils, writeFileXLSX } from "xlsx"

export function Filters({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 mb-6">
      {children}
    </div>
  )
}

export function Content({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-rows-[auto_1fr] bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 min-h-[36rem]">
      {children}
    </div>
  )
}

export function Header({ children }: { children: ReactNode }) {
  return <div className="border-y border-gray-300 font-medium">{children}</div>
}

export function SearchForm({
  updateSearchTerm,
  resetPageNumber,
}: {
  updateSearchTerm: (searchTerm: string) => void
  resetPageNumber: () => void
}) {
  const searchInputRef = useRef<null | HTMLInputElement>(null)

  return (
    <form
      className="inline-grid grid-cols-[1fr_auto] h-[2.375rem] w-full sm:max-w-56"
      onSubmit={(e) => {
        e.preventDefault()

        if (searchInputRef.current) {
          updateSearchTerm(searchInputRef.current.value)
          resetPageNumber()
        }
      }}
    >
      <input
        ref={searchInputRef}
        type="text"
        className="w-full rounded-l-lg px-3 border-l border-y border-brand-cyan-500 py-1.5 text-sm"
        placeholder="Quick search"
      />
      <button
        type="submit"
        className="w-9 text-white bg-brand-cyan-500 flex justify-center items-center rounded-r-lg border-r border-y border-brand-cyan-500"
      >
        <span className="sr-only">Search</span>
        <MagnifyingGlass size={16} />
      </button>
    </form>
  )
}

export function Pagination({
  isOnFirstPage,
  isOnLastPage,
  pageSize,
  pageNumber,
  pageCount,
  gotoPage,
  gotoFirstPage,
  gotoLastPage,
  gotoNextPage,
  gotoPreviousPage,
  updatePageSize,
}: {
  pageNumber: number
  pageSize: number
  pageCount: number
  updatePageSize: (pageSize: number) => void
  gotoPage: (pageNumber: number) => void
  gotoFirstPage: () => void
  gotoLastPage: () => void
  gotoNextPage: () => void
  gotoPreviousPage: () => void
  isOnFirstPage: boolean
  isOnLastPage: boolean
}) {
  return (
    <div className="flex gap-8">
      <div>
        Showing{" "}
        <select
          className="bg-white border border-gray-300 px-2 py-1 w-16"
          value={pageSize}
          onChange={(e) =>
            updatePageSize(e.currentTarget.value as unknown as number)
          }
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">50</option>
        </select>{" "}
        entries
      </div>
      {pageCount > 1 && (
        <div className="flex items-center gap-1 text-sm">
          <button
            type="button"
            className="disabled:text-gray-400"
            disabled={isOnFirstPage}
            onClick={gotoFirstPage}
          >
            <CaretDoubleLeft size={16} />
          </button>
          <button
            type="button"
            className="disabled:text-gray-400"
            disabled={isOnFirstPage}
            onClick={gotoPreviousPage}
          >
            <CaretLeft size={16} />
          </button>

          {[...Array(pageCount)].map((_, index) => (
            <button
              key={index}
              type="button"
              disabled={index + 1 === pageNumber}
              onClick={() => gotoPage(index + 1)}
              className={
                "w-6 h-6 disabled:bg-brand-cyan-500 disabled:text-white rounded-md"
              }
            >
              {index + 1}
            </button>
          ))}

          <button
            type="button"
            className="disabled:text-gray-400"
            disabled={pageCount < 2 ? true : isOnLastPage}
            onClick={gotoNextPage}
          >
            <CaretRight size={16} />
          </button>
          <button
            type="button"
            className="disabled:text-gray-400"
            disabled={pageCount < 2 ? true : isOnLastPage}
            onClick={gotoLastPage}
          >
            <CaretDoubleRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export function ExportButton({
  records,
}: {
  records: Record<string, unknown>[]
}) {
  return (
    <button
      type="button"
      className="inline-flex text-sm items-center gap-1 hover:bg-sky-400 bg-sky-500 disabled:bg-sky-300 text-white transition-colors px-6 py-2 font-medium"
      disabled={records.length === 0}
      onClick={() => {
        const formattedRecords = records.map((record) => {
          const newRecord = {} as Record<string, unknown>

          Object.keys(record).forEach((key) => {
            const newKeyName = key
              .replace(/[A-Z]/g, (letter) => ` ${letter.toUpperCase()}`)
              .toUpperCase()

            newRecord[newKeyName] = record[key]
          })

          return newRecord
        })

        const worksheet = utils.json_to_sheet(formattedRecords)
        const workbook = utils.book_new()

        utils.book_append_sheet(workbook, worksheet, "Sheet 1")
        writeFileXLSX(workbook, "export.xlsx", { compression: true })
      }}
    >
      <Export size={16} />
      <span>Export</span>
    </button>
  )
}

import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { Export } from "@phosphor-icons/react/Export"
import { ReactNode, useRef } from "react"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"

export function Filters({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-3 bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 mb-6">
      {children}
    </div>
  )
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
      className="inline-grid grid-cols-[1fr_2.25rem] h-[2.375rem]"
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
        className="rounded-l-lg px-3 border-l border-y border-brand-cyan-500 py-1.5 text-sm"
        placeholder="Quick search"
      />
      <button
        type="submit"
        className="text-white bg-brand-cyan-500 flex justify-center items-center rounded-r-lg border-r border-y border-brand-cyan-500"
      >
        <span className="sr-only">Search</span>
        <MagnifyingGlass size={16} />
      </button>
    </form>
  )
}

export function Main({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 min-h-[36rem]">
      {children}
    </div>
  )
}

export function Pagination({ children }: { children: ReactNode }) {
  return <div className="flex justify-between mb-3">{children}</div>
}

export function PaginationButtons({
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
          disabled={isOnLastPage}
          onClick={gotoNextPage}
        >
          <CaretRight size={16} />
        </button>
        <button
          type="button"
          className="disabled:text-gray-400"
          disabled={isOnLastPage}
          onClick={gotoLastPage}
        >
          <CaretDoubleRight size={16} />
        </button>
      </div>
    </div>
  )
}

export function Header({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-4 border-y border-gray-300 font-medium">
      {children}
    </div>
  )
}

export function Content({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

export function ExportButton() {
  return (
    <button
      type="button"
      className="inline-flex text-sm items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium"
    >
      <Export size={16} />
      <span>Export</span>
    </button>
  )
}

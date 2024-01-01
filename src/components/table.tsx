import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { Export } from "@phosphor-icons/react/Export"
import { ReactNode, useRef } from "react"

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

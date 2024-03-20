"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { Fragment, useState } from "react"
import Link from "next/link"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass"
import { usePathname } from "next/navigation"
import { getSearchablePagesForRole } from "@/utils/searcheable-pages"
import type { UserRole } from "@/utils/constants"

function SearchForm(props: { close: () => void; role: UserRole }) {
  const [searchTerm, setSearchTerm] = useState("")
  const searchResults = getSearchablePagesForRole(props.role).filter((page) =>
    page.title.toLowerCase().includes(searchTerm),
  )
  const pathname = usePathname()

  return (
    <div className="grid grid-rows-[auto_1fr] h-full overflow-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          className="w-full pl-8 pr-4 py-2 text-gray-700 bg-white border border-gray-300 focus:outline-none"
          placeholder="Enter a page title ..."
        />
        <MagnifyingGlass className="absolute left-3 top-3" />
      </div>
      <div className="divide-y divide-gray-300 overflow-auto">
        {searchResults.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p>No search results found.</p>
          </div>
        ) : (
          <>
            {searchResults.map((page) => (
              <Fragment key={page.path}>
                {pathname === null ? (
                  <Link
                    key={page.path}
                    href={page.path}
                    className="font-medium block px-8 py-2 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {page.title}
                  </Link>
                ) : (
                  <>
                    {pathname === page.path ? (
                      <button
                        onClick={props.close}
                        className="text-left w-full font-medium block px-8 py-2 hover:bg-gray-50 transition-colors duration-200"
                      >
                        {page.title}
                      </button>
                    ) : (
                      <Link
                        href={page.path}
                        className="font-medium block px-8 py-2 hover:bg-gray-50 transition-colors duration-200"
                      >
                        {page.title}
                      </Link>
                    )}
                  </>
                )}
              </Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export function GlobalSearchModal({
  isOpen,
  close,
  role,
}: {
  isOpen: boolean
  close: () => void
  role: UserRole
}) {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-white/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="shadow-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] grid grid-rows-[auto_1fr] h-80 rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            Page Search
          </Dialog.Title>
          <SearchForm close={close} role={role} />
          <Dialog.Close asChild>
            <button
              type="button"
              className="text-white absolute top-3 right-3"
              onClick={close}
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

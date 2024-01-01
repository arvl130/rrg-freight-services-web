import { useState } from "react"

export function usePaginatedItems<TItem>({
  initialPageSize = 10,
  initialPageNumber = 1,
  items,
}: {
  initialPageNumber?: number
  initialPageSize?: number
  items: TItem[]
}) {
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [pageNumber, setPageNumber] = useState(initialPageNumber)
  const pageCount = Math.ceil(items.length / pageSize)

  return {
    pageSize,
    pageNumber,
    pageCount,
    isOnFirstPage: pageNumber === 1,
    isOnLastPage: pageNumber === pageCount,
    paginatedItems: items.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize,
    ),
    gotoFirstPage: () => setPageNumber(1),
    gotoLastPage: () => setPageNumber(pageCount),
    gotoPreviousPage: () =>
      setPageNumber((currPageNumber) => currPageNumber - 1),
    gotoNextPage: () => setPageNumber((currPageNumber) => currPageNumber + 1),
    gotoPage: (pageNumber: number) => setPageNumber(pageNumber),
    updatePageSize: (newPageSize: number) => {
      setPageSize(newPageSize)
      setPageNumber(initialPageNumber)
    },
    resetPageNumber: () => setPageNumber(initialPageNumber),
  }
}

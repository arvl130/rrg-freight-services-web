"use client"

import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr/ArrowClockwise"
import { useRevalidatedPageBoundary } from "@/hooks/revalidated-page-boundary"

export function RefreshButton() {
  const { isPending, refresh } = useRevalidatedPageBoundary()

  return (
    <button
      type="button"
      disabled={isPending}
      className="bg-brand-cyan-500 disabled:bg-teal-100 text-white transition-colors h-10  flex justify-center items-center rounded-md px-2"
      onClick={refresh}
    >
      <span className="sr-only">Refresh</span>
      <ArrowClockwise size={24} className="mr-1" />
      <span>Refresh</span>
    </button>
  )
}

"use client"

import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr/ArrowClockwise"
import { useRevalidatedPageBoundary } from "@/hooks/revalidated-page-boundary"

export function RefreshButton() {
  const { isPending, refresh } = useRevalidatedPageBoundary()

  return (
    <button
      type="button"
      disabled={isPending}
      className="bg-brand-cyan-500 disabled:bg-teal-100 text-white transition-colors h-10 aspect-square flex justify-center items-center rounded-md"
      onClick={refresh}
    >
      <span className="sr-only">Refresh</span>
      <ArrowClockwise size={24} />
    </button>
  )
}

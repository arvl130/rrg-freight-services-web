"use client"

import { useRevalidatedPageBoundary } from "@/hooks/revalidated-page-boundary"
import { ReactNode } from "react"

export function RevalidatedPageBoundary(props: {
  children: ReactNode
  fallback: ReactNode
}) {
  const { isPending } = useRevalidatedPageBoundary()

  if (isPending) return <>{props.fallback}</>
  return <>{props.children}</>
}

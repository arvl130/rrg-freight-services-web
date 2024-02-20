"use client"

import { RevalidatedPageContext } from "@/providers/revalidated-page"
import { useContext } from "react"

export function useRevalidatedPageBoundary() {
  return useContext(RevalidatedPageContext)
}

"use client"

import type { ReactNode } from "react"
import { ApiProvider } from "./api"

export function Providers({ children }: { children: ReactNode }) {
  return <ApiProvider>{children}</ApiProvider>
}

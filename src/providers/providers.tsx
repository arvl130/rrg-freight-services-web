"use client"

import { ReactNode } from "react"
import { AuthProvider } from "./auth"
import { ApiProvider } from "./api"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ApiProvider>{children}</ApiProvider>
    </AuthProvider>
  )
}

import type { ReactNode } from "react"

export function Header({ children }: { children: ReactNode }) {
  return <div className="sm:flex justify-between mb-4">{children}</div>
}

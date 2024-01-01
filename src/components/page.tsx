import { ReactNode } from "react"

export function Header({ children }: { children: ReactNode }) {
  return <div className="flex justify-between mb-4">{children}</div>
}

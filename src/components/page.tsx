import { ReactNode } from "react"

export function Header({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-between mb-4">
      <h1 className="text-2xl font-black [color:_#00203F] mb-2">{children}</h1>
    </div>
  )
}

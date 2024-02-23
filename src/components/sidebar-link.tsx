import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export function SidebarLink({
  href,
  name,
  icon,
  otherRouteNames,
  isMinimized,
}: {
  href: string
  otherRouteNames?: string[]
  name: string
  isMinimized: boolean
  icon: ReactNode
}) {
  const pathname = usePathname()
  const matchingRouteNames = Array.isArray(otherRouteNames)
    ? [...new Set([href, ...otherRouteNames])]
    : [href]
  const hasActiveRoute =
    pathname === null ? false : matchingRouteNames.includes(pathname)

  return (
    <Link
      href={href}
      className={`
        grid ${
          isMinimized
            ? "grid-cols-[4rem] group-hover:grid-cols-[4rem_1fr]"
            : "grid-cols-[4rem_1fr]"
        } items-center
        h-10 w-full
        transition duration-200 font-semibold
        ${
          hasActiveRoute
            ? "[background-color:_#EFF8F8] [color:_#79CFDC]"
            : "text-white hover:bg-sky-200"
        }
      `}
    >
      <div className="flex justify-center items-center">{icon}</div>
      <span
        className={`whitespace-nowrap ${
          isMinimized ? "hidden group-hover:block" : ""
        }`}
      >
        {name}
      </span>
    </Link>
  )
}

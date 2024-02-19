import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

export function SidebarLink({
  href,
  name,
  icon,
  otherRouteNames,
}: {
  href: string
  otherRouteNames?: string[]
  name: string
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
        flex items-center
        gap-2 px-4 h-10 w-full
        transition duration-200 font-semibold
        ${
          hasActiveRoute
            ? "[background-color:_#EFF8F8] [color:_#79CFDC]"
            : "text-white hover:bg-sky-200"
        }
      `}
    >
      {icon}
      <span>{name}</span>
    </Link>
  )
}

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

export function SideBarLink({
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

  return (
    <Link
      href={href}
      className={`
        flex justify-center items-center h-10 w-full hover:bg-sky-200 transition duration-200
        ${
          pathname === null
            ? ""
            : `
                ${
                  matchingRouteNames.includes(pathname)
                    ? "border-x-2 border-l-white border-r-transparent"
                    : ""
                }
              `
        }
      `}
    >
      <span className="sr-only">{name}</span>
      {icon}
    </Link>
  )
}

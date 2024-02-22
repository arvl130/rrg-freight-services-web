import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export function AccordionLink({
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
        flex items-center gap-2 px-4 h-10 w-full transition duration-200 font-semibold
        ${
          pathname === null
            ? "text-white hover:[background-color:_#B5DCDC] hover:[color:_#5C929A]"
            : `
                ${
                  matchingRouteNames.includes(pathname)
                    ? "[background-color:_#B5DCDC] [color:_#5C929A]"
                    : "text-white hover:[background-color:_#B5DCDC] hover:[color:_#5C929A]"
                }
              `
        }
      `}
    >
      {icon}
      <span>{name}</span>
    </Link>
  )
}

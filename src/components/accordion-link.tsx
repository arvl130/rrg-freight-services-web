import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export function AccordionLink({
  href,
  name,
  icon,
  otherRouteNames,
  isMinimized,
}: {
  href: string
  otherRouteNames?: string[]
  name: string
  icon: ReactNode
  isMinimized: boolean
}) {
  const pathname = usePathname()
  const matchingRouteNames = Array.isArray(otherRouteNames)
    ? [...new Set([href, ...otherRouteNames])]
    : [href]

  return (
    <Link
      href={href}
      className={`
        grid ${
          isMinimized
            ? "grid-cols-[4rem] group-hover:grid-cols-[4rem_1fr]"
            : "grid-cols-[4rem_1fr]"
        } items-center h-10 w-full transition duration-200 font-semibold
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
      <div className="flex justify-center items-center">{icon}</div>
      <div
        className={`whitespace-nowrap ${
          isMinimized ? "hidden group-hover:block" : ""
        }`}
      >
        {name}
      </div>
    </Link>
  )
}

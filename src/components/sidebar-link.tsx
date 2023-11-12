import Link from "next/link"
import { useRouter } from "next/router"
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
  const router = useRouter()
  const matchingRouteNames = Array.isArray(otherRouteNames)
    ? [...new Set([href, ...otherRouteNames])]
    : [href]

  return (
    <Link
      href={href}
      className={`
        flex justify-center items-center h-10 w-full hover:bg-sky-200 transition duration-200
        ${
          matchingRouteNames.includes(router.pathname)
            ? "border-x-2 border-l-white border-r-transparent"
            : ""
        }
      `}
    >
      <span className="sr-only">{name}</span>
      {icon}
    </Link>
  )
}

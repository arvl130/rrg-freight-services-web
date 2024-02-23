"use client"

import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { AccordionTrigger } from "@radix-ui/react-accordion"

export function SidebarAccordionTrigger(props: {
  matchingRouteNames: string[]
  children: ReactNode
  isMinimized: boolean
  name: string
}) {
  const pathname = usePathname()
  const hasActiveRoute =
    pathname === null ? false : props.matchingRouteNames.includes(pathname)

  return (
    <AccordionTrigger
      className={`
        AccordionTrigger
        grid ${
          props.isMinimized
            ? "grid-cols-[4rem] group-hover:grid-cols-[4rem_1fr_2rem]"
            : "grid-cols-[4rem_1fr_2rem]"
        }
        h-10 w-full
        transition-colors duration-200 font-semibold
        ${
          hasActiveRoute
            ? "[background-color:_#EFF8F8] [color:_#79CFDC]"
            : "text-white hover:bg-sky-200"
        }
      `}
    >
      <div className="flex justify-center items-center">{props.children}</div>
      <div
        className={`items-center whitespace-nowrap ${
          props.isMinimized ? "hidden group-hover:flex" : "flex"
        }`}
      >
        {props.name}
      </div>
      <div
        className={`justify-center items-center ${
          props.isMinimized ? "hidden group-hover:flex" : "flex"
        }`}
      >
        <CaretRight
          className="AccordionChevron transition-transform"
          size={20}
        />
      </div>
    </AccordionTrigger>
  )
}

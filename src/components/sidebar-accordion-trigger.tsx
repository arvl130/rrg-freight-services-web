"use client"

import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { AccordionTrigger } from "@radix-ui/react-accordion"

export function SidebarAccordionTrigger(props: {
  matchingRouteNames: string[]
  children: ReactNode
}) {
  const pathname = usePathname()
  const hasActiveRoute =
    pathname === null ? false : props.matchingRouteNames.includes(pathname)

  return (
    <AccordionTrigger
      className={`
        AccordionTrigger
        flex justify-between items-center gap-2
        pl-4 pr-2 h-10 w-full
        transition-colors duration-200 font-semibold
        ${
          hasActiveRoute
            ? "[background-color:_#EFF8F8] [color:_#79CFDC]"
            : "text-white hover:bg-sky-200"
        }
      `}
    >
      <div className="flex gap-2 justify-between items-center">
        {props.children}
      </div>
      <CaretRight className="AccordionChevron transition-transform" size={20} />
    </AccordionTrigger>
  )
}

"use client"

import { Gauge } from "@phosphor-icons/react/dist/ssr/Gauge"
import { Package } from "@phosphor-icons/react/dist/ssr/Package"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import Image from "next/image"
import { useState, type ReactNode } from "react"
import { GenericHeader } from "@/components/generic-layout"
import * as Accordion from "@radix-ui/react-accordion"
import { SidebarLink } from "@/components/sidebar-link"
import { LogoutButton } from "@/components/logout-button"
import type { User } from "lucia"
import { Boat } from "@phosphor-icons/react/dist/ssr/Boat"

export function OverseasSideBar(props: { isMinimized: boolean }) {
  return (
    <div>
      <nav
        className={`
        group text-sm transition-all ${
          props.isMinimized ? "w-16 hover:w-64" : "w-64"
        } bg-brand-cyan-500 grid grid-rows-[6rem_1fr_auto] pb-3 h-dvh sticky top-0 bottom-0
      `}
      >
        <div className="grid grid-cols-[4rem_1fr] items-center w-full">
          <div className="flex justify-center">
            <Image
              src="/assets/img/logos/logo.jpg"
              alt="RRG Freight Services circle logo with white background"
              width={48}
              height={48}
            />
          </div>
          <div
            className={`whitespace-nowrap ${
              props.isMinimized ? "hidden group-hover:block" : ""
            } text-white font-bold text-xl pl-2`}
          >
            <p className="leading-none">RRG Freight</p>
            <p>Services</p>
          </div>
        </div>
        <div className="flex flex-col w-full overflow-auto">
          <Accordion.Root type="multiple">
            <SidebarLink
              isMinimized={props.isMinimized}
              icon={<Gauge size={32} />}
              name="Dashboard"
              href="/overseas/dashboard"
            />
            <SidebarLink
              isMinimized={props.isMinimized}
              icon={<Boat size={32} />}
              name="Shipments"
              href="/overseas/shipments"
            />
            <SidebarLink
              isMinimized={props.isMinimized}
              icon={<Package size={32} />}
              name="Packages"
              href="/overseas/packages"
            />
            <SidebarLink
              isMinimized={props.isMinimized}
              icon={<UserCircle size={32} />}
              name="Profile"
              href="/profile/settings"
              otherRouteNames={[
                "/profile/notifications",
                "/profile/change-password",
              ]}
            />
          </Accordion.Root>
        </div>
        <div className="w-full">
          <LogoutButton isMinimized={props.isMinimized} />
        </div>
      </nav>
    </div>
  )
}

export function OverseasLayout({
  title,
  children,
  user,
}: {
  title: string | string[]
  children: ReactNode
  user: User
}) {
  const titleContent = Array.isArray(title)
    ? `${title.toReversed().join(" \u2013 ")} \u2013 RRG Freight Services`
    : `${title} \u2013 RRG Freight Services`

  const [isLayoutMinimized, setIsLayoutMinimized] = useState(true)

  return (
    <>
      <title>{titleContent}</title>
      <div
        className={`transition-all grid ${
          isLayoutMinimized
            ? "grid-cols-[4rem_minmax(0,_1fr)]"
            : "grid-cols-[16rem_minmax(0,_1fr)]"
        }`}
      >
        <OverseasSideBar isMinimized={isLayoutMinimized} />
        <div className="bg-brand-cyan-100 px-6 py-4">
          <GenericHeader
            user={user}
            onToggleSidebar={() => {
              setIsLayoutMinimized((prev) => !prev)
            }}
          />
          <div>{children}</div>
        </div>
      </div>
    </>
  )
}

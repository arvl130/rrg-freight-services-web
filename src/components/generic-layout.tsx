"use client"

import { useSession } from "@/hooks/session"
import type { User } from "lucia"
import type { ReactNode } from "react"
import { useState } from "react"
import { AdminSideBar } from "@/app/admin/auth"
import { WarehouseSideBar } from "@/app/warehouse/auth"
import { DomesticSideBar } from "@/app/domestic/auth"
import { OverseasSideBar } from "@/app/overseas/auth"
import { List } from "@phosphor-icons/react/dist/ssr/List"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass"
import { Gear } from "@phosphor-icons/react/dist/ssr/Gear"
import { Bell } from "@phosphor-icons/react/dist/ssr/Bell"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import {Airplane} from "@phosphor-icons/react/dist/ssr/Airplane"
import {House} from "@phosphor-icons/react/dist/ssr/House"
import {Warehouse} from "@phosphor-icons/react/dist/ssr/Warehouse"
import {SteeringWheel} from "@phosphor-icons/react/dist/ssr/SteeringWheel"
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown"
import type { UserRole } from "@/utils/constants"
import { DriverSideBar } from "@/app/driver/auth"
import { GlobalSearchModal } from "@/components/global-search-modal"
import Link from "next/link"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Dialog from "@radix-ui/react-dialog"
export function SkeletonGenericLayout() {
  return (
    <div className="grid grid-cols-[4rem_minmax(0,_1fr)]">
      <nav className="bg-brand-cyan-500 h-dvh sticky top-0 bottom-0"></nav>
      <main className="bg-brand-cyan-100"></main>
    </div>
  )
}

function GenericSidebar(props: { isMinimized: boolean; role: UserRole }) {
  if (props.role === "ADMIN")
    return <AdminSideBar isMinimized={props.isMinimized} />
  if (props.role === "WAREHOUSE")
    return <WarehouseSideBar isMinimized={props.isMinimized} />
  if (props.role === "DOMESTIC_AGENT")
    return <DomesticSideBar isMinimized={props.isMinimized} />
  if (props.role === "OVERSEAS_AGENT")
    return <OverseasSideBar isMinimized={props.isMinimized} />
  if (props.role === "DRIVER")
    return <DriverSideBar isMinimized={props.isMinimized} />

  return <nav className="bg-brand-cyan-500 h-dvh sticky top-0 bottom-0"></nav>
}

export function GenericHeader({
  user,
  onToggleSidebar,
}: {
  user: User
  onToggleSidebar: () => void
}) {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false)

  return (
    <header className="flex flex-wrap gap-2 justify-between bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 mb-4">
      <div className="grid grid-cols-[auto_1fr] gap-3 w-56 rounded-md">
        <div className="flex items-center">
          <button type="button" onClick={onToggleSidebar}>
            <List size={24} />
          </button>
        </div>
        <button
          type="button"
          className="block text-sm px-4 py-2 text-gray-700 bg-white border border-gray-300"
          onClick={() => setIsOpenSearchModal(true)}
        >
          <MagnifyingGlass />
        </button>
      </div>
      <div className="flex items-center">
        <div className="flex flex-wrap gap-2 items-center text-gray-400">
          <Link
            href="/profile/settings"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            <Gear size={24} />
          </Link>
          <Link
            href="/profile/notifications"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            <Bell size={24} />
          </Link>

          {/* ADMINISTRATION */ }
          <Dialog.Root>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex flex-wrap gap-2 items-center text-gray-400 hover:text-gray-300 transition-colors duration-200">
          <UserCircle size={24} /> <span className="hidden sm:inline">{user.displayName}</span> <CaretDown size={12} /> </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content>
              <Dialog.Trigger>
                <DropdownMenu.Item className="flex flex-col items-center justify-center bg-white px-5 py-2 border-2 border-grey-100 rounded-lg hover:font-bold hover:bg-gray-200">SwitchUser</DropdownMenu.Item>
              </Dialog.Trigger>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <Dialog.Portal/> 
                <Dialog.Overlay className="bg-black/40 fixed inset-0">
                  <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)]  rounded-2xl bg-white 
                  no-border h-[400px] px-10 py-0 m-0 flex justify-center items-center">
                      <div className="flex justify-center items-center">
  <div className=""> 
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      <button className=" flex flex-col items-center justify-center border-4 text-black border-blue-700 hover:bg-blue-500 hover:text-white hover:font-bold py-2 px-4 rounded-lg cursor-pointer h-[150px] w-[200px]">
      <Airplane size={56} /><p>Overseas</p>
      </button>
      <button className="flex flex-col items-center justify-center border-4 text-black border-green-700 hover:bg-green-500 hover:text-white hover:font-bold py-2 px-4 rounded-lg cursor-pointer h-[150px]  w-[200px]">
      <Warehouse size={56} />Warehouse
      </button>
      <button className=" flex flex-col items-center justify-center border-4 text-black border-yellow-700 hover:bg-yellow-500 hover:text-white hover:font-bold py-2 px-4 rounded-lg cursor-pointer h-[150px]  w-[200px]">
      <House size={56} />Domestic
      </button>
      <button className=" flex flex-col items-center justify-center border-4 text-black border-red-700 hover:bg-red-400 hover:text-white hover:font-bold py-2 px-4 rounded-lg cursor-pointer h-[150px]  w-[200px]">
       <SteeringWheel size={56}  />Driver
      </button>
    </div>
  </div>
</div>
    
                      
                  </Dialog.Content>
                </Dialog.Overlay>
          </Dialog.Root>
        </div>
      </div>
      <GlobalSearchModal
        isOpen={isOpenSearchModal}
        close={() => setIsOpenSearchModal(false)}
      />
    </header>
  )
}

export function GenericLayout({
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
      <meta
        name="description"
        content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
      />
      <div
        className={`transition-all grid ${
          isLayoutMinimized
            ? "grid-cols-[4rem_minmax(0,_1fr)]"
            : "grid-cols-[16rem_minmax(0,_1fr)]"
        }`}
      >
        <GenericSidebar role={user.role} isMinimized={isLayoutMinimized} />
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

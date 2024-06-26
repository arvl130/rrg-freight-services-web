"use client"

import { Gauge } from "@phosphor-icons/react/dist/ssr/Gauge"
import { Package } from "@phosphor-icons/react/dist/ssr/Package"
import { Scroll } from "@phosphor-icons/react/dist/ssr/Scroll"
import { PencilLine } from "@phosphor-icons/react/dist/ssr/PencilLine"
import { Question } from "@phosphor-icons/react/dist/ssr/Question"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import { UsersThree } from "@phosphor-icons/react/dist/ssr/UsersThree"
import { Motorcycle } from "@phosphor-icons/react/dist/ssr/Motorcycle"
import { MapPinArea } from "@phosphor-icons/react/dist/ssr/MapPinArea"
import { ClipboardText } from "@phosphor-icons/react/dist/ssr/ClipboardText"
import { Boat } from "@phosphor-icons/react/dist/ssr/Boat"
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck"
import { Warehouse } from "@phosphor-icons/react/dist/ssr/Warehouse"
import { ChartDonut } from "@phosphor-icons/react/dist/ssr/ChartDonut"
import Image from "next/image"
import { useState, type ReactNode } from "react"
import { GenericHeader } from "@/components/generic-layout"
import * as Accordion from "@radix-ui/react-accordion"
import { File } from "@phosphor-icons/react/dist/ssr/File"
import { usePathname } from "next/navigation"
import { SidebarLink } from "@/components/sidebar-link"
import { AccordionLink } from "@/components/accordion-link"
import { LogoutButton } from "@/components/logout-button"
import { SidebarAccordionTrigger } from "@/components/sidebar-accordion-trigger"
import type { User } from "lucia"

function getDefaultValue(pathname: string) {
  if (["/admin/packages", "/admin/package-categories"].includes(pathname)) {
    return ["package-management"]
  }

  if (
    [
      "/admin/shipments/incoming",
      "/admin/shipments/delivery",
      "/admin/shipments/transfer/forwarder",
      "/admin/shipments/transfer/warehouse",
      "/admin/deliverable-provinces",
    ].includes(pathname)
  ) {
    return ["shipment-management"]
  }

  if (["/admin/vehicles", "/admin/warehouses"].includes(pathname)) {
    return ["asset-management"]
  }

  if (["/admin/logs"].includes(pathname)) {
    return ["record-management"]
  }

  return []
}

export function AdminSideBar(props: { isMinimized: boolean }) {
  const pathname = usePathname()
  const defaultValue = pathname === null ? [] : getDefaultValue(pathname)

  return (
    <div>
      <nav
        className={`
        group text-sm transition-all overflow-clip ${
          props.isMinimized ? "w-16 hover:w-64 hover:shadow-md" : "w-64"
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
        <div className="flex flex-col w-full overflow-x-clip overflow-y-auto">
          <Accordion.Root type="multiple" defaultValue={defaultValue}>
            <SidebarLink
              isMinimized={props.isMinimized}
              icon={<Gauge size={32} />}
              name="Dashboard"
              href="/admin/dashboard"
            />
            <Accordion.Item value="package-management">
              <Accordion.Header>
                <SidebarAccordionTrigger
                  isMinimized={props.isMinimized}
                  name="Package Management"
                  matchingRouteNames={[
                    "/admin/packages",
                    "/admin/package-categories",
                  ]}
                >
                  <Package size={32} />
                </SidebarAccordionTrigger>
              </Accordion.Header>
              <Accordion.Content className="[background-color:_#6BB6C1]">
                <AccordionLink
                  isMinimized={props.isMinimized}
                  icon={<Package size={32} />}
                  name="Packages"
                  href="/admin/packages"
                />
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="shipment-management">
              <Accordion.Header>
                <SidebarAccordionTrigger
                  isMinimized={props.isMinimized}
                  name="Shipment Management"
                  matchingRouteNames={[
                    "/admin/shipments/incoming",
                    "/admin/shipments/delivery",
                    "/admin/shipments/transfer/forwarder",
                    "/admin/shipments/transfer/warehouse",
                    "/admin/deliverable-provinces",
                  ]}
                >
                  <Boat size={32} />
                </SidebarAccordionTrigger>
              </Accordion.Header>
              <Accordion.Content className="[background-color:_#6BB6C1]">
                <AccordionLink
                  isMinimized={props.isMinimized}
                  icon={<Boat size={32} />}
                  name="Incoming"
                  href="/admin/shipments/incoming"
                />
                <AccordionLink
                  isMinimized={props.isMinimized}
                  icon={<Motorcycle size={32} />}
                  name="Deliveries"
                  href="/admin/shipments/delivery"
                />
                <AccordionLink
                  isMinimized={props.isMinimized}
                  icon={<ClipboardText size={32} />}
                  name="Forwarder Transfer"
                  href="/admin/shipments/transfer/forwarder"
                />
                <AccordionLink
                  isMinimized={props.isMinimized}
                  icon={<Warehouse size={32} />}
                  name="Warehouse Transfer"
                  href="/admin/shipments/transfer/warehouse"
                />
                <AccordionLink
                  isMinimized={props.isMinimized}
                  icon={<MapPinArea size={32} />}
                  name="Deliverable Provinces"
                  href="/admin/deliverable-provinces"
                />
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="asset-management">
              <Accordion.Header>
                <SidebarAccordionTrigger
                  isMinimized={props.isMinimized}
                  name="Asset Management"
                  matchingRouteNames={["/admin/vehicles", "/admin/warehouses"]}
                >
                  <ChartDonut size={32} />
                </SidebarAccordionTrigger>
              </Accordion.Header>
              <Accordion.Content className="[background-color:_#6BB6C1]">
                <AccordionLink
                  isMinimized={props.isMinimized}
                  icon={<Truck size={32} />}
                  name="Vehicles"
                  href="/admin/vehicles"
                />
                <AccordionLink
                  isMinimized={props.isMinimized}
                  icon={<Warehouse size={32} />}
                  name="Warehouses"
                  href="/admin/warehouses"
                />
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="record-management">
              <Accordion.Header>
                <SidebarAccordionTrigger
                  isMinimized={props.isMinimized}
                  name="Record Management"
                  matchingRouteNames={["/admin/logs"]}
                >
                  <File size={32} />
                </SidebarAccordionTrigger>
              </Accordion.Header>
              <Accordion.Content className="[background-color:_#6BB6C1]">
                <AccordionLink
                  isMinimized={props.isMinimized}
                  icon={<Scroll size={32} />}
                  name="Activity Logs"
                  href="/admin/logs"
                />
              </Accordion.Content>
              <Accordion.Content className="[background-color:_#6BB6C1]">
                <AccordionLink
                  isMinimized={props.isMinimized}
                  icon={<Question size={32} />}
                  name="Inquiries"
                  href="/admin/inquiries"
                />
              </Accordion.Content>
              <Accordion.Content className="[background-color:_#6BB6C1]">
                <AccordionLink
                  isMinimized={props.isMinimized}
                  icon={<PencilLine size={32} />}
                  name="Survey"
                  href="/admin/survey"
                />
              </Accordion.Content>
            </Accordion.Item>
            <SidebarLink
              icon={<UsersThree size={32} />}
              isMinimized={props.isMinimized}
              name="Users"
              href="/admin/users"
            />
            <SidebarLink
              icon={<UserCircle size={32} />}
              isMinimized={props.isMinimized}
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

export function AdminLayout({
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
        <AdminSideBar isMinimized={isLayoutMinimized} />
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

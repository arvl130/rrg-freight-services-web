"use client"

import { useSession } from "@/hooks/session"
import { Gauge } from "@phosphor-icons/react/dist/ssr/Gauge"
import { Package } from "@phosphor-icons/react/dist/ssr/Package"
import { Scroll } from "@phosphor-icons/react/dist/ssr/Scroll"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import { UsersThree } from "@phosphor-icons/react/dist/ssr/UsersThree"
import { Motorcycle } from "@phosphor-icons/react/dist/ssr/Motorcycle"
import { Toolbox } from "@phosphor-icons/react/dist/ssr/Toolbox"
import { ClipboardText } from "@phosphor-icons/react/dist/ssr/ClipboardText"
import { Boat } from "@phosphor-icons/react/dist/ssr/Boat"
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck"
import { Warehouse } from "@phosphor-icons/react/dist/ssr/Warehouse"
import { ChartDonut } from "@phosphor-icons/react/dist/ssr/ChartDonut"
import { User } from "firebase/auth"
import Image from "next/image"
import { ReactNode, useState } from "react"
import { LoginPageHead } from "@/app/login/login-page-head"
import { SkeletonLoginPage } from "@/app/login/skeleton-login-page"
import { GenericHeader, SkeletonGenericLayout } from "./generic"
import * as Accordion from "@radix-ui/react-accordion"
import { File } from "@phosphor-icons/react/dist/ssr/File"
import { usePathname } from "next/navigation"
import { SidebarLink } from "@/components/sidebar-link"
import { AccordionLink } from "@/components/accordion-link"
import { LogoutButton } from "@/components/logout-button"

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
    ].includes(pathname)
  ) {
    return ["shipment-management"]
  }

  if (["/admin/vehicles"].includes(pathname)) {
    return ["asset-management"]
  }

  if (["/admin/logs"].includes(pathname)) {
    return ["record-management"]
  }

  return []
}

export function AdminSideBar() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()
  const defaultValue = pathname === null ? [] : getDefaultValue(pathname)

  return (
    <nav className="bg-brand-cyan-500 grid grid-rows-[auto_1fr_auto] py-3 h-screen sticky top-0 bottom-0">
      <div className="flex justify-center items-center w-full mt-2 mb-5">
        <Image
          src="/assets/img/logos/logo-header.png"
          alt="RRG Freight Services circle logo with white background"
          width={160}
          height={58}
        />
      </div>
      <div className="flex flex-col w-full overflow-auto">
        <Accordion.Root type="multiple" defaultValue={defaultValue}>
          <SidebarLink
            icon={<Gauge size={24} />}
            name="Dashboard"
            href="/admin/dashboard"
          />
          <Accordion.Item value="package-management">
            <Accordion.Header
              className={`
                flex items-center
                gap-2 px-4 h-10 w-full
                transition-colors duration-200 font-semibold
                ${
                  pathname === null
                    ? "text-white hover:[background-color:_#EFF8F8] hover:[color:_#79CFDC]"
                    : `${
                        [
                          "/admin/packages",
                          "/admin/package-categories",
                        ].includes(pathname)
                          ? "[background-color:_#EFF8F8] [color:_#79CFDC]"
                          : "text-white hover:[background-color:_#EFF8F8] hover:[color:_#79CFDC]"
                      }`
                }
              `}
            >
              <Package size={24} />
              <Accordion.Trigger>Package Management</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="[background-color:_#6BB6C1]">
              <AccordionLink
                icon={<Package size={24} />}
                name="Packages"
                href="/admin/packages"
              />
              <AccordionLink
                icon={<Toolbox size={24} />}
                name="Packages Categories"
                href="/admin/package-categories"
              />
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="shipment-management">
            <Accordion.Header
              className={`
                flex items-center
                gap-2 px-4 h-10 w-full
                transition-colors duration-200 font-semibold
                ${
                  pathname === null
                    ? "text-white hover:[background-color:_#EFF8F8] hover:[color:_#79CFDC]"
                    : `${
                        [
                          "/admin/shipments/incoming",
                          "/admin/shipments/delivery",
                          "/admin/shipments/transfer/forwarder",
                          "/admin/shipments/transfer/warehouse",
                        ].includes(pathname)
                          ? "[background-color:_#EFF8F8] [color:_#79CFDC]"
                          : "text-white hover:[background-color:_#EFF8F8] hover:[color:_#79CFDC]"
                      }`
                }
              `}
            >
              <Boat size={24} />
              <Accordion.Trigger>Shipment Management</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="[background-color:_#6BB6C1]">
              <AccordionLink
                icon={<Boat size={24} />}
                name="Incoming"
                href="/admin/shipments/incoming"
              />
              <AccordionLink
                icon={<Motorcycle size={24} />}
                name="Deliveries"
                href="/admin/shipments/delivery"
              />
              <AccordionLink
                icon={<ClipboardText size={24} />}
                name="Forwarder Transfer"
                href="/admin/shipments/transfer/forwarder"
              />
              <AccordionLink
                icon={<Warehouse size={24} />}
                name="Warehouse Transfer"
                href="/admin/shipments/transfer/warehouse"
              />
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="asset-management">
            <Accordion.Header
              className={`
                flex items-center
                gap-2 px-4 h-10 w-full
                transition-colors duration-200 font-semibold
                ${
                  pathname === null
                    ? "text-white hover:[background-color:_#EFF8F8] hover:[color:_#79CFDC]"
                    : `${
                        ["/admin/vehicles"].includes(pathname)
                          ? "[background-color:_#EFF8F8] [color:_#79CFDC]"
                          : "text-white hover:[background-color:_#EFF8F8] hover:[color:_#79CFDC]"
                      }`
                }
              `}
            >
              <ChartDonut size={24} />
              <Accordion.Trigger>Asset Management</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="[background-color:_#6BB6C1]">
              <AccordionLink
                icon={<Truck size={24} />}
                name="Vehicles"
                href="/admin/vehicles"
              />
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="record-management">
            <Accordion.Header
              className={`
                flex items-center
                gap-2 px-4 h-10 w-full
                transition-colors duration-200 font-semibold
                ${
                  pathname === null
                    ? "text-white hover:[background-color:_#EFF8F8] hover:[color:_#79CFDC]"
                    : `${
                        ["/admin/logs"].includes(pathname)
                          ? "[background-color:_#EFF8F8] [color:_#79CFDC]"
                          : "text-white hover:[background-color:_#EFF8F8] hover:[color:_#79CFDC]"
                      }`
                }
              `}
            >
              <File size={24} />
              <Accordion.Trigger>Record Management</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="[background-color:_#6BB6C1]">
              <AccordionLink
                icon={<Scroll size={24} />}
                name="Activity Logs"
                href="/admin/logs"
              />
            </Accordion.Content>
          </Accordion.Item>
          <SidebarLink
            icon={<UsersThree size={24} />}
            name="Users"
            href="/admin/users"
          />
          <SidebarLink
            icon={<UserCircle size={24} />}
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
        <LogoutButton />
      </div>
    </nav>
  )
}

type WithFunctionChildren = {
  hasSession: true
  children: ({
    user,
    role,
  }: {
    user: User
    role: "ADMIN"
    reload: () => Promise<void>
  }) => ReactNode
}

type WithNodeChildren = {
  hasSession?: false
  children?: ReactNode
}

type LayoutProps = {
  title: string | string[]
} & (WithFunctionChildren | WithNodeChildren)

export function AdminLayout({ title, children }: LayoutProps) {
  const titleContent = Array.isArray(title)
    ? `${title.toReversed().join(" \u2013 ")} \u2013 RRG Freight Services`
    : `${title} \u2013 RRG Freight Services`

  const { isLoading, user, role, reload } = useSession({
    required: {
      role: "ADMIN",
    },
  })

  if (isLoading)
    return (
      <>
        <title>RRG Freight Services</title>
        <meta
          name="description"
          content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
        />
        <main className="min-h-screen bg-brand-cyan-100"></main>
      </>
    )

  if (user === null)
    return (
      <>
        <LoginPageHead />
        <SkeletonLoginPage />
      </>
    )

  if (role !== "ADMIN")
    return (
      <>
        <title>Dashboard &#x2013; RRG Freight Services</title>
        <meta
          name="description"
          content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
        />
        <SkeletonGenericLayout />
      </>
    )

  return (
    <>
      <title>{titleContent}</title>
      <meta
        name="description"
        content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
      />
      <div className="grid grid-cols-[16rem_minmax(0,_1fr)]">
        <AdminSideBar />
        <div className="bg-brand-cyan-100 px-6 py-4">
          <GenericHeader user={user} />
          <div>
            {typeof children === "function" ? (
              <>
                {/* When `children` is of type function, we can assume
                    `hasSession` is also defined, so let's provide the
                    session information.
                */}
                {children({
                  user,
                  role,
                  reload,
                })}
              </>
            ) : (
              <>
                {/* When `children` is not of type function, `hasSession`
                    is not defined, so don't provide any session information.
                */}
                {children}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

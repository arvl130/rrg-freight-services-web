import { useSession } from "@/hooks/session"
import { Gauge } from "@phosphor-icons/react/dist/ssr/Gauge"
import { Package } from "@phosphor-icons/react/dist/ssr/Package"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import { QrCode } from "@phosphor-icons/react/dist/ssr/QrCode"
import type { User } from "firebase/auth"
import Image from "next/image"
import type { ReactNode } from "react"
import { LoginPageHead } from "@/app/login/login-page-head"
import { SkeletonLoginPage } from "@/app/login/skeleton-login-page"
import { SidebarLink } from "@/components/sidebar-link"
import { GenericHeader, SkeletonGenericLayout } from "./generic"
import * as Accordion from "@radix-ui/react-accordion"
import { LogoutButton } from "@/components/logout-button"

export function WarehouseSideBar() {
  return (
    <nav className="text-sm bg-brand-cyan-500 grid grid-rows-[auto_1fr_auto] py-3 h-screen sticky top-0 bottom-0">
      <div className="flex justify-center items-center w-full mt-2 mb-5">
        <Image
          src="/assets/img/logos/logo-header.png"
          alt="RRG Freight Services circle logo with white background"
          width={160}
          height={58}
        />
      </div>
      <div className="flex flex-col w-full overflow-auto">
        <Accordion.Root type="multiple">
          <SidebarLink
            icon={<Gauge size={24} />}
            name="Dashboard"
            href="/warehouse/dashboard"
          />
          <SidebarLink
            icon={<Package size={24} />}
            name="Packages"
            href="/warehouse/packages"
          />
          <SidebarLink
            icon={<QrCode size={24} />}
            name="Scan Package"
            href="/warehouse/packages/scan"
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
    role: "WAREHOUSE"
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

export function WarehouseLayout({ title, children }: LayoutProps) {
  const titleContent = Array.isArray(title)
    ? `${title.toReversed().join(" \u2013 ")} \u2013 RRG Freight Services`
    : `${title} \u2013 RRG Freight Services`

  const { isLoading, user, role, reload } = useSession({
    required: {
      role: "WAREHOUSE",
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

  if (role !== "WAREHOUSE")
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
        <WarehouseSideBar />
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

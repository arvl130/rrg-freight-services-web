"use client"

import { useSession } from "@/utils/auth"
import { Gauge } from "@phosphor-icons/react/Gauge"
import { Package } from "@phosphor-icons/react/Package"
import { Scroll } from "@phosphor-icons/react/Scroll"
import { SignOut } from "@phosphor-icons/react/SignOut"
import { UserCircle } from "@phosphor-icons/react/UserCircle"
import { UsersThree } from "@phosphor-icons/react/UsersThree"
import { Motorcycle } from "@phosphor-icons/react/Motorcycle"
import { Toolbox } from "@phosphor-icons/react/Toolbox"
import { ClipboardText } from "@phosphor-icons/react/ClipboardText"
import { Boat } from "@phosphor-icons/react/Boat"
import { Truck } from "@phosphor-icons/react/Truck"
import { Warehouse } from "@phosphor-icons/react/Warehouse"
import { User, getAuth, signOut } from "firebase/auth"
import Head from "next/head"
import Image from "next/image"
import { ReactNode, useState } from "react"
import { LoginPageHead } from "@/app/login/login-page-head"
import { SkeletonLoginPage } from "@/app/login/skeleton-login-page"
import { SideBarLink } from "@/components/sidebar-link"
import { GenericHeader, SkeletonGenericLayout } from "./generic"

export function AdminSideBar() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <nav className="bg-brand-cyan-500 flex flex-col justify-between items-center py-3 h-screen sticky top-0 bottom-0">
      <div className="flex justify-center items-center h-10 w-full my-2">
        <Image
          src="/assets/img/logos/logo-white-bg.png"
          alt="RRG Freight Services circle logo with white background"
          height={60}
          width={60}
          className="w-12 h-12 rounded-full"
        />
      </div>
      <div className="flex flex-col items-center gap-2 w-full">
        <SideBarLink
          name="Dashboard"
          href="/admin/dashboard"
          icon={<Gauge size={32} className="text-white " />}
        />
        <SideBarLink
          name="Packages"
          href="/admin/packages"
          icon={<Package size={32} className="text-white" />}
        />
        <SideBarLink
          name="Packages Categories"
          href="/admin/package-categories"
          icon={<Toolbox size={32} className="text-white" />}
        />
        <SideBarLink
          name="Incoming Shipments"
          href="/admin/shipments/incoming"
          icon={<Boat size={32} className="text-white" />}
        />
        <SideBarLink
          name="Forwarder Transfer Shipments"
          href="/admin/shipments/transfer/forwarder"
          icon={<ClipboardText size={32} className="text-white" />}
        />
        <SideBarLink
          name="Warehouse Transfer Shipments"
          href="/admin/shipments/transfer/warehouse"
          icon={<Warehouse size={32} className="text-white" />}
        />
        <SideBarLink
          name="Deliveries"
          href="/admin/shipments/delivery"
          icon={<Motorcycle size={32} className="text-white" />}
        />
        <SideBarLink
          name="Vehicles"
          href="/admin/vehicles"
          icon={<Truck size={32} className="text-white" />}
        />
        <SideBarLink
          name="Users"
          href="/admin/users"
          icon={<UsersThree size={32} className="text-white" />}
        />
        <SideBarLink
          name="Logs"
          href="/admin/logs"
          icon={<Scroll size={32} className="text-white" />}
        />
        <SideBarLink
          name="Profile"
          href="/profile/settings"
          otherRouteNames={[
            "/profile/notifications",
            "/profile/change-password",
          ]}
          icon={<UserCircle size={32} className="text-white" />}
        />
      </div>
      <div className="w-full">
        <button
          type="button"
          className="flex justify-center items-center h-10 w-full hover:bg-sky-200 transition duration-200"
          disabled={isSigningOut}
          onClick={async () => {
            setIsSigningOut(true)
            try {
              const auth = getAuth()
              await signOut(auth)
            } finally {
              setIsSigningOut(false)
            }
          }}
        >
          <span className="sr-only">Logout</span>
          <SignOut
            size={32}
            className={isSigningOut ? "text-sky-200" : "text-white"}
          />
        </button>
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
        <Head>
          <title>RRG Freight Services</title>
          <meta
            name="description"
            content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
          />
        </Head>
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
        <Head>
          <title>Dashboard &#x2013; RRG Freight Services</title>
          <meta
            name="description"
            content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
          />
        </Head>
        <SkeletonGenericLayout />
      </>
    )

  return (
    <>
      <Head>
        <title>{titleContent}</title>
        <meta
          name="description"
          content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
        />
      </Head>
      <div className="grid grid-cols-[4rem_minmax(0,_1fr)]">
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

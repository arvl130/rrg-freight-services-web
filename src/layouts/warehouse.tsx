import { useSession } from "@/utils/auth"
import { Bell } from "@phosphor-icons/react/Bell"
import { CaretDown } from "@phosphor-icons/react/CaretDown"
import { Gauge } from "@phosphor-icons/react/Gauge"
import { Gear } from "@phosphor-icons/react/Gear"
import { List } from "@phosphor-icons/react/List"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { Package } from "@phosphor-icons/react/Package"
import { SignOut } from "@phosphor-icons/react/SignOut"
import { UserCircle } from "@phosphor-icons/react/UserCircle"
import { ClipboardText } from "@phosphor-icons/react/ClipboardText"
import { QrCode } from "@phosphor-icons/react/QrCode"
import { User, getAuth, signOut } from "firebase/auth"
import Head from "next/head"
import Image from "next/image"
import { ReactNode, useState } from "react"
import { LoginPageHead, SkeletonLoginPage } from "@/pages/login"
import { SkeletonAdminLayout } from "./admin"
import { SideBarLink } from "@/components/sidebar-link"

export function WarehouseSideBar() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <nav className="bg-brand-cyan-500 flex flex-col justify-between items-center py-3 h-screen sticky top-0 bottom-0">
      <div className="flex flex-col items-center gap-3 w-full">
        <Image
          src="/assets/img/logos/logo-white-bg.png"
          alt="RRG Freight Services circle logo with white background"
          height={60}
          width={60}
          className="w-12 h-12 rounded-full"
        />
        <SideBarLink
          name="Dashboard"
          href="/warehouse/dashboard"
          icon={<Gauge size={32} className="text-white " />}
        />
        <SideBarLink
          name="Packages"
          href="/warehouse/packages"
          icon={<Package size={32} className="text-white" />}
        />
        <SideBarLink
          name="Scan"
          href="/warehouse/packages/scan"
          icon={<QrCode size={32} className="text-white" />}
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

function WarehouseHeader({ user }: { user: User }) {
  return (
    <header className="flex justify-between bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 mb-4">
      <div className="flex items-center gap-3 rounded-md">
        <div>
          <List size={24} />
        </div>
        <div className="relative">
          <input
            type="text"
            className="text-sm w-full pl-8 pr-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          />
          <MagnifyingGlass className="absolute left-3 top-3" />
        </div>
      </div>
      <div className="flex">
        <div className="px-2 flex text-gray-400">
          <button type="button" className="px-2">
            <Gear size={24} />
          </button>
          <button type="button" className="px-2">
            <Bell size={24} />
          </button>
          <button
            type="button"
            className="px-2 py-2 whitespace-nowrap flex gap-2 items-center text-sm w-40 text-gray-700"
          >
            {user.photoURL === null ? (
              <UserCircle size={24} />
            ) : (
              <Image
                height={24}
                width={24}
                alt="Profile picture"
                src={user.photoURL}
                className="rounded-full h-6"
              />
            )}
            <div className="flex items-center gap-2">
              <span>{user.displayName}</span>
              <CaretDown size={12} />
            </div>
          </button>
        </div>
      </div>
    </header>
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
    ? // Our deployment platform only supports Node v18.
      // Use this method for now, until they support Node v20
      // where toReversed() is available.
      `${[...title].reverse().join(" \u2013 ")} \u2013 RRG Freight Services`
    : `${title} \u2013 RRG Freight Services`

  const { isLoading, user, role, reload } = useSession({
    required: {
      role: "WAREHOUSE",
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

  // FIXME: Either use a unified skeleton component in here,
  // or show a skeleton component based on the detected role.
  if (role !== "WAREHOUSE")
    return (
      <>
        <Head>
          <title>Dashboard &#x2013; RRG Freight Services</title>
          <meta
            name="description"
            content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
          />
        </Head>
        <SkeletonAdminLayout />
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
        <WarehouseSideBar />
        <div className="bg-brand-cyan-100 px-6 py-4">
          <WarehouseHeader user={user} />
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

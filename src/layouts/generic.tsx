import { useSession } from "@/hooks/session"
import type { User } from "firebase/auth"
import type { ReactNode } from "react"
import { useState } from "react"
import { AdminSideBar } from "./admin"
import { WarehouseSideBar } from "./warehouse"
import { DomesticSideBar } from "./domestic"
import { OverseasSideBar } from "./overseas"
import { List } from "@phosphor-icons/react/dist/ssr/List"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass"
import { Gear } from "@phosphor-icons/react/dist/ssr/Gear"
import { Bell } from "@phosphor-icons/react/dist/ssr/Bell"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown"
import type { UserRole } from "@/utils/constants"
import Image from "next/image"
import { LoginPageHead } from "@/app/login/login-page-head"
import { SkeletonLoginPage } from "@/app/login/skeleton-login-page"
import { DriverSideBar } from "@/app/driver/auth"
import { GlobalSearchModal } from "@/components/global-search-modal"
import Link from "next/link"

export function SkeletonGenericLayout() {
  return (
    <div className="grid grid-cols-[4rem_minmax(0,_1fr)]">
      <nav className="bg-brand-cyan-500 h-screen sticky top-0 bottom-0"></nav>
      <main className="bg-brand-cyan-100"></main>
    </div>
  )
}

function GenericSidebar(props: { isMinimized: boolean }) {
  const { role } = useSession()

  if (role === "ADMIN") return <AdminSideBar isMinimized={props.isMinimized} />
  if (role === "WAREHOUSE")
    return <WarehouseSideBar isMinimized={props.isMinimized} />
  if (role === "DOMESTIC_AGENT")
    return <DomesticSideBar isMinimized={props.isMinimized} />
  if (role === "OVERSEAS_AGENT")
    return <OverseasSideBar isMinimized={props.isMinimized} />
  if (role === "DRIVER")
    return <DriverSideBar isMinimized={props.isMinimized} />

  return (
    <nav className="bg-brand-cyan-500 h-screen sticky top-0 bottom-0"></nav>
  )
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
          <Link
            href="/profile/settings"
            className="col-span-2 whitespace-nowrap flex gap-2 items-center text-sm text-gray-700 hover:text-gray-400 transition-colors duration-200"
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
              <span className="hidden sm:inline">{user.displayName}</span>
              <CaretDown size={12} />
            </div>
          </Link>
        </div>
      </div>

      <GlobalSearchModal
        isOpen={isOpenSearchModal}
        close={() => setIsOpenSearchModal(false)}
      />
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
    role: UserRole | null
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

export function GenericLayout({ title, children }: LayoutProps) {
  const titleContent = Array.isArray(title)
    ? `${title.toReversed().join(" \u2013 ")} \u2013 RRG Freight Services`
    : `${title} \u2013 RRG Freight Services`

  const { isLoading, user, role, reload } = useSession({
    required: true,
  })

  const [isLayoutMinimized, setIsLayoutMinimized] = useState(true)

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
        <GenericSidebar isMinimized={isLayoutMinimized} />
        <div className="bg-brand-cyan-100 px-6 py-4">
          <GenericHeader
            user={user}
            onToggleSidebar={() => {
              setIsLayoutMinimized((prev) => !prev)
            }}
          />
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

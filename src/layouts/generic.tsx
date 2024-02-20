import { useSession } from "@/hooks/session"
import { User } from "firebase/auth"
import { ReactNode, useState } from "react"
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
import { UserRole } from "@/utils/constants"
import Image from "next/image"
import { LoginPageHead } from "@/app/login/login-page-head"
import { SkeletonLoginPage } from "@/app/login/skeleton-login-page"
import { DriverSideBar } from "@/app/driver/auth"
import { GlobalSearchModal } from "@/components/global-search-modal"

export function SkeletonGenericLayout() {
  return (
    <div className="grid grid-cols-[16rem_minmax(0,_1fr)]">
      <nav className="bg-brand-cyan-500 h-screen sticky top-0 bottom-0"></nav>
      <main className="bg-brand-cyan-100"></main>
    </div>
  )
}

function GenericSidebar() {
  const { role } = useSession()

  if (role === "ADMIN") return <AdminSideBar />
  if (role === "WAREHOUSE") return <WarehouseSideBar />
  if (role === "DOMESTIC_AGENT") return <DomesticSideBar />
  if (role === "OVERSEAS_AGENT") return <OverseasSideBar />
  if (role === "DRIVER") return <DriverSideBar />

  return (
    <nav className="bg-brand-cyan-500 h-screen sticky top-0 bottom-0"></nav>
  )
}

export function GenericHeader({ user }: { user: User }) {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false)

  return (
    <header className="flex justify-between bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 mb-4">
      <div className="flex items-center gap-3 rounded-md">
        <div>
          <List size={24} />
        </div>
        <div>
          <button
            type="button"
            className="block text-sm w-56 px-4 py-2 text-gray-700 bg-white border border-gray-300"
            onClick={() => setIsOpenSearchModal(true)}
          >
            <MagnifyingGlass />
          </button>
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
      <div className="grid grid-cols-[16rem_minmax(0,_1fr)]">
        <GenericSidebar />
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

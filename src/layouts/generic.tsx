import { useSession } from "@/utils/auth"
import { User } from "firebase/auth"
import Head from "next/head"
import { ReactNode } from "react"
import { AdminSideBar } from "./admin"
import { WarehouseSideBar } from "./warehouse"
import { DomesticSideBar } from "./domestic"
import { OverseasSideBar } from "./overseas"
import { List } from "@phosphor-icons/react/List"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { Gear } from "@phosphor-icons/react/Gear"
import { Bell } from "@phosphor-icons/react/Bell"
import { UserCircle } from "@phosphor-icons/react/UserCircle"
import { CaretDown } from "@phosphor-icons/react/CaretDown"
import { UserRole } from "@/utils/constants"
import Image from "next/image"
import { LoginPageHead, SkeletonLoginPage } from "@/pages/login"

export function SkeletonGenericLayout() {
  return (
    <div className="grid grid-cols-[4rem_minmax(0,_1fr)]">
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

  return (
    <nav className="bg-brand-cyan-500 h-screen sticky top-0 bottom-0"></nav>
  )
}

export function GenericHeader({ user }: { user: User }) {
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
    ? // Our deployment platform only supports Node v18.
      // Use this method for now, until they support Node v20
      // where toReversed() is available.
      `${[...title].reverse().join(" \u2013 ")} \u2013 RRG Freight Services`
    : `${title} \u2013 RRG Freight Services`

  const { isLoading, user, role, reload } = useSession({
    required: true,
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

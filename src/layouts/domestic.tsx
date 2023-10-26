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
import { getAuth, signOut, User } from "firebase/auth"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useState } from "react"

function SideBarLink({
  href,
  name,
  icon,
}: {
  href: string
  name: string
  icon: ReactNode
}) {
  const router = useRouter()

  return (
    <Link
      href={href}
      className={`
flex justify-center items-center h-10 w-full hover:bg-sky-200 transition duration-200
${
  router.pathname === href
    ? "border-x-2 border-l-white border-r-transparent"
    : ""
}
`}
    >
      <span className="sr-only">{name}</span>
      {icon}
    </Link>
  )
}

export function DomesticSideBar() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <nav className="bg-brand-cyan-500 flex flex-col justify-between items-center py-3 h-screen sticky top-0 bottom-0">
      <div>
        <Image
          src="/assets/img/logos/logo-white-bg.png"
          alt="RRG Freight Services circle logo with white background"
          height={60}
          width={60}
          className="w-12 h-12 rounded-full"
        />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <SideBarLink
          name="Dashboard"
          href="/domestic/dashboard"
          icon={<Gauge size={32} className="text-white " />}
        />
        <SideBarLink
          name="Packages"
          href="/domestic/packages"
          icon={<Package size={32} className="text-white" />}
        />
        <SideBarLink
          name="Shipments"
          href="/domestic/shipments"
          icon={<ClipboardText size={32} className="text-white" />}
        />
        <SideBarLink
          name="Profile"
          href="/profile/settings"
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

export function SkeletonDomesticLayout() {
  return (
    <div className="grid grid-cols-[4rem_minmax(0,_1fr)]">
      <nav className="bg-brand-cyan-500 h-screen sticky top-0 bottom-0"></nav>
      <main className="bg-brand-cyan-100"></main>
    </div>
  )
}

export function DomesticLayout({
  title,
  children,
}: {
  title: string
  children: ({ user, role }: { user: User; role: "DOMESTIC_AGENT" }) => ReactNode
}) {
  const { isLoading, user, role } = useSession({
    required: {
      role: "DOMESTIC_AGENT",
    },
  })

  // FIXME: Show skeleton for the login page in here.
  if (isLoading || user === null)
    return <main className="min-h-screen bg-brand-cyan-100"></main>

  // FIXME: Either use a unified skeleton component in here,
  // or show a skeleton component based on the detected role.
  if (role !== "DOMESTIC_AGENT") return <SkeletonDomesticLayout />
  return (
    <>
      <Head>
        <title>{title} &#x2013; RRG Freight Services</title>
        <meta
          name="description"
          content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
        />
      </Head>
      <div className="grid grid-cols-[4rem_minmax(0,_1fr)]">
        <DomesticSideBar />
        <div className="bg-brand-cyan-100 px-6 py-4">
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
              <select className="block text-sm font-medium pl-8 pr-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring">
                <option value="en-US">English</option>
              </select>
              <div className="px-2 flex text-gray-400">
                <button type="button" className="px-2">
                  <Gear size={24} />
                </button>
                <button type="button" className="px-2">
                  <Bell size={24} />
                </button>
                <button
                  type="button"
                  className="px-2 py-2 whitespace-nowrap flex gap-2 items-center text-sm w-46 text-gray-700"
                >
                  <UserCircle size={24} />
                  <div className="flex items-center gap-2">
                    <span>{user?.displayName}</span>
                    <CaretDown size={12} />
                  </div>
                </button>
              </div>
            </div>
          </header>
          <div>
            {children({
            user,
            role,
          })}
          </div>
        </div>
      </div>
    </>
  )
}

import { useSession } from "@/utils/auth"
import { Gauge } from "@phosphor-icons/react/Gauge"
import { Package } from "@phosphor-icons/react/Package"
import { SignOut } from "@phosphor-icons/react/SignOut"
import { UserCircle } from "@phosphor-icons/react/UserCircle"
import { Truck } from "@phosphor-icons/react/Truck"
import { getAuth, signOut, User } from "firebase/auth"
import Head from "next/head"
import Image from "next/image"
import { ReactNode, useState } from "react"
import { SideBarLink } from "@/components/sidebar-link"
import { AdminHeader, SkeletonAdminLayout } from "./admin"
import { LoginPageHead, SkeletonLoginPage } from "@/pages/login"

export function DomesticSideBar() {
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
          href="/domestic/transfer-shipments"
          icon={<Truck size={32} className="text-white" />}
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

type WithFunctionChildren = {
  hasSession: true
  children: ({
    user,
    role,
  }: {
    user: User
    role: "DOMESTIC_AGENT"
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

export function DomesticLayout({ title, children }: LayoutProps) {
  const titleContent = Array.isArray(title)
    ? // Our deployment platform only supports Node v18.
      // Use this method for now, until they support Node v20
      // where toReversed() is available.
      `${[...title].reverse().join(" \u2013 ")} \u2013 RRG Freight Services`
    : `${title} \u2013 RRG Freight Services`

  const { isLoading, user, role, reload } = useSession({
    required: {
      role: "DOMESTIC_AGENT",
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
  if (role !== "DOMESTIC_AGENT")
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
        <DomesticSideBar />
        <div className="bg-brand-cyan-100 px-6 py-4">
          <AdminHeader user={user} />
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

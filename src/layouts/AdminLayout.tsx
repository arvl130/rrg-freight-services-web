import {
  Gauge,
  Package,
  Scroll,
  SignOut,
  UsersThree,
} from "@phosphor-icons/react"
import { getAuth, signOut } from "firebase/auth"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useState } from "react"

export function AdminLayout({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <>
      <Head>
        <title>{title} &#x2013; RRG Freight Services</title>
        <meta
          name="description"
          content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
        />
      </Head>
      <div className="grid grid-cols-[4rem_minmax(0,_1fr)] min-h-screen">
        <div className="bg-brand-cyan-500 flex flex-col justify-between items-center py-3">
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
            <Link
              href="/admin"
              className={`
                flex justify-center items-center h-10 w-full hover:bg-sky-200 transition duration-200
                ${
                  router.pathname === "/admin"
                    ? "border-x-2 border-l-white border-r-transparent"
                    : ""
                }
              `}
            >
              <span className="sr-only">Dashboard</span>
              <Gauge size={32} className="text-white " />
            </Link>
            <Link
              href="/admin/packages"
              className={`
                flex justify-center items-center h-10 w-full hover:bg-sky-200 transition duration-200
                ${
                  router.pathname === "/admin/packages"
                    ? "border-x-2 border-l-white border-r-transparent"
                    : ""
                }
              `}
            >
              <span className="sr-only">Packages</span>
              <Package size={32} className="text-white" />
            </Link>
            <Link
              href="/admin/users"
              className={`
                flex justify-center items-center h-10 w-full hover:bg-sky-200 transition duration-200
                ${
                  router.pathname === "/admin/users"
                    ? "border-x-2 border-l-white border-r-transparent"
                    : ""
                }
              `}
            >
              <span className="sr-only">Users</span>
              <UsersThree size={32} className="text-white" />
            </Link>
            <Link
              href="/admin/logs"
              className={`
                flex justify-center items-center h-10 w-full hover:bg-sky-200 transition duration-200
                ${
                  router.pathname === "/admin/logs"
                    ? "border-x-2 border-l-white border-r-transparent"
                    : ""
                }
              `}
            >
              <span className="sr-only">Logs</span>
              <Scroll size={32} className="text-white" />
            </Link>
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
        </div>
        <div className="bg-brand-cyan-100 px-4 py-2">{children}</div>
      </div>
    </>
  )
}

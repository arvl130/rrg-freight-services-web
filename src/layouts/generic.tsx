import { useSession } from "@/utils/auth"
import { User } from "firebase/auth"
import Head from "next/head"
import { ReactNode } from "react"
import { AdminSideBar } from "./admin"
import { WarehouseSideBar } from "./warehouse"
import { DomesticSideBar } from "./domestic"
import { OverseasSideBar } from "./overseas"
import { Role } from "@/utils/constants"

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

export function GenericLayout({
  title,
  children,
}: {
  title: string
  children: ({ user, role }: { user: User; role: Role | null }) => ReactNode
}) {
  const { isLoading, user, role } = useSession({
    required: true,
  })

  if (isLoading || user === null)
    return <main className="min-h-screen bg-brand-cyan-100"></main>

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
        <GenericSidebar />
        <div className="bg-brand-cyan-100 px-6 py-4">
          {children({
            user,
            role,
          })}
        </div>
      </div>
    </>
  )
}

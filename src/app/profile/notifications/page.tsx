import { GenericLayout } from "@/components/generic-layout"
import { SideNav } from "../sidenav"
import { validateSessionWithCookies } from "@/server/auth"
import { RightColumn } from "./main-section"
import { redirect } from "next/navigation"

export default async function ProfileNotificationsPage() {
  const { user } = await validateSessionWithCookies()
  if (!user) {
    return redirect("/login")
  }

  return (
    <GenericLayout title={["Profile", "Notifications"]} user={user}>
      <main className="pt-2 pb-6">
        <section className="grid  sm:grid-cols-[22rem_1fr] gap-6 max-w-4xl mx-auto">
          <SideNav />
          <RightColumn />
        </section>
      </main>
    </GenericLayout>
  )
}

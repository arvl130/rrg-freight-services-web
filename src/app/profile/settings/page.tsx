import { GenericLayout } from "@/components/generic-layout"
import { SideNav } from "../sidenav"
import { validateSessionFromCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { RightColumn } from "./right-column"

export default async function ProfileSettingsPage() {
  const sessionResult = await validateSessionFromCookies()
  if (!sessionResult) {
    return redirect("/login")
  }

  return (
    <GenericLayout
      title={["Profile", "Account Settings"]}
      user={sessionResult.user}
    >
      <main className="pt-2 pb-6">
        <section className="grid sm:grid-cols-[22rem_1fr] gap-6 max-w-4xl mx-auto">
          <SideNav />
          <RightColumn user={sessionResult.user} />
        </section>
      </main>
    </GenericLayout>
  )
}

"use client"

import { ToggleLeft } from "@phosphor-icons/react/dist/ssr/ToggleLeft"
import { GenericLayout } from "@/layouts/generic"
import { SideNav } from "../sidenav"

function RightColumn() {
  return (
    <article>
      <div className="px-6 py-3 flex items-center justify-between rounded-lg bg-white">
        <h2 className="font-semibold">Show Notification</h2>
        <button type="button">
          <ToggleLeft size={32} />
        </button>
      </div>
    </article>
  )
}

export default function ProfileNotificationsPage() {
  return (
    <GenericLayout title={["Profile", "Notifications"]}>
      <main className="pt-2 pb-6">
        <section className="grid  sm:grid-cols-[22rem_1fr] gap-6 max-w-4xl mx-auto">
          <SideNav />
          <RightColumn />
        </section>
      </main>
    </GenericLayout>
  )
}

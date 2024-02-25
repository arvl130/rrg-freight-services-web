"use client"

import { GenericLayout } from "@/components/generic-layout"
import { SideNav } from "@/app/profile/sidenav"
import { UpdatePasswordForm } from "./update-password-form"

export default function ProfilePasswordPage() {
  return (
    <GenericLayout title={["Profile", "Password & Security"]} hasSession>
      {({ user }) => (
        <main className="mt-6">
          <section className="grid sm:grid-cols-[22rem_1fr] gap-6 max-w-4xl mx-auto">
            <SideNav />
            <UpdatePasswordForm user={user} />
          </section>
        </main>
      )}
    </GenericLayout>
  )
}

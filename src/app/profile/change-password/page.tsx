"use client"

import { GenericLayout } from "@/components/generic-layout"
import { SideNav } from "@/app/profile/sidenav"
import { UpdatePasswordForm } from "./update-password-form"
import { SecurityKeysSection } from "./security-keys"

export default function ProfilePasswordPage() {
  return (
    <GenericLayout title={["Profile", "Password & Security"]} hasSession>
      {({ user }) => (
        <main className="mt-6">
          <section className="grid sm:grid-cols-[22rem_1fr] gap-6 max-w-4xl mx-auto">
            <SideNav />
            <div className="min-w-0">
              <div className="px-6 pt-4 pb-6 rounded-lg bg-white">
                <UpdatePasswordForm user={user} />
                <SecurityKeysSection />
              </div>
            </div>
          </section>
        </main>
      )}
    </GenericLayout>
  )
}

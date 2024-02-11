"use client"

import { GenericLayout } from "@/layouts/generic"
import { User } from "firebase/auth"
import { SideNav } from "../sidenav"
import { api } from "@/utils/api"
import { UpdatePictureForm } from "./update-picture-form"
import { UpdateInformationForm } from "./update-profile-info-form"

function RightColumn({ user }: { user: User }) {
  const { isLoading, isError, data } = api.user.getById.useQuery({
    id: user.uid,
  })

  if (isLoading || isError) {
    return <article></article>
  }

  if (data === null) return <article>User profile is not yet created.</article>

  return (
    <article>
      <UpdatePictureForm user={data} />
      <UpdateInformationForm user={data} />
    </article>
  )
}

export default function ProfileSettingsPage() {
  return (
    <GenericLayout title={["Profile", "Account Settings"]} hasSession>
      {({ user }) => (
        <main className="pt-2 pb-6">
          <section className="grid grid-cols-[22rem_1fr] gap-6 max-w-4xl mx-auto">
            <SideNav />
            <RightColumn user={user} />
          </section>
        </main>
      )}
    </GenericLayout>
  )
}

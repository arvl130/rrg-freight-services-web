import { GenericLayout } from "@/layouts/generic"
import { User } from "firebase/auth"
import { ProfileSideNav } from "@/components/profile/sidenav"
import { api } from "@/utils/api"
import { ProfileUpdatePictureForm } from "@/components/profile/update-picture-form"
import { ProfileUpdateInformationForm } from "@/components/profile/update-profile-info-form"

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
      <ProfileUpdatePictureForm user={data} />
      <ProfileUpdateInformationForm user={data} />
    </article>
  )
}

export default function ProfileSettingsPage() {
  return (
    <GenericLayout title={["Profile", "Account Settings"]} hasSession>
      {({ user }) => (
        <main className="pt-2 pb-6">
          <section className="grid grid-cols-[22rem_1fr] gap-6 max-w-4xl mx-auto">
            <ProfileSideNav />
            <RightColumn user={user} />
          </section>
        </main>
      )}
    </GenericLayout>
  )
}

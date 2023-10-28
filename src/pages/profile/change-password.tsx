import { GenericLayout } from "@/layouts/generic"
import { ProfileSideNav } from "@/components/profile/sidenav"
import { ProfileUpdatePasswordForm } from "@/components/profile/update-password-form"

export default function ProfilePasswordPage() {
  return (
    <GenericLayout title={["Profile", "Password & Security"]} hasSession>
      {({ user }) => (
        <main className="mt-6">
          <section className="grid grid-cols-[22rem_1fr] gap-6 max-w-4xl mx-auto">
            <ProfileSideNav />
            <ProfileUpdatePasswordForm user={user} />
          </section>
        </main>
      )}
    </GenericLayout>
  )
}

import { ToggleLeft } from "@phosphor-icons/react/ToggleLeft"
import { GenericLayout } from "@/layouts/generic"
import { ProfileSideNav } from "@/components/profile/sidenav"

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
    <GenericLayout title="Dashboard">
      {() => (
        <main className="pt-2 pb-6">
          <section className="grid grid-cols-[22rem_1fr] gap-6 max-w-4xl mx-auto">
            <ProfileSideNav />
            <RightColumn />
          </section>
        </main>
      )}
    </GenericLayout>
  )
}

import { GenericLayout } from "@/layouts/generic"
import { ProfileSideNav } from "@/components/profile/sidenav"

function RightColumn() {
  return (
    <article>
      <form className="px-6 pt-4 pb-6 rounded-lg bg-white">
        <div>
          <h2 className="font-semibold pb-5">Change Password</h2>
        </div>
        <div className="grid grid-rows-1">
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1 ">
              Enter Current Password
            </label>
            <input className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring" />
          </div>
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1 ">
              Enter New Password
            </label>
            <input className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring" />
          </div>
          <div className="mb-5">
            <label className="block text-sm	text-gray-500 mb-1 ">
              Confirm New Password
            </label>
            <input className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring" />
          </div>
        </div>
        <button className="p-2 text-white	w-full bg-cyan-500 transition-colors hover:bg-cyan-400 rounded-lg font-medium">
          Save
        </button>
      </form>
    </article>
  )
}

export default function ProfilePasswordPage() {
  return (
    <GenericLayout title="Dashboard">
      {() => (
        <main className="mt-6">
          <section className="grid grid-cols-[22rem_1fr] gap-6 max-w-4xl mx-auto">
            <ProfileSideNav />
            <RightColumn />
          </section>
        </main>
      )}
    </GenericLayout>
  )
}

import { UserCircleGear } from "@phosphor-icons/react/UserCircleGear"
import { GenericLayout } from "@/layouts/generic"
import { User } from "firebase/auth"
import { useSession } from "@/utils/auth"
import { ProfileSideNav } from "@/components/profile/sidenav"

function UpdatePictureForm({ user }: { user: User }) {
  const { reload, role } = useSession()
  return (
    <div className="flex items-center justify-between mb-4 px-4 py-3 bg-white rounded-lg">
      <div className="flex gap-3 items-center">
        <div>
          <UserCircleGear size={80} />
        </div>
        <div>
          <h2 className="font-semibold">{user.displayName}</h2>
          <p className="text-sm	text-gray-400">{role}</p>
        </div>
      </div>
      <div>
        <button
          className="py-2 px-3 rounded-lg text-green-500 border border-green-500"
          onClick={() => reload()}
        >
          UPDATE
        </button>
      </div>
    </div>
  )
}

function UpdateInformationForm({}: { user: User }) {
  return (
    <div className="rounded-lg bg-white px-6 pt-4 pb-6">
      <div className="">
        <h1 className="font-semibold pb-6">Personal Information</h1>
        <form>
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1">Full Name</label>
            <input className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring" />
          </div>
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1 ">
              Email Address
            </label>
            <input className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring" />
          </div>
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1 ">
              Mobile Number
            </label>
            <input className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring" />
          </div>
          <div className="grid grid-cols-[2fr_1fr] gap-3 mb-5">
            <div className="grid grid-rows-[auto_1fr]">
              <label className="block text-sm	text-gray-500 mb-1">
                Street Address
              </label>
              <input className="block rounded-lg text-sm w-full px-4 py-2 text-gray-700 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring" />
            </div>
            <div className="grid grid-rows-[auto_1fr]">
              <label className="block text-sm	text-gray-500 mb-1">City</label>
              <select className="block rounded-lg text-sm w-full px-4 py-2 text-gray-700 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring">
                <option></option>
                <option></option>
              </select>
            </div>
          </div>
          <button className="p-2 text-white	w-full bg-cyan-500 transition-colors hover:bg-cyan-400 rounded-lg font-medium">
            Save
          </button>
        </form>
      </div>
    </div>
  )
}

function RightColumn({ user }: { user: User }) {
  return (
    <article>
      <UpdatePictureForm user={user} />
      <UpdateInformationForm user={user} />
    </article>
  )
}

export default function ProfileSettingsPage() {
  return (
    <GenericLayout title="Dashboard" hasSession>
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

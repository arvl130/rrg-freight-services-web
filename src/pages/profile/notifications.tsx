import { WarehouseLayout } from "@/layouts/warehouse"
import { useSession } from "@/utils/auth"
import { UserCircleGear } from "@phosphor-icons/react/UserCircleGear"
import { BellRinging } from "@phosphor-icons/react/BellRinging"
import { Key } from "@phosphor-icons/react/Key"
import { ToggleLeft } from "@phosphor-icons/react/ToggleLeft"
import Link from "next/link"
import { User } from "firebase/auth"
import { GenericLayout } from "@/layouts/generic"
import { List } from "@phosphor-icons/react/List"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { Gear } from "@phosphor-icons/react/Gear"
import { Bell } from "@phosphor-icons/react/Bell"
import { UserCircle } from "@phosphor-icons/react/UserCircle"
import { CaretDown } from "@phosphor-icons/react/CaretDown"

function CategoryTile() {
  return (
    <article
      style={{ minWidth: "30%" }}
      className="grid  grid-rows-3 px-5 gap-5 float-left	"
    >
      <Link href={"/profile/settings"}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
          }}
          className="flex p-4 drop-shadow-md"
        >
          <div className="pr-5">
            <UserCircleGear size={45} />
          </div>
          <div className="flex flex-col	justify-center	">
            <div>
              <h3 style={{ fontSize: "17px" }} className="font-bold">
                Account Setting
              </h3>
            </div>
            <div>
              <p className="text-sm	">Lorem Ipsum Dolor Sit Amet</p>
            </div>
          </div>
        </div>
      </Link>
      <Link href={"/profile/notifications"}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            filter:
              "drop-shadow(0 3px 3px rgb(121, 207, 220, 1)) drop-shadow(0 3px 3px rgb(0 0 0 / 0.06)",
          }}
          className="flex p-4 "
        >
          <div className="pr-5">
            <BellRinging size={45} />
          </div>
          <div className="flex flex-col	justify-center	">
            <div>
              <h3 style={{ fontSize: "17px" }} className="font-bold">
                Notification
              </h3>
            </div>
            <div>
              <p className="text-sm	">Lorem Ipsum Dolor Sit Amet</p>
            </div>
          </div>
        </div>
      </Link>
      <Link href={"/profile/change-password"}>
        <div
          style={{ backgroundColor: "#FFFFFF", borderRadius: "10px" }}
          className="flex p-4 drop-shadow-md"
        >
          <div className="pr-5">
            <Key size={45} />
          </div>
          <div className="flex flex-col	justify-center	">
            <div>
              <h3 style={{ fontSize: "17px" }} className="font-bold">
                Password & Security
              </h3>
            </div>
            <div>
              <p className="text-sm	">Lorem Ipsum Dolor Sit Amet</p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
function RightTile() {
  return (
    <article
      style={{ minWidth: "70%" }}
      className="grid  grid-rows-3 gap-10	pl-10	"
    >
      <div
        style={{ backgroundColor: "#FFFFFF", borderRadius: "10px" }}
        className="p-5 py-10 flex items-center justify-between	"
      >
        <div className="flex items-center	">
          <div>
            <h2 style={{ fontSize: "20px" }} className="font-bold	">
              Show Notification
            </h2>
          </div>
        </div>
        <div>
          <button className="py-2 px-3">
            <ToggleLeft size={50} />
          </button>
        </div>
      </div>
    </article>
  )
}

function MainView({ user }: { user: User }) {
  return (
    <main>
      <header className="flex justify-between bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 mb-4">
        <div className="flex items-center gap-3 rounded-md">
          <div>
            <List size={24} />
          </div>
          <div className="relative">
            <input
              type="text"
              className="text-sm w-full pl-8 pr-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            />
            <MagnifyingGlass className="absolute left-3 top-3" />
          </div>
        </div>
        <div className="flex">
          <select className="block text-sm font-medium pl-8 pr-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring">
            <option value="en-US">English</option>
          </select>
          <div className="px-2 flex text-gray-400">
            <button type="button" className="px-2">
              <Gear size={24} />
            </button>
            <button type="button" className="px-2">
              <Bell size={24} />
            </button>
            <button
              type="button"
              className="px-2 py-2 whitespace-nowrap flex gap-2 items-center text-sm w-46 text-gray-700"
            >
              <UserCircle size={24} />
              <div className="flex items-center gap-2">
                <span>{user.displayName}</span>
                <CaretDown size={12} />
              </div>
            </button>
          </div>
        </div>
      </header>
      <section className="pt-7">
        <CategoryTile />
        <RightTile />
      </section>
    </main>
  )
}

export default function ProfileNotificationsPage() {
  return (
    <GenericLayout title="Dashboard">
      {({ user }) => <MainView user={user} />}
    </GenericLayout>
  )
}

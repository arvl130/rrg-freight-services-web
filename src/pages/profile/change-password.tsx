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
          }}
          className="flex p-4 drop-shadow-md"
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
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            filter:
              "drop-shadow(0 3px 3px rgb(121, 207, 220, 1)) drop-shadow(0 3px 3px rgb(0 0 0 / 0.06)",
          }}
          className="flex p-4"
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
        className="p-5 py-10 "
      >
        <div className="">
          <div>
            <h2 style={{ fontSize: "20px" }} className="font-bold	pb-5">
              Change Password
            </h2>
          </div>
          <div className="grid grid-rows-3 gap-4">
            <div className="grid grid-rows-1">
              <label className="text-sm	text-gray-500">
                Enter Current Password
              </label>
              <input
                style={{
                  border: "1px solid #78CFDC ",
                  borderRadius: "8px",
                }}
                className="outline-none p-1"
              ></input>
            </div>
            <div className="grid grid-rows-1">
              {" "}
              <label className="text-sm	text-gray-500">Enter New Password</label>
              <input
                style={{
                  border: "1px solid #78CFDC ",
                  borderRadius: "8px",
                }}
                className="outline-none p-1"
              ></input>
            </div>
            <div className="grid grid-rows-1">
              {" "}
              <label className="text-sm	text-gray-500">
                Confirm New Password
              </label>
              <input
                style={{
                  border: "1px solid #78CFDC ",
                  borderRadius: "8px",
                }}
                className="outline-none p-1"
              ></input>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function MainView({ user }: { user: User }) {
  return (
    <main className="mt-6">
      <section className="pt-7">
        <CategoryTile />
        <RightTile />
      </section>
    </main>
  )
}

export default function ProfilePasswordPage() {
  const { isLoading } = useSession({
    required: true,
  })

  if (isLoading) return <>...</>

  return (
    <GenericLayout title="Dashboard">
      {({ user }) => <MainView user={user} />}
    </GenericLayout>
  )
}

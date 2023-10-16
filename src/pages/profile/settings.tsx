import { WarehouseLayout } from "@/layouts/warehouse"
import { useSession } from "@/utils/auth"
import { UserCircleGear } from "@phosphor-icons/react/UserCircleGear"
import { BellRinging } from "@phosphor-icons/react/BellRinging"
import { Key } from "@phosphor-icons/react/Key"
import Link from "next/link"

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
            filter:
              "drop-shadow(0 3px 3px rgb(121, 207, 220, 1)) drop-shadow(0 3px 3px rgb(0 0 0 / 0.06)",
          }}
          className="flex p-4"
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
          style={{ backgroundColor: "#FFFFFF", borderRadius: "10px" }}
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
        className="p-5 flex items-center justify-between	"
      >
        <div className="flex items-center	">
          <div className="pr-7 pl-7">
            <UserCircleGear size={80} />
          </div>
          <div>
            <h2 style={{ fontSize: "21px" }} className="font-bold	">
              User Name
            </h2>
            <p className="text-sm	text-gray-400">lorem Ipsum</p>
          </div>
        </div>
        <div>
          <button
            style={{
              border: "1px solid #65DB7F",
              borderRadius: "10px",
              color: "#65DB7F",
            }}
            className="py-2 px-3"
          >
            UPDATE
          </button>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
        }}
        className=" row-span-3 p-5 "
      >
        <div className="pl-6 pt-4">
          <h1 style={{ fontSize: "24px" }} className="font-bold pb-6">
            Update Personal Information
          </h1>
          <form>
            <div className="grid grid-rows-4 gap-5">
              <div className="grid grid-rows-1">
                <label className="text-sm	text-gray-500">Full Name</label>
                <input
                  style={{
                    border: "1px solid #78CFDC ",
                    borderRadius: "8px",
                  }}
                  className="outline-none p-1"
                ></input>
              </div>
              <div className="grid grid-rows-1">
                <label className="text-sm	text-gray-500">Email Address</label>
                <input
                  type="email"
                  style={{
                    border: "1px solid #78CFDC",
                    borderRadius: "8px",
                  }}
                  className="outline-none p-1"
                ></input>
              </div>
              <div className="grid grid-rows-1">
                <label className="text-sm	text-gray-500">Mobile Number</label>
                <input
                  type="number"
                  style={{
                    border: "1px solid #78CFDC",
                    borderRadius: "8px",
                  }}
                  className="outline-none p-1"
                ></input>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid grid-rows-1 col-span-2">
                  <label className="text-sm	text-gray-500">Street Address</label>
                  <input
                    type="number"
                    style={{
                      border: "1px solid #78CFDC",
                      borderRadius: "8px",
                    }}
                    className="outline-none p-1"
                  ></input>
                </div>
                <div className="grid grid-rows-1">
                  <label className="text-sm	text-gray-500">City</label>
                  <select
                    style={{
                      border: "1px solid #78CFDC",
                      borderRadius: "8px",
                    }}
                    className="outline-none p-1"
                  >
                    <option></option>
                    <option></option>
                  </select>
                </div>
              </div>

              <button
                className="p-2 text-white	"
                style={{ backgroundColor: "#78CFDC", borderRadius: "10px" }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </article>
  )
}

export default function Settings() {
  const { isLoading } = useSession({
    required: true,
  })

  if (isLoading) return <>...</>

  return (
    <WarehouseLayout title="Dashboard">
      <section className="pt-7">
        <CategoryTile />
        <RightTile />
      </section>
    </WarehouseLayout>
  )
}

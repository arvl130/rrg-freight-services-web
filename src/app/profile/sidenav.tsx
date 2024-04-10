"use client"

import { BellRinging } from "@phosphor-icons/react/dist/ssr/BellRinging"
import { UserCircleGear } from "@phosphor-icons/react/dist/ssr/UserCircleGear"
import { Key } from "@phosphor-icons/react/dist/ssr/Key"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SideNav() {
  const pathname = usePathname()

  return (
    <article className="flex flex-col gap-4">
      <Link href={"/profile/settings"}>
        <div
          className={`
          bg-white flex p-4 rounded-lg  hover:border-2 border-[#6BB6C1] hover:text-[#6BB6C1] hover:shadow-[#6BB6C1] hover:shadow-md
            ${
              pathname === "/profile/settings"
                ? "shadow-md shadow-[#6BB6C1] text-[#6BB6C1] border-2 border-[#6BB6C1]"
                : "shadow-md"
            }
          `}
        >
          <div className="pr-5">
            <UserCircleGear size={45} />
          </div>
          <div className="flex flex-col	justify-center	">
            <div>
              <h3 className="font-bold">Account Settings</h3>
            </div>
            <div>
              <p className="text-[12px] ">Personalize Your Profile</p>
            </div>
          </div>
        </div>
      </Link>
      <Link href={"/profile/notifications"}>
        <div
          className={`
          bg-white flex p-4 rounded-lg hover:border-2 border-[#6BB6C1] hover:text-[#6BB6C1] hover:shadow-[#6BB6C1] hover:shadow-md
            ${
              pathname === "/profile/notifications"
                ? "shadow-md shadow-[#6BB6C1] text-[#6BB6C1] border-2 border-[#6BB6C1]"
                : "shadow-md"
            }
          `}
        >
          <div className="pr-5">
            <BellRinging size={45} />
          </div>
          <div className="flex flex-col	justify-center	">
            <div>
              <h3 className="font-bold">Notifications</h3>
            </div>
            <div>
              <p className="text-[12px] ">Manage Your Notifications</p>
            </div>
          </div>
        </div>
      </Link>
      <Link href={"/profile/change-password"}>
        <div
          className={`
          bg-white flex p-4 rounded-lg hover:border-2 border-[#6BB6C1] hover:text-[#6BB6C1] hover:shadow-[#6BB6C1] hover:shadow-md
            ${
              pathname === "/profile/change-password"
                ? "shadow-md shadow-[#6BB6C1] text-[#6BB6C1] border-2 border-[#6BB6C1]"
                : "shadow-md"
            }
          `}
        >
          <div className="pr-5">
            <Key size={45} />
          </div>
          <div className="flex flex-col	justify-center	">
            <div>
              <h3 className="font-bold">Password & Security</h3>
            </div>
            <div>
              <p className="text-[12px]">Make Your Account More Secured</p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

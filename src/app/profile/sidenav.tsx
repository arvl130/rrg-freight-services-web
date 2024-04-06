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
          bg-white flex p-4 rounded-lg
            ${pathname === "/profile/settings" ? "shadow-lg" : "shadow"}
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
              <p className="text-sm text-gray-500">Personalize Your Profile</p>
            </div>
          </div>
        </div>
      </Link>
      <Link href={"/profile/notifications"}>
        <div
          className={`
          bg-white flex p-4 rounded-lg
            ${pathname === "/profile/notifications" ? "shadow-lg" : "shadow"}
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
              <p className="text-sm text-gray-500">Manage Your Notification</p>
            </div>
          </div>
        </div>
      </Link>
      <Link href={"/profile/change-password"}>
        <div
          className={`
          bg-white flex p-4 rounded-lg
            ${pathname === "/profile/change-password" ? "shadow-lg" : "shadow"}
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
              <p className="text-sm text-gray-500">
                Make Your Account More Secured
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

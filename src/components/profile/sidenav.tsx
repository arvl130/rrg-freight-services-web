import { BellRinging } from "@phosphor-icons/react/BellRinging"
import { UserCircleGear } from "@phosphor-icons/react/UserCircleGear"
import { Key } from "@phosphor-icons/react/Key"
import Link from "next/link"
import { useRouter } from "next/router"

export function SideNav() {
  const { pathname } = useRouter()
  return (
    <article className="flex flex-col gap-4">
      <Link href={"/profile/settings"}>
        <div
          className={`
          bg-white flex p-4 rounded-lg drop-shadow-md
            ${
              pathname === "/profile/settings"
                ? "[filter:_drop-shadow(rgb(121,_207,_220)_0px_3px_3px)_drop-shadow(rgba(0,_0,_0,_0.06)_0px_3px_3px)]"
                : ""
            }
          `}
        >
          <div className="pr-5">
            <UserCircleGear size={45} />
          </div>
          <div className="flex flex-col	justify-center	">
            <div>
              <h3 className="font-bold">Account Setting</h3>
            </div>
            <div>
              <p className="text-sm	">Lorem Ipsum Dolor Sit Amet</p>
            </div>
          </div>
        </div>
      </Link>
      <Link href={"/profile/notifications"}>
        <div
          className={`
          bg-white flex p-4 rounded-lg drop-shadow-md
            ${
              pathname === "/profile/notifications"
                ? "[filter:_drop-shadow(rgb(121,_207,_220)_0px_3px_3px)_drop-shadow(rgba(0,_0,_0,_0.06)_0px_3px_3px)]"
                : ""
            }
          `}
        >
          <div className="pr-5">
            <BellRinging size={45} />
          </div>
          <div className="flex flex-col	justify-center	">
            <div>
              <h3 className="font-bold">Notification</h3>
            </div>
            <div>
              <p className="text-sm	">Lorem Ipsum Dolor Sit Amet</p>
            </div>
          </div>
        </div>
      </Link>
      <Link href={"/profile/change-password"}>
        <div
          className={`
          bg-white flex p-4 rounded-lg drop-shadow-md
            ${
              pathname === "/profile/change-password"
                ? "[filter:_drop-shadow(rgb(121,_207,_220)_0px_3px_3px)_drop-shadow(rgba(0,_0,_0,_0.06)_0px_3px_3px)]"
                : ""
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
              <p className="text-sm	">Lorem Ipsum Dolor Sit Amet</p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

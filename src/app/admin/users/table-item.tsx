import type { User } from "@/server/db/entities"
import Image from "next/image"
import { useRef, useState } from "react"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import { UserCircle } from "@phosphor-icons/react/UserCircle"
import { UsersTableItemScreen } from "@/utils/constants"
import { supportedRoleToHumanized } from "@/utils/humanize"
import { MenuScreen } from "./menu-screen"
import { UpdateInformationScreen } from "./update-info-screen"
import { UpdateRoleScreen } from "./update-role-screen"
import { UpdatePhotoScreen } from "./update-photo-screen"
import { OverviewScreen } from "./overview-screen"

export function TableItem({ user }: { user: User }) {
  const detailsModal = useRef<null | HTMLDialogElement>(null)
  const [selectedScreen, setSelectedScreen] =
    useState<UsersTableItemScreen>("MENU")

  return (
    <div className="grid grid-cols-4 border-b border-gray-300 text-sm">
      <div className="px-4 py-2 flex items-center gap-1">
        {user.photoUrl === null ? (
          <UserCircle size={24} />
        ) : (
          <Image
            height={24}
            width={24}
            alt="Profile picture"
            src={user.photoUrl}
            className="rounded-full"
          />
        )}
        <span>{user.displayName}</span>
      </div>
      <div className="px-4 py-2 flex items-center">{user.emailAddress}</div>
      <div className="px-4 py-2 flex items-center">
        {supportedRoleToHumanized(user.role)}
      </div>
      <div className="px-4 py-2 flex items-center gap-2">
        <div
          className={`
          text-white rounded-md px-4 py-1 w-24 text-center
            ${user.isEnabled ? "bg-green-500" : "bg-red-500"}
          `}
        >
          {user.isEnabled ? "ACTIVE" : "INACTIVE"}
        </div>
        <button type="button" onClick={() => detailsModal.current?.showModal()}>
          <span className="sr-only">Actions</span>
          <DotsThree size={16} />
        </button>
      </div>
      <dialog
        ref={detailsModal}
        onClose={() => setSelectedScreen("MENU")}
        className="bg-white w-[min(calc(100%),_28rem)] mx-auto px-6 pt-7 pb-7 rounded-2xl mt-24"
      >
        {selectedScreen === "MENU" && (
          <MenuScreen
            user={user}
            setSelectedScreen={(selectedScreen) =>
              setSelectedScreen(selectedScreen)
            }
            close={() => detailsModal.current?.close()}
          />
        )}
        {selectedScreen === "OVERVIEW" && (
          <OverviewScreen
            user={user}
            goBack={() => setSelectedScreen("MENU")}
            goToUpdateInfo={() => setSelectedScreen("UPDATE_INFO")}
            close={() => detailsModal.current?.close()}
          />
        )}
        {selectedScreen === "UPDATE_INFO" && (
          <UpdateInformationScreen
            user={user}
            goBack={() => setSelectedScreen("OVERVIEW")}
            close={() => detailsModal.current?.close()}
          />
        )}
        {selectedScreen === "UPDATE_ROLE" && (
          <UpdateRoleScreen
            user={user}
            goBack={() => setSelectedScreen("MENU")}
            close={() => detailsModal.current?.close()}
          />
        )}
        {selectedScreen === "UPDATE_PHOTO" && (
          <UpdatePhotoScreen
            user={user}
            goBack={() => setSelectedScreen("MENU")}
            close={() => detailsModal.current?.close()}
          />
        )}
      </dialog>
    </div>
  )
}

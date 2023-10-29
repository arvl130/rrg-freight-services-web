import Image from "next/image"
import { useState } from "react"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import { UserCircle } from "@phosphor-icons/react/UserCircle"
import { User } from "@/server/db/entities"
import { UsersTableItemMenuScreen } from "@/components/users/table-item/menu-screen"
import { UsersTableItemUpdateInformationScreen } from "@/components/users/table-item/update-info-screen"
import { UsersTableItemScreen } from "@/utils/constants"
import { UsersTableItemUpdateRoleScreen } from "@/components/users/table-item/update-role-screen"
import { UsersTableItemUpdatePhotoScreen } from "@/components/users/table-item/update-photo-screen"
import { UsersTableItemOverviewScreen } from "@/components/users/table-item/overview-screen"

export function UsersTableItem({ user }: { user: User }) {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false)
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
      <div className="px-4 py-2 flex items-center">{user.role}</div>
      <div className="px-4 py-2 flex items-center gap-2">
        <div
          className={`
          text-white rounded-md px-4 py-1 w-24 text-center
            ${user.isEnabled ? "bg-green-500" : "bg-red-500"}
          `}
        >
          {user.isEnabled ? "ACTIVE" : "INACTIVE"}
        </div>
        <button type="button" onClick={() => setIsDetailsModalVisible(true)}>
          <span className="sr-only">Actions</span>
          <DotsThree size={16} />
        </button>
      </div>
      {isDetailsModalVisible && (
        <div className="absolute inset-0 bg-black/30">
          <div className="bg-white w-[min(calc(100%),_28rem)] mx-auto px-6 pt-7 pb-7 rounded-2xl mt-24">
            {selectedScreen === "MENU" && (
              <UsersTableItemMenuScreen
                user={user}
                setSelectedScreen={(selectedScreen) =>
                  setSelectedScreen(selectedScreen)
                }
                close={() => setIsDetailsModalVisible(false)}
              />
            )}
            {selectedScreen === "OVERVIEW" && (
              <UsersTableItemOverviewScreen
                user={user}
                goBack={() => setSelectedScreen("MENU")}
                goToUpdateInfo={() => setSelectedScreen("UPDATE_INFO")}
                close={() => {
                  setIsDetailsModalVisible(false)
                  setSelectedScreen("MENU")
                }}
              />
            )}
            {selectedScreen === "UPDATE_INFO" && (
              <UsersTableItemUpdateInformationScreen
                user={user}
                goBack={() => setSelectedScreen("OVERVIEW")}
                close={() => {
                  setIsDetailsModalVisible(false)
                  setSelectedScreen("MENU")
                }}
              />
            )}
            {selectedScreen === "UPDATE_ROLE" && (
              <UsersTableItemUpdateRoleScreen
                user={user}
                goBack={() => setSelectedScreen("MENU")}
                close={() => {
                  setIsDetailsModalVisible(false)
                  setSelectedScreen("MENU")
                }}
              />
            )}
            {selectedScreen === "UPDATE_PHOTO" && (
              <UsersTableItemUpdatePhotoScreen
                user={user}
                goBack={() => setSelectedScreen("MENU")}
                close={() => {
                  setIsDetailsModalVisible(false)
                  setSelectedScreen("MENU")
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

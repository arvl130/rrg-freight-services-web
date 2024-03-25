import type { UsersTableItemScreen } from "@/utils/constants"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { useState } from "react"
import { MenuScreen } from "./menu-screen"
import { OverviewScreen } from "./overview-screen"
import { UpdateInformationScreen } from "./update-info-screen"
import { UpdateRoleScreen } from "./update-role-screen"
import { UpdatePhotoScreen } from "./update-photo-screen"
import type { User } from "@/server/db/entities"

export function EditModal(props: {
  userRecord: User
  isOpen: boolean
  onClose: () => void
}) {
  const [selectedScreen, setSelectedScreen] =
    useState<UsersTableItemScreen>("MENU")

  return (
    <Dialog.Root open={props.isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={props.onClose}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_24rem)] rounded-2xl bg-white"
        >
          <div className="px-4 py-3 gap-x-3 gap-y-2 max-h-[80dvh] overflow-auto">
            {selectedScreen === "MENU" && (
              <MenuScreen
                user={props.userRecord}
                setSelectedScreen={(selectedScreen) =>
                  setSelectedScreen(selectedScreen)
                }
                close={props.onClose}
              />
            )}
            {selectedScreen === "OVERVIEW" && (
              <OverviewScreen
                user={props.userRecord}
                goBack={() => setSelectedScreen("MENU")}
                goToUpdateInfo={() => setSelectedScreen("UPDATE_INFO")}
                close={props.onClose}
              />
            )}
            {selectedScreen === "UPDATE_INFO" && (
              <UpdateInformationScreen
                user={props.userRecord}
                goBack={() => setSelectedScreen("OVERVIEW")}
                close={props.onClose}
              />
            )}
            {selectedScreen === "UPDATE_ROLE" && (
              <UpdateRoleScreen
                user={props.userRecord}
                goBack={() => setSelectedScreen("MENU")}
                close={props.onClose}
              />
            )}
            {selectedScreen === "UPDATE_PHOTO" && (
              <UpdatePhotoScreen
                user={props.userRecord}
                goBack={() => setSelectedScreen("MENU")}
                close={props.onClose}
              />
            )}
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-3 right-4"
              onClick={props.onClose}
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

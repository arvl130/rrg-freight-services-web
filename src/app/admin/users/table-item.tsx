import type { User } from "@/server/db/entities"
import Image from "next/image"
import { useState } from "react"
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import { getHumanizedOfUserRole } from "@/utils/humanize"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { EditModal } from "./edit-modal"

export function TableItem({ user }: { user: User }) {
  const [visibleModal, setVisibleModal] = useState<null | "EDIT">(null)

  return (
    <>
      <div className="px-4 py-2 flex items-center gap-1 border-b border-gray-300 text-sm">
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
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {user.emailAddress}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        {getHumanizedOfUserRole(user.role)}
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <div
          className={`
          text-white rounded-md px-4 py-1 w-24 text-center
            ${user.isEnabled ? "bg-green-500" : "bg-red-500"}
          `}
        >
          {user.isEnabled ? "ACTIVE" : "INACTIVE"}
        </div>
      </div>
      <div className="px-4 py-2 border-b border-gray-300 text-sm">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button type="button">
              <span className="sr-only">Actions</span>
              <DotsThree size={16} />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="drop-shadow-lg text-sm font-medium">
              <DropdownMenu.Item
                className="transition-colors bg-white rounded-md hover:bg-sky-50 px-3 py-2"
                onClick={() => setVisibleModal("EDIT")}
              >
                Edit
              </DropdownMenu.Item>
              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <EditModal
          userRecord={user}
          onClose={() => setVisibleModal(null)}
          isOpen={visibleModal === "EDIT"}
        />
      </div>
    </>
  )
}

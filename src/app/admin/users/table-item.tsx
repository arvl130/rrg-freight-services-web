import type { User } from "@/server/db/entities"
import Image from "next/image"
import { useState } from "react"
import { List } from "@phosphor-icons/react/dist/ssr/List"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import { getHumanizedOfUserRole } from "@/utils/humanize"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { EditModal } from "./edit-modal"
import { ViewActiveShipmentLocationsModal } from "./view-active-shipment-locations-modal"

export function TableItem({ user }: { user: User }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "EDIT" | "VIEW_ACTIVE_SHIPMENT_LOCATION"
  >(null)

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
            <button
              type="button"
              className="border border-gray-300 rounded-full p-2 shadow hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="sr-only">Actions</span>
              <List size={16} weight="bold" />
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
              {user.role === "DRIVER" && (
                <DropdownMenu.Item
                  className="transition-colors bg-white rounded-md hover:bg-sky-50 px-3 py-2"
                  onClick={() =>
                    setVisibleModal("VIEW_ACTIVE_SHIPMENT_LOCATION")
                  }
                >
                  View Active Shipment
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <EditModal
          userRecord={user}
          onClose={() => setVisibleModal(null)}
          isOpen={visibleModal === "EDIT"}
        />
        <ViewActiveShipmentLocationsModal
          driverId={user.id}
          onClose={() => setVisibleModal(null)}
          isOpen={visibleModal === "VIEW_ACTIVE_SHIPMENT_LOCATION"}
        />
      </div>
    </>
  )
}

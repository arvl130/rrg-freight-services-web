import * as Dialog from "@radix-ui/react-dialog"
import type { UserRole } from "@/utils/constants"
import { SUPPORTED_USER_ROLES } from "@/utils/constants"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { useState } from "react"
import { CreateAdminForm } from "./create-admin-form"
import { CreateWarehouseStaffForm } from "./create-warehouse-staff-form"
import { CreateDriverForm } from "./create-driver-form"
import { CreateOverseasAgentForm } from "./create-overseas-agent-form"
import { CreateDomesticAgentForm } from "./create-domestic-agent-form"
import { getHumanizedOfUserRole } from "@/utils/humanize"

export function CreateModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: (options: { generatedPassword?: string }) => void
}) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("ADMIN")

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            New User
          </Dialog.Title>
          <div className="px-4 py-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 max-h-[80dvh] overflow-auto">
            <div className="flex items-center justify-end">
              <label>Role:</label>
            </div>
            <select
              className="block w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.currentTarget.value as UserRole)
              }}
            >
              {SUPPORTED_USER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {getHumanizedOfUserRole(role)}
                </option>
              ))}
            </select>
            {selectedRole === "ADMIN" && (
              <CreateAdminForm onSuccess={onSuccess} />
            )}
            {selectedRole === "WAREHOUSE" && (
              <CreateWarehouseStaffForm onSuccess={onSuccess} />
            )}
            {selectedRole === "DRIVER" && (
              <CreateDriverForm onSuccess={onSuccess} />
            )}
            {selectedRole === "OVERSEAS_AGENT" && (
              <CreateOverseasAgentForm onSuccess={onSuccess} />
            )}
            {selectedRole === "DOMESTIC_AGENT" && (
              <CreateDomesticAgentForm onSuccess={onSuccess} />
            )}
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              className="text-white absolute top-3 right-3"
              onClick={onClose}
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

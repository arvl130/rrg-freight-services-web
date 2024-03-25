import type { User } from "@/server/db/entities"
import type { UserRole } from "@/utils/constants"
import { SUPPORTED_USER_ROLES } from "@/utils/constants"
import { supportedRoleToHumanized } from "@/utils/humanize"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr/CaretLeft"
import { useState } from "react"
import { UpdateDriverForm } from "./update-driver-form"
import { UpdateOverseasAgentForm } from "./update-overseas-agent-form"
import { UpdateDomesticAgentForm } from "./update-domestic-agent-form"
import { UpdateWarehouseStaffForm } from "./update-warehouse-staff-form"
import { UpdateAdminForm } from "./update-admin-form"

export function UpdateRoleScreen({
  user,
  goBack,
}: {
  user: User
  goBack: () => void
}) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role)

  return (
    <div className="grid grid-rows-[1fr_auto]">
      <div className="mb-2 flex justify-between">
        <button type="button" onClick={goBack}>
          <CaretLeft size={20} />
        </button>
      </div>
      <div className="font-semibold text-lg mb-3">Role</div>
      <div className="mb-3">
        <select
          className="block w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.currentTarget.value as UserRole)
          }}
        >
          {SUPPORTED_USER_ROLES.map((supportedRole, index) => (
            <option key={`${index}-${supportedRole}`} value={supportedRole}>
              {supportedRoleToHumanized(supportedRole)}
            </option>
          ))}
        </select>
      </div>
      {selectedRole === "ADMIN" && <UpdateAdminForm user={user} />}
      {selectedRole === "WAREHOUSE" && <UpdateWarehouseStaffForm user={user} />}
      {selectedRole === "DRIVER" && <UpdateDriverForm user={user} />}
      {selectedRole === "OVERSEAS_AGENT" && (
        <UpdateOverseasAgentForm user={user} />
      )}
      {selectedRole === "DOMESTIC_AGENT" && (
        <UpdateDomesticAgentForm user={user} />
      )}
    </div>
  )
}

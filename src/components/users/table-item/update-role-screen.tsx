import { User } from "@/server/db/entities"
import { useSession } from "@/utils/auth"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { Role, SUPPORTED_USER_ROLES } from "@/utils/constants"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { X } from "@phosphor-icons/react/X"
import { supportedRoleToHumanized } from "@/utils/humanize"

const updateRoleFormSchema = z.object({
  role: z.custom<Role>(
    (val) => {
      return SUPPORTED_USER_ROLES.includes(val as Role)
    },
    {
      message: "Please select a valid role.",
    },
  ),
  isEnabled: z.union([z.literal("YES"), z.literal("NO")]),
})

type UpdateRoleFormType = z.infer<typeof updateRoleFormSchema>

export function UsersTableItemUpdateRoleScreen({
  user,
  goBack,
  close,
}: {
  user: User
  goBack: () => void
  close: () => void
}) {
  const { user: firebaseUser, reload, role } = useSession()

  const {
    reset,
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<UpdateRoleFormType>({
    resolver: zodResolver(updateRoleFormSchema),
    defaultValues: {
      role: (role ?? "UNKNOWN") as Role,
      isEnabled: user.isEnabled === 1 ? "YES" : "NO",
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  })

  const utils = api.useUtils()
  const { isLoading, mutate } = api.user.updateRoleAndEnabledById.useMutation({
    onSuccess: () => {
      reset()
      utils.user.getAll.invalidate()
      if (firebaseUser!.uid === user.id) reload()
    },
  })

  return (
    <form
      className="grid grid-rows-[1fr_auto]"
      onSubmit={handleSubmit((formData) => {
        mutate({
          id: user.id,
          role: formData.role,
          isEnabled: formData.isEnabled === "YES",
        })
      })}
    >
      <div className="mb-2 flex justify-between">
        <button type="button" onClick={goBack}>
          <CaretLeft size={20} />
        </button>
        <X size={20} onClick={close} />
      </div>
      <div className="font-semibold text-lg mb-3">Role</div>
      <div className="mb-3">
        <label className="block text-sm	text-gray-500 mb-1">Gender</label>
        <select
          className="block rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          disabled={isLoading}
          {...register("role")}
        >
          {SUPPORTED_USER_ROLES.map((supportedRole, index) => (
            <option key={`${index}-${supportedRole}`} value={supportedRole}>
              {supportedRoleToHumanized(supportedRole)}
            </option>
          ))}
          <option value="UNKNOWN" disabled>
            N/A
          </option>
        </select>
        {errors.role && (
          <div className="text-sm text-red-500 mt-1">{errors.role.message}</div>
        )}
      </div>
      <div className="mb-6">
        <p className="block text-sm	text-gray-500 mb-1 ">Status</p>
        <div className="flex gap-4">
          <label className="inline-flex gap-1">
            <input
              type="radio"
              className="rounded-lg text-sm px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              disabled={isLoading}
              value="YES"
              {...register("isEnabled")}
            />
            <span>Enabled</span>
          </label>
          <label className="inline-flex gap-1">
            <input
              type="radio"
              className="rounded-lg text-sm px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              disabled={isLoading}
              value="NO"
              {...register("isEnabled")}
            />
            <span>Disabled</span>
          </label>
        </div>
        {errors.isEnabled && (
          <div className="text-sm text-red-500 mt-1">
            {errors.isEnabled.message}
          </div>
        )}
      </div>
      <button
        type="submit"
        className="p-2 text-white	w-full bg-cyan-500 transition-colors disabled:bg-cyan-300 hover:bg-cyan-400 rounded-lg font-medium"
        disabled={isLoading || !isDirty || !isValid}
      >
        {isLoading ? "Saving ..." : "Save"}
      </button>
    </form>
  )
}

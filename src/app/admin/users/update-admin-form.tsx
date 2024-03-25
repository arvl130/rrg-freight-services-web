import type { User } from "@/server/db/entities"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"

const formSchema = z.object({
  isEnabled: z.union([z.literal("YES"), z.literal("NO")]),
})

type FormSchema = z.infer<typeof formSchema>

function EditForm(props: { user: User }) {
  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isEnabled: props.user.isEnabled === 1 ? "YES" : "NO",
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  })

  const utils = api.useUtils()
  const { isLoading, mutate } = api.user.updateById.useMutation({
    onSuccess: () => {
      reset()
      utils.user.getAll.invalidate()
      utils.user.getWarehouseStaffDetailsById.invalidate()
    },
  })

  return (
    <form
      onSubmit={handleSubmit((formData) => {
        mutate({
          id: props.user.id,
          displayName: props.user.displayName,
          emailAddress: props.user.emailAddress,
          contactNumber: props.user.contactNumber,
          gender: props.user.gender,
          role: "ADMIN",
          isEnabled: formData.isEnabled === "YES",
        })
      })}
    >
      <div className="mb-6">
        <p className="block mt-3	text-gray-500 mb-1">Status</p>
        <div className="flex gap-4">
          <label className="inline-flex gap-1">
            <input
              type="radio"
              className="rounded-lg px-4 py-2 text-gray-700 read-only:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              readOnly={isLoading}
              value="YES"
              {...register("isEnabled")}
            />
            <span>Enabled</span>
          </label>
          <label className="inline-flex gap-1">
            <input
              type="radio"
              className="rounded-lg px-4 py-2 text-gray-700 read-only:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              readOnly={isLoading}
              value="NO"
              {...register("isEnabled")}
            />
            <span>Disabled</span>
          </label>
        </div>
        {errors.isEnabled && (
          <div className="text-red-500 mt-1">{errors.isEnabled.message}</div>
        )}
      </div>
      <button
        type="submit"
        className="p-2 text-white	w-full bg-cyan-500 transition-colors disabled:bg-cyan-300 hover:bg-cyan-400 rounded-lg font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Saving ..." : "Save"}
      </button>
    </form>
  )
}

export function UpdateAdminForm(props: { user: User }) {
  const { status, data, error } =
    api.user.getWarehouseStaffDetailsById.useQuery({
      id: props.user.id,
    })

  if (status === "loading") return <p className="mb-3">Loading ...</p>

  if (status === "error")
    return (
      <p className="mb-3 text-red-500">
        Could not retrieve warehouse staff details: {error.message}
      </p>
    )

  return <EditForm user={props.user} />
}

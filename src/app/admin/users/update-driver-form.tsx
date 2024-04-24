import type { Driver, User } from "@/server/db/entities"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { REGEX_HTML_INPUT_DATESTR } from "@/utils/constants"
import { useState } from "react"
import { AssignedAreasFormSection } from "./assigned-areas-form-section"
import toast from "react-hot-toast"

const formSchema = z.object({
  isEnabled: z.union([z.literal("YES"), z.literal("NO")]),
  licenseNumber: z.string().min(1).max(100),
  licenseRegistrationDate: z.string().regex(REGEX_HTML_INPUT_DATESTR, {
    message: "Please choose a date.",
  }),
})

type FormSchema = z.infer<typeof formSchema>

function EditForm(props: {
  user: User
  driver: (Driver & { assignedAreaCodes: string[] }) | null
}) {
  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isEnabled: props.user.isEnabled === 1 ? "YES" : "NO",
      licenseNumber: props.driver?.licenseNumber,
      licenseRegistrationDate: props.driver?.licenseRegistrationDate,
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
      utils.user.getDriverDetailsById.invalidate()
    },
  })

  const [assignedAreaCodes, setAssignedAreaCodes] = useState<string[]>(
    props.driver?.assignedAreaCodes ?? [],
  )

  return (
    <form
      onSubmit={handleSubmit((formData) => {
        if (assignedAreaCodes.length === 0) {
          return toast.error("Please select at least one assigned area.")
        }

        mutate({
          id: props.user.id,
          displayName: props.user.displayName,
          emailAddress: props.user.emailAddress,
          contactNumber: props.user.contactNumber,
          gender: props.user.gender,
          role: "DRIVER",
          ...formData,
          isEnabled: formData.isEnabled === "YES",
          assignedAreaCodes,
        })
      })}
    >
      <div className="mb-6">
        <label className="block	text-gray-500 mb-1">License No.</label>
        <input
          type="text"
          className="block w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          {...register("licenseNumber")}
        />
        {errors.licenseNumber && (
          <div className="mt-1 text-red-500 col-start-2">
            {errors.licenseNumber.message}.
          </div>
        )}

        <label className="block mt-3	text-gray-500 mb-1">
          License Registration Date
        </label>
        <input
          type="date"
          className="block  w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          {...register("licenseRegistrationDate")}
        />
        {errors.licenseRegistrationDate && (
          <div className="mt-1 text-red-500 col-start-2">
            {errors.licenseRegistrationDate.message}
          </div>
        )}

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

        <div className="mt-3">
          <AssignedAreasFormSection
            assignedAreaCodes={assignedAreaCodes}
            onAddAreaCode={(newAreaCode) => {
              setAssignedAreaCodes((currAssignedAreaCodes) => {
                if (currAssignedAreaCodes.includes(newAreaCode)) {
                  return currAssignedAreaCodes
                } else return [...currAssignedAreaCodes, newAreaCode]
              })
            }}
            onRemoveAreaCode={(oldAreaCode) => {
              setAssignedAreaCodes((currAssignedAreaCodes) => {
                return currAssignedAreaCodes.filter(
                  (areaCode) => areaCode !== oldAreaCode,
                )
              })
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        className="p-2 text-white	w-full bg-cyan-500 transition-colors disabled:bg-cyan-300 hover:bg-cyan-400 rounded-lg font-medium"
        disabled={isLoading || assignedAreaCodes.length === 0}
      >
        {isLoading ? "Saving ..." : "Save"}
      </button>
    </form>
  )
}

export function UpdateDriverForm(props: { user: User }) {
  const { status, data, error } = api.user.getDriverDetailsById.useQuery({
    id: props.user.id,
  })

  if (status === "loading") return <p className="mb-3">Loading ...</p>

  if (status === "error")
    return (
      <p className="mb-3 text-red-500">
        Could not retrieve driver details: {error.message}
      </p>
    )

  return <EditForm user={props.user} driver={data} />
}

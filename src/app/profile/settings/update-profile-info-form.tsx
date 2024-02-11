import type { User } from "@/server/db/entities"
import { useSession } from "@/hooks/session"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"

const updateInformationFormSchema = z.object({
  displayName: z.string().min(1).max(100),
  emailAddress: z.string().min(1).max(100).email(),
  contactNumber: z.string().min(1).max(15),
  gender: z.union([
    z.literal("MALE"),
    z.literal("FEMALE"),
    z.literal("OTHER"),
    z.literal("UNKNOWN"),
  ]),
})

type UpdateInformationFormType = z.infer<typeof updateInformationFormSchema>

export function UpdateInformationForm({ user }: { user: User }) {
  const { reload } = useSession()
  const {
    reset,
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<UpdateInformationFormType>({
    resolver: zodResolver(updateInformationFormSchema),
    defaultValues: {
      displayName: user.displayName,
      contactNumber: user.contactNumber,
      emailAddress: user.emailAddress,
      gender: user.gender === null ? "UNKNOWN" : user.gender,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  })

  const utils = api.useUtils()
  const { isLoading, mutate } = api.user.updateDetails.useMutation({
    onSuccess: async () => {
      reset()
      utils.user.getById.invalidate({
        id: user.id,
      })
      reload()
    },
  })

  return (
    <div className="rounded-lg bg-white px-6 pt-4 pb-6">
      <div className="">
        <h1 className="font-semibold pb-2">Personal Information</h1>
        <form
          onSubmit={handleSubmit((formData) => {
            mutate({
              displayName: formData.displayName,
              contactNumber: formData.contactNumber,
              emailAddress: formData.emailAddress,
              gender: formData.gender === "UNKNOWN" ? null : formData.gender,
            })
          })}
        >
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1">Full Name</label>
            <input
              className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              {...register("displayName")}
              disabled={isLoading}
            />
            {errors.displayName && (
              <div className="text-sm text-red-500 mt-1">
                {errors.displayName.message}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1 ">
              Email Address
            </label>
            <input
              className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              {...register("emailAddress")}
              disabled={isLoading}
            />
            {errors.emailAddress && (
              <div className="text-sm text-red-500 mt-1">
                {errors.emailAddress.message}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1 ">
              Mobile Number
            </label>
            <input
              className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              {...register("contactNumber")}
              disabled={isLoading}
            />
            {errors.contactNumber && (
              <div className="text-sm text-red-500 mt-1">
                {errors.contactNumber.message}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1">Gender</label>
            <select
              className="block rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              {...register("gender")}
              disabled={isLoading}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="UNKNOWN">Rather not say</option>
            </select>
          </div>
          <button
            className="p-2 text-white	w-full bg-cyan-500 transition-colors disabled:bg-cyan-300 hover:bg-cyan-400 rounded-lg font-medium"
            disabled={isLoading || !isDirty || !isValid}
          >
            {isLoading ? "Saving ..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  )
}

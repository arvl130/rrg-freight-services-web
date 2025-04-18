import type { User } from "@/server/db/entities"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { updateDetailsAction } from "./actions"
import { useActionState, useEffect, useRef, useTransition } from "react"
import { updateDetailsInputSchema } from "./form-schema"
import toast from "react-hot-toast"
type UpdateInformationFormType = z.infer<typeof updateDetailsInputSchema>

export function UpdateInformationForm({ user }: { user: User }) {
  const formRef = useRef<HTMLFormElement>(null)

  const [isPending, startTransition] = useTransition()
  const [state, formAction] = useActionState(updateDetailsAction, {
    success: false,
    message: "",
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdateInformationFormType>({
    resolver: zodResolver(updateDetailsInputSchema),
    defaultValues: {
      displayName: user.displayName,
      contactNumber: user.contactNumber,
      emailAddress: user.emailAddress,
      gender: user.gender,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  })

  const utils = api.useUtils()
  useEffect(() => {
    if (state.success) {
      utils.user.getById.invalidate({
        id: user.id,
      })
    }
  }, [state.success, utils.user.getById, user.id])

  return (
    <div className="rounded-lg bg-white px-6 pt-4 pb-6">
      <div className="">
        <h1 className="font-semibold pb-2">Personal Information</h1>
        {!state.success && (
          <>
            {state.message !== "" && !Array.isArray(state.issues) && (
              <p className="text-red-600 text-center mt-3">{state.message}</p>
            )}
            {state.issues && (
              <ul className="text-red-600 text-center mt-3">
                {state.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            )}
          </>
        )}
        <form
          ref={formRef}
          action={formAction}
          onSubmit={(e) => {
            e.preventDefault()

            handleSubmit(() => {
              if (formRef.current) {
                const formData = new FormData(formRef.current)
                toast.success("Profile updated")
                startTransition(() => {
                  formAction(formData)
                })
              }
            })(e)
          }}
        >
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1">Full Name</label>
            <input
              className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              {...register("displayName")}
              disabled={isPending}
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
              disabled={isPending}
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
              disabled={isPending}
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
              disabled={isPending}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <button
            className="p-2 text-white	w-full bg-cyan-500 transition-colors disabled:bg-cyan-300 hover:bg-cyan-400 rounded-lg font-medium"
            disabled={isPending}
          >
            {isPending ? "Saving ..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  )
}

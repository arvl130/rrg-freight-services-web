import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  EmailAuthProvider,
  User,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth"
import { useState } from "react"

const updatePasswordFormSchema = z
  .object({
    oldPassword: z.string().min(8).max(4096),
    newPassword: z.string().min(8).max(4096),
    newPasswordAgain: z.string().min(8).max(4096),
  })
  .refine(
    ({ newPassword, newPasswordAgain }) => newPassword === newPasswordAgain,
    {
      message: "Passwords did not match.",
    },
  )

type UpdatePasswordFormType = z.infer<typeof updatePasswordFormSchema>

export function ProfileUpdatePasswordForm({ user }: { user: User }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdatePasswordFormType>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordAgain: "",
    },
  })

  return (
    <form
      className="px-6 pt-4 pb-6 rounded-lg bg-white"
      onSubmit={handleSubmit(async (formData) => {
        setIsUpdating(true)
        try {
          const userCredential = await EmailAuthProvider.credential(
            user.email!,
            formData.oldPassword,
          )

          await reauthenticateWithCredential(user, userCredential)
          await updatePassword(user, formData.oldPassword)
          reset()
        } finally {
          setIsUpdating(false)
        }
      })}
    >
      <div>
        <h2 className="font-semibold pb-5">Change Password</h2>
      </div>
      <div className="grid grid-rows-1">
        <div className="mb-3">
          <label className="block text-sm	text-gray-500 mb-1 ">
            Current Password
          </label>
          <input
            type="password"
            placeholder="Enter your current password"
            className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            {...register("oldPassword")}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm	text-gray-500 mb-1 ">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter your new password"
            className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            {...register("newPassword")}
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm	text-gray-500 mb-1 ">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Enter your new password again"
            className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            {...register("newPasswordAgain")}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isUpdating}
        className="p-2 text-white	w-full disabled:bg-cyan-300 bg-cyan-500 transition-colors hover:bg-cyan-400 rounded-lg font-medium"
      >
        {isUpdating ? "Saving ..." : "Save"}
      </button>
    </form>
  )
}

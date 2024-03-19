"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"

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

export function UpdatePasswordForm() {
  const { isLoading, mutate } = api.user.updatePassword.useMutation({
    onSuccess: () => {
      toast.success("Your password has been updated.")
      reset()
    },
    onError: (error) => {
      toast.error(`${error.message}`)
    },
  })
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
      onSubmit={handleSubmit(async (formData) => {
        mutate({
          currentPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        })
      })}
    >
      <h2 className="font-semibold mb-3">Change Password</h2>
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
        disabled={isLoading}
        className="p-2 text-white	w-full disabled:bg-cyan-300 bg-cyan-500 transition-colors hover:bg-cyan-400 rounded-lg font-medium"
      >
        {isLoading ? "Saving ..." : "Save"}
      </button>
    </form>
  )
}

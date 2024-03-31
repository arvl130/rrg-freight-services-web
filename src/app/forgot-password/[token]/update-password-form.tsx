"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const formSchema = z
  .object({
    newPassword: z.string().min(8).max(4096),
    newPasswordAgain: z.string().min(8).max(4096),
  })

  .refine(
    ({ newPassword, newPasswordAgain }) => newPassword === newPasswordAgain,
    {
      message: "Passwords did not match.",
      path: ["newPasswordAgain"],
    },
  )

type FormType = z.infer<typeof formSchema>

export function UpdatePasswordForm(props: { token: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      newPasswordAgain: "",
    },
  })

  const router = useRouter()

  const { status, mutate } =
    api.passwordReset.updatePasswordWithToken.useMutation({
      onError: (error) => {
        toast.error(error.message)
      },
      onSuccess: () => {
        router.replace("/login")
        toast.success("Password updated.")
      },
    })

  return (
    <form
      onSubmit={handleSubmit((formData) => {
        mutate({
          token: props.token,
          newPassword: formData.newPassword,
        })
      })}
    >
      <div>
        <label className="font-medium block mb-1">Password</label>
        <input
          type="password"
          className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-red-600 mt-1 text-sm">
            {errors.newPassword.message}
          </p>
        )}
      </div>
      <div className="mt-4">
        <label className="font-medium block mb-1">Confirm Password</label>
        <input
          type="password"
          className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          {...register("newPasswordAgain")}
        />
        {errors.newPasswordAgain && (
          <p className="text-red-600 mt-1 text-sm">
            {errors.newPasswordAgain.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="font-semibold w-full mt-4 px-8 py-2.5 leading-5 text-white transition-colors duration-200 transform bg-brand-cyan-500 rounded-md hover:bg-brand-cyan-600 focus:outline-none focus:bg-brand-cyan-600 disabled:bg-brand-cyan-350"
        disabled={status === "loading"}
      >
        Update Password
      </button>
    </form>
  )
}

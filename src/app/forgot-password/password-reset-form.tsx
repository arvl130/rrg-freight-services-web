"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: "Please enter your email.",
    })
    .email({
      message: "This email has an invalid format.",
    }),
})

type FormType = z.infer<typeof formSchema>

export function PasswordResetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const { status, mutate } = api.passwordReset.generateToken.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success("Password reset link sent.")
    },
  })

  return (
    <form
      onSubmit={handleSubmit((formData) => {
        mutate({
          email: formData.email,
        })
      })}
    >
      <div>
        <label className="font-medium block mb-1">Email</label>
        <input
          type="email"
          className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="font-semibold w-full mt-4 px-8 py-2.5 leading-5 text-white transition-colors duration-200 transform bg-brand-cyan-500 rounded-md hover:bg-brand-cyan-600 focus:outline-none focus:bg-brand-cyan-600 disabled:bg-brand-cyan-350"
        disabled={status === "pending"}
      >
        Send Password Reset Link
      </button>
    </form>
  )
}

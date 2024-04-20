"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef, useState, useTransition } from "react"
import { Eye } from "@phosphor-icons/react/dist/ssr/Eye"
import { EyeSlash } from "@phosphor-icons/react/dist/ssr/EyeSlash"
import { signInWithEmailAndPasswordAction } from "./actions"
import { useFormState } from "react-dom"
import { formSchema } from "./form-schema"
import type { z } from "zod"
import { InlineLoadingSpinner, LoadingSpinner } from "@/components/spinner"

type FormType = z.infer<typeof formSchema>

export function LoginForm() {
  const [state, formAction] = useFormState(signInWithEmailAndPasswordAction, {
    message: "",
  })

  const defaultValues = {
    email: "",
    password: "",
    ...(state.fields ?? {}),
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const formRef = useRef<HTMLFormElement>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPending, startTransition] = useTransition()

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(e) => {
        e.preventDefault()

        handleSubmit(() => {
          if (formRef.current) {
            const formData = new FormData(formRef.current)
            startTransition(() => {
              formAction(formData)
            })
          }
        })(e)
      }}
    >
      <div>
        <label className="font-medium block mb-1">Email</label>
        <input
          type="email"
          className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          defaultValue={defaultValues.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>
        )}
      </div>
      <div className="mt-4">
        <label className="font-medium block mb-1">Password</label>
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            defaultValue={defaultValues.password}
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-2.5"
            onClick={() =>
              setIsPasswordVisible(
                (currentIsPasswordVisible) => !currentIsPasswordVisible,
              )
            }
          >
            {isPasswordVisible ? (
              <Eye size={20} className="text-gray-600" />
            ) : (
              <EyeSlash size={20} className="text-gray-600" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>
        )}
      </div>
      <div className="text-right mt-1">
        <Link href="/forgot-password" className="text-sm">
          Forgot Password?
        </Link>
      </div>
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
      <button
        type="submit"
        className="font-semibold w-full flex gap-2 items-center justify-center mt-4 px-8 py-2.5 leading-5 text-white transition-colors duration-200 transform bg-brand-cyan-500 rounded-md hover:bg-brand-cyan-600 focus:outline-none focus:bg-brand-cyan-600 disabled:bg-brand-cyan-350"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <InlineLoadingSpinner />
            Signing in ...
          </>
        ) : (
          <>Sign in</>
        )}
      </button>
    </form>
  )
}

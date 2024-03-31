"use client"

import { api } from "@/utils/api"
import { startAuthentication } from "@simplewebauthn/browser"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { useState } from "react"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr/CaretLeft"
import { signInWithWebauthnResponseAction } from "./actions"
import toast from "react-hot-toast"
import { formSchema } from "./form-schema"

type FormType = z.infer<typeof formSchema>

export default function Page() {
  const generateAuthenticationOptionsMutation =
    api.webauthn.generateAuthenticationOptions.useMutation({
      onSuccess: async (options) => {
        setIsSigningIn(true)
        try {
          const response = await startAuthentication(options)
          await signInWithWebauthnResponseAction(response)
        } catch {
          setIsSigningIn(false)
          toast.error("Sign in error occured.")
        }
      },
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  })

  const [isSigningIn, setIsSigningIn] = useState(false)

  return (
    <>
      <title>Login &#x2013; RRG Freight Services</title>
      <main className="min-h-dvh bg-brand-cyan-450 px-3 py-24 pb-3 relative">
        <div className="absolute inset-0 h-full sm:grid grid-cols-2 hidden">
          <div className="flex justify-center items-end">
            <Image
              src="/assets/img/login/right-bg.png"
              alt="Ship, truck, and plane on a globe"
              className="w-[500px] h-80 object-contain object-bottom"
              width={500}
              height={320}
            />
          </div>
          <div></div>
        </div>
        <section className="max-w-[26rem] mx-auto bg-white px-4 py-3 rounded-md shadow-lg relative">
          <div className="px-3 sm:px-6 pb-8">
            <div className="pb-6 pt-10">
              <div className="flex justify-center mb-2">
                <Image
                  src="/assets/img/logos/logo-with-name.png"
                  alt="RRG Freight Services logo with its name on the right"
                  className="w-[168px] h-[60px] object-contain"
                  width={168}
                  height={60}
                />
              </div>
              <p className="text-center font-semibold">
                Enter Your Credentials
              </p>
            </div>
            <form
              onSubmit={handleSubmit(async (formData) => {
                generateAuthenticationOptionsMutation.mutate({
                  email: formData.email,
                })
              })}
            >
              <div>
                <label className="font-medium block mb-1">Email</label>
                <input
                  type="text"
                  className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={
                  generateAuthenticationOptionsMutation.isLoading || isSigningIn
                }
                className="font-semibold w-full mt-4 px-8 py-2.5 leading-5 text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 disabled:bg-blue-300"
              >
                Sign in
              </button>
            </form>
          </div>
          <div className="text-sm flex justify-between">
            <Link href="/" className="inline-flex items-center">
              <CaretLeft height={12} /> Back to Homepage
            </Link>

            <Link href="/login">Sign in with Email</Link>
          </div>
        </section>
      </main>
    </>
  )
}

"use client"

import { api } from "@/utils/api"
import { startAuthentication } from "@simplewebauthn/browser"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { getAuth, signInWithCustomToken } from "firebase/auth"
import { useEffect, useState } from "react"
import { FirebaseError } from "firebase/app"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import { useSession } from "@/hooks/session"
import { useRouter } from "next/navigation"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr/CaretLeft"
import { SkeletonGenericLayout } from "@/components/generic-layout"
import { LoginPageHead } from "../login-page-head"

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Please enter your email.",
    })
    .email({
      message: "This email has an invalid format.",
    }),
})

type FormType = z.infer<typeof formSchema>

export default function Page() {
  const generateAuthenticationOptionsMutation =
    api.webauthn.generateAuthenticationOptions.useMutation({
      onSuccess: async (options) => {
        const response = await startAuthentication(options)
        verifyAuthenticationResponseMutation.mutate({
          response,
        })
      },
    })

  const verifyAuthenticationResponseMutation =
    api.webauthn.verifyAuthenticationResponse.useMutation({
      onSuccess: async (customToken) => {
        try {
          setIsSigningIn(true)

          const auth = getAuth()
          await signInWithCustomToken(auth, customToken)
        } catch (e) {
          if (e instanceof FirebaseError) {
            if (
              e.code === "auth/invalid-credential" ||
              e.code === "auth/invalid-login-credentials" ||
              e.code === "auth/user-not-found"
            ) {
              setSignInError({
                title: "Invalid credentials",
                message:
                  "The credentials you have used are invalid. Please try again.",
              })
            } else if (e.code === "auth/too-many-requests") {
              setSignInError({
                title: "Too many requests",
                message:
                  "Too many invalid login attempts. Please try again later.",
              })
            } else {
              setSignInError({
                title: "Unknown Firebase error occured",
                message:
                  "An unknown error with Firebase occured. Please check the Console for more information.",
              })

              console.log("Firebase error occured:", e)
            }
          } else {
            setSignInError({
              title: "Unknown error occured",
              message:
                "An unknown error occured. Please check the Console for more information.",
            })

            console.log("Unknown error occured:", e)
          }
        } finally {
          setIsSigningIn(false)
        }
      },
    })

  const { user, role, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (user === null) return

    const redirectPath = getUserRoleRedirectPath(role)
    router.push(redirectPath)
  }, [router, isLoading, user, role])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  })

  const [isSigningIn, setIsSigningIn] = useState(false)
  const [signInError, setSignInError] = useState<null | {
    title: string
    message: string
  }>(null)

  if (isLoading)
    return (
      <>
        <title>RRG Freight Services</title>
        <meta
          name="description"
          content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
        />
        <main className="min-h-screen bg-brand-cyan-100"></main>
      </>
    )

  if (user !== null)
    return (
      <>
        <title>Dashboard &#x2013; RRG Freight Services</title>
        <meta
          name="description"
          content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
        />
        <SkeletonGenericLayout />
      </>
    )

  return (
    <>
      <LoginPageHead />
      <main className="min-h-screen bg-brand-cyan-450 px-3 py-24 pb-3 relative">
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
                  {...register("email", {
                    onChange: () => setSignInError(null),
                  })}
                />
                {errors.email && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              {signInError && (
                <p className="text-red-600 text-center mt-3">
                  {signInError.message}
                </p>
              )}
              <button
                type="submit"
                disabled={
                  generateAuthenticationOptionsMutation.isLoading ||
                  verifyAuthenticationResponseMutation.isLoading ||
                  isSigningIn
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

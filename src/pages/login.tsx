import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useEffect, useState } from "react"
import { FirebaseError } from "firebase/app"
import { useSession } from "@/utils/auth"
import { useRouter } from "next/router"
import { Eye } from "@phosphor-icons/react/Eye"
import { EyeSlash } from "@phosphor-icons/react/EyeSlash"

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(8, {
      message: "Your password should be at least 8 characters long",
    }),
})

type FormType = z.infer<typeof formSchema>

function LoginPageHead() {
  return (
    <Head>
      <title>Login &#x2013; RRG Freight Services</title>
      <meta
        name="description"
        content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
      />
    </Head>
  )
}

export default function LoginPage() {
  const { user, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    if (isLoading) return

    if (user !== null) router.push("/")
  }, [router, isLoading, user])

  const {
    reset,
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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  if (isLoading || user !== null)
    return (
      <>
        <LoginPageHead />
        <main className="min-h-screen bg-brand-cyan"></main>
      </>
    )

  return (
    <>
      <LoginPageHead />
      <main className="min-h-screen bg-brand-cyan px-3 py-24 pb-3 relative">
        <div className="absolute inset-0 h-full sm:grid grid-cols-2 hidden">
          <Image
            src="/assets/img/login/left-bg.png"
            alt="Shipping port"
            className="h-full w-full object-cover"
            width={600}
            height={800}
          />
          <div className="flex flex-col justify-between items-end">
            <Image
              src="/assets/img/logos/logo-with-name.png"
              alt="RRG Freight Services logo with its name on the right"
              className="w-56 h-20 mt-12 mr-12"
              width={224}
              height={80}
            />

            <Image
              src="/assets/img/login/right-bg.png"
              alt="Ship, truck, and plane on a globe"
              className="w-full object-contain object-right-bottom"
              width={600}
              height={384}
            />
          </div>
        </div>
        <section className="max-w-md mx-auto bg-white px-4 py-3 rounded-md shadow-lg relative">
          <div className="px-4 sm:px-8 pb-8">
            <div className="pb-6 pt-10">
              <div className="flex justify-center mb-2">
                <Image
                  alt="RRG Freight Services logo"
                  src="/assets/img/logos/logo.png"
                  className="w-24 h-24"
                  width={96}
                  height={96}
                />
              </div>
              <p className="text-center text-xl font-semibold">
                Enter Your Credentials
              </p>
            </div>
            <form
              onSubmit={handleSubmit(async (formData) => {
                try {
                  setIsSigningIn(true)
                  const auth = getAuth()
                  await signInWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                  )
                } catch (e) {
                  if (e instanceof FirebaseError) {
                    if (
                      e.code === "auth/invalid-login-credentials" ||
                      e.code === "auth/wrong-password" ||
                      e.code === "auth/user-not-found"
                    ) {
                      setSignInError({
                        title: "Invalid email or password",
                        message:
                          "The email or password you have entered is incorrect. Please try again.",
                      })

                      reset((originalValues) => ({
                        email: originalValues.email,
                        password: "",
                      }))
                      return
                    }

                    if (e.code === "auth/too-many-requests") {
                      setSignInError({
                        title: "Too many requests",
                        message:
                          "Too many requests invalid login attempts. Please try again later.",
                      })

                      reset((originalValues) => ({
                        email: originalValues.email,
                        password: "",
                      }))
                      return
                    }

                    setSignInError({
                      title: "Unknown Firebase error occured",
                      message:
                        "An unknown error with Firebase occured. Please check the Console for more information.",
                    })

                    reset((originalValues) => ({
                      email: originalValues.email,
                      password: "",
                    }))

                    console.log("Firebase error occured:", e)
                    return
                  }

                  setSignInError({
                    title: "Unknown error occured",
                    message:
                      "An unknown error occured. Please check the Console for more information.",
                  })

                  reset((originalValues) => ({
                    email: originalValues.email,
                    password: "",
                  }))

                  console.log("Unknown error occured:", e)
                } finally {
                  setIsSigningIn(false)
                }
              })}
            >
              <div>
                <input
                  type="text"
                  placeholder="Email"
                  className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                  {...register("email", {
                    onChange: () => setSignInError(null),
                  })}
                />
                {errors.email && (
                  <p className="text-red-600 mt-1">{errors.email.message}.</p>
                )}
              </div>
              <div className="mt-4">
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Password"
                    className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    {...register("password", {
                      onChange: () => setSignInError(null),
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5"
                    onClick={() =>
                      setIsPasswordVisible(
                        (currentIsPasswordVisible) => !currentIsPasswordVisible
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
                  <p className="text-red-600 mt-1">
                    {errors.password.message}.
                  </p>
                )}
              </div>
              <div className="text-right mt-1">
                <Link href="/forgot-password" className="text-sm">
                  Forgot Password?
                </Link>
              </div>
              {signInError && (
                <p className="text-red-600 text-center mt-3">
                  {signInError.message}
                </p>
              )}
              <button
                type="submit"
                disabled={isSigningIn}
                className="font-semibold w-full mt-4 px-8 py-2.5 leading-5 text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 disabled:bg-blue-300"
              >
                Sign in
              </button>
            </form>
          </div>
          <div className="text-sm">
            <Link href="/">&lt; Back to Homepage</Link>
          </div>
        </section>
      </main>
    </>
  )
}

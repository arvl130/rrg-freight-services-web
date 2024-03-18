import Image from "next/image"
import Link from "next/link"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr/CaretLeft"
import { LoginPageHead } from "./login-page-head"
import { validateSessionFromCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import { signInWithEmailAndPasswordAction } from "@/server/actions/auth"

export default async function LoginPage() {
  const session = await validateSessionFromCookies()
  if (session) {
    const redirectPath = getUserRoleRedirectPath(session.user.role)
    return redirect(redirectPath)
  }

  return (
    <>
      <LoginPageHead />
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
            <form action={signInWithEmailAndPasswordAction}>
              <div>
                <label className="font-medium block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                />
              </div>
              <div className="mt-4">
                <label className="font-medium block mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                  />
                </div>
              </div>
              <div className="text-right mt-1">
                <Link href="/forgot-password" className="text-sm">
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
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

            <Link href="/login/authenticator">Use an Authenticator</Link>
          </div>
        </section>
      </main>
    </>
  )
}

import Image from "next/image"
import Link from "next/link"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr/CaretLeft"
import { validateSessionWithCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import { LoginForm } from "./login-form"

export default async function LoginPage() {
  const { user } = await validateSessionWithCookies()
  if (user) {
    const redirectPath = getUserRoleRedirectPath(user.role)
    return redirect(redirectPath)
  }

  return (
    <>
      <title>Login &#x2013; RRG Freight Services</title>
      <main className="min-h-dvh bg-brand-cyan-450 px-3 py-24 pb-3 relative">
        <div className="absolute inset-0 h-full sm:grid grid-cols-2 hidden"></div>
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
            <LoginForm />
          </div>
          <div className="text-sm flex justify-between">
            <Link href="/" className="inline-flex items-center">
              <CaretLeft height={12} /> Back to Homepage
            </Link>

            <Link href="/login">Use an Authenticator</Link>
          </div>
        </section>
      </main>
    </>
  )
}

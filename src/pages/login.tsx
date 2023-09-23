import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login &#x2013; RRG Freight Services</title>
        <meta
          name="description"
          content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
        />
      </Head>
      <main className="min-h-screen bg-brand-cyan px-3 pt-24 relative">
        <div className="absolute inset-0 h-full sm:grid grid-cols-2 hidden">
          <Image
            src="/assets/img/login/left-bg.png"
            alt="Shipping port"
            className="h-full w-full object-cover"
            width={540}
            height={720}
          />
          <div className="flex flex-col justify-between items-end">
            <Image
              src="/assets/img/logos/logo-with-name.png"
              alt="Ship, truck, and plane on a globe"
              className="w-56 mt-12 mr-12"
              width={600}
              height={400}
            />

            <Image
              src="/assets/img/login/right-bg.png"
              alt="Ship, truck, and plane on a globe"
              className="w-full h-96 object-contain object-right-bottom"
              width={600}
              height={400}
            />
          </div>
        </div>
        <section className="max-w-md mx-auto bg-white px-4 py-3 rounded-md shadow-lg relative">
          <div className="px-4 sm:px-8">
            <div className="pb-6 pt-10">
              <div className="flex justify-center mb-2">
                <Image
                  alt="RRG Freight Services logo"
                  src="/assets/img/logos/logo.png"
                  className="w-24"
                  width={100}
                  height={100}
                />
              </div>
              <p className="text-center text-xl font-semibold">
                Enter Your Credentials
              </p>
            </div>
            <div className="text-right pb-16">
              <input
                type="text"
                placeholder="Email"
                className="text-sm w-full px-4 py-2 mb-4 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              />
              <input
                type="password"
                placeholder="Password"
                className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              />
              <Link href="/forgot-password" className="text-sm">
                Forgot Password?
              </Link>
              <button
                type="submit"
                className="font-semibold w-full mt-6 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400"
              >
                Sign in
              </button>
            </div>
          </div>
          <div className="text-sm">
            <Link href="/">&lt; Back to Homepage</Link>
          </div>
        </section>
      </main>
    </>
  )
}

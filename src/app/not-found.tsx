import Link from "next/link"
import Image from "next/image"
export default async function NotFound() {
  return (
    <>
      <title>Error 404 &#x2013; Page not found</title>
      <main className="min-h-dvh bg-gradient-to-b from-[#79CFDC] from 90% to-[#FFFFFF] to 5%">
        <div className="flex flex-col">
          <Image
            src="/assets/img/not-found/error-404.png"
            alt="..."
            className="self-center mt-10 mb-5"
            width={800}
            height={800}
          />
          <p className="font-bold text-center text-2xl mb-10">
            Error 404: Something isn&apos;t working or is missing, <br />
            We apologize for this problem
          </p>
        </div>
        <div className="flex justify-center">
          <Link
            href="/"
            className="rounded-lg bg-[#1A6480] text-white font-bold px-5 py-3"
          >
            Go to our Home
          </Link>
        </div>
      </main>
    </>
  )
}

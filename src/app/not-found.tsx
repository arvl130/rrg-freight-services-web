import Link from "next/link"
import { Error404 } from "@/components/vector/error404"

export default async function NotFound() {
  return (
    <>
      <title>Error 404 &#x2013; Page not found</title>
      <main className="min-h-dvh bg-gradient-to-b from-[#79CFDC] from 90% to-[#FFFFFF] to 5% flex flex-col justify-center">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <Error404 />
          </div>
          <p className="font-bold text-center text-xl sm:text-2xl md:text-2xl lg:text-2xl ">
            Error 404: Something isn&apos;t working or is missing, <br />
            We apologize for this problem
          </p>
        </div>
        <div className="flex justify-center">
          <Link
            href="/"
            className="rounded-lg bg-[#1A6480] text-white font-bold px-9 py-3 mt-10 hover:text-[#1A6480] hover:bg-white border-solid border-2 border-[#1A6480]"
          >
            Go to our Home
          </Link>
        </div>
      </main>
    </>
  )
}

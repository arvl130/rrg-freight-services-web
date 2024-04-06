import Link from "next/link"
import Image from "next/image"
import { Error404 } from "@/components/vector/error404"
export default async function NotFound() {
  return (
    <>
      <title>Error 404 &#x2013; Page not found</title>
      <main className="min-h-dvh bg-gradient-to-b from-[#79CFDC] from 90% to-[#FFFFFF] to 5%">
        <div className="flex flex-col mx-auto py-10">
          <div className="w-fit mx-auto">
            <Error404 />
          </div>
          <p className="font-bold text-center text-2xl -translate-y-[0px]">
            Error 404: Something isn&apos;t working or is missing, <br />
            We apologize for this problem
          </p>
        </div>
        <div className="flex justify-center -translate-y-[0px]">
          <Link
            href="/"
            className="rounded-lg bg-[#1A6480] text-white font-bold px-9 py-3 mt-10 hover:text-[#1A6480] hover:bg-white border-solid border 2 border-[#1A6480]"
          >
            Go to our Home
          </Link>
        </div>
      </main>
    </>
  )
}

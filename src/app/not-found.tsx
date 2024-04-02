import React from 'react'
import Image from "next/image"
import Link from "next/link"

export default function  NotFound() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#79CFDC] from 95% to-[#FFFFFF] to 5%">
    <div className="flex flex-col m-0">
      <Image
      src="/assets/img/home/error5.png"
      alt="..."
      className="self-center mt-10 pt-10"
      width={800}
      height={800}
      />
      <p className="font-bold text-center text-2xl  pt-3 mb-10">Error 404: Something isn&apos;t working or is missing, <br /> 
      We apologize for this problem</p>
    </div>
    <div className="flex justify-center">
    <Link
    href="/"
    className="rounded-lg bg-[#1A6480] text-white font-bold px-9 py-3 mt-10 hover:text-[#1A6480] hover:bg-white border-solid border 2 border-[#1A6480]" 
    >
    Go to our Home
    </Link>
    </div>
  </main>
  )
}

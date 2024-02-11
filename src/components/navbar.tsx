"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { List } from "@phosphor-icons/react/List"
import { User } from "@phosphor-icons/react/User"
import { getUserRoleRedirectPath, useSession } from "@/utils/auth"

function MobileNav({ hasScrolled }: { hasScrolled: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="md:hidden relative h-full text-white">
      <div className="px-3 h-full flex justify-between items-center  py-3">
        <button
          type="button"
          onClick={() =>
            setIsMobileMenuOpen((currIsMobileMenuOpen) => !currIsMobileMenuOpen)
          }
          className="text-3xl block font-bold focus:outline-none "
        >
          <List />
        </button>

        <Link href="/">
          <Image
            src="/assets/img/logos/logo-header.png"
            alt="Logo of RRG Freight Services"
            width={130}
            height={50}
          />
        </Link>

        <Link href="/login">
          <User className="text-3xl font-bold focus:outline-none" />
        </Link>
      </div>
      {isMobileMenuOpen && (
        <ul
          className={`font-semibold absolute top-20 [background-color:_#79CFDC] px-3 w-full ${
            hasScrolled ? "" : "drop-shadow-xl"
          } space-y-1 pb-3`}
        >
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About Us</Link>
          </li>
          <li>
            <Link href="/#contact-us" passHref>
              Contact Us
            </Link>
          </li>
          <li>
            <Link href="/tracking">Track Package</Link>
          </li>
        </ul>
      )}
    </div>
  )
}

function DesktopNav() {
  const { isLoading, role } = useSession()

  return (
    <div className="hidden md:flex max-w-6xl mx-auto px-6 h-full justify-between items-center text-white font-semibold">
      <Link href="/">
        <Image
          src="/assets/img/logos/logo-header.png"
          alt="Logo of RRG Freight Services"
          width={130}
          height={50}
        />
      </Link>

      <ul className="text-white flex gap-6">
        <li>
          <Link className="py-2" href="/" passHref>
            Home
          </Link>
        </li>
        <li className="relative group">
          <Link className=" text-white py-2" href="/about" passHref>
            About Us
          </Link>
        </li>
        <li>
          <Link className="text-white py-2" href="/#contact-us" passHref>
            Contact Us
          </Link>
        </li>
        <li>
          <Link className="text-white py-2" href="/tracking" passHref>
            Track Package
          </Link>
        </li>
      </ul>

      {isLoading ? (
        <div className="flex items-center text-white">
          <User
            size={30}
            className="text-xl font-bold focus:outline-none text-white"
          />
        </div>
      ) : (
        <Link
          href={getUserRoleRedirectPath(role)}
          className="flex items-center text-white"
        >
          <User
            size={30}
            className="text-xl font-bold focus:outline-none text-white"
          />
        </Link>
      )}
    </div>
  )
}

export function Navbar() {
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      setHasScrolled(scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <div className="h-20 bg-[#79CFDC]"></div>
      <div
        className={`h-20 bg-[#79CFDC] w-full top-0 fixed z-50 transition-all duration-300 ${
          hasScrolled ? "drop-shadow-xl" : ""
        }`}
      >
        <MobileNav hasScrolled={hasScrolled} />
        <DesktopNav />
      </div>
    </>
  )
}

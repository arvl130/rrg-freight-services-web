import { useState, useEffect, useRef, FC } from "react"
import Link from "next/link"
import Image from "next/image"
import { CaretDown } from "@phosphor-icons/react/CaretDown"
import { List } from "@phosphor-icons/react/List"
import { User } from "@phosphor-icons/react/User"

const Navbar: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [showAboutOptions, setShowAboutOptions] = useState<boolean>(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop

      const scrollThreshold = 150

      setIsScrolled(scrollY > scrollThreshold)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className={`z-50 fixed p-5 w-full transition-all duration-300 drop-shadow-xl ${
        isScrolled ? "bg-[#79CFDC]" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center text-white">
        {/* Hamburger Menu (Mobile View) */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="text-3xl font-bold focus:outline-none "
          >
            <List />
          </button>
        </div>

        {/* Logo (Centered) */}
        <div className="text-xl font-bold text-center">
          <Link href="/">
            <Image
              src="/assets/img/logos/logo-header.png"
              alt="Logo"
              width={130}
              height={50}
            />
          </Link>
        </div>

        {/* Login Icon (Right) */}
        <div className="md:hidden">
          <Link href="/login">
            <User className="text-3xl font-bold focus:outline-none" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul
          className={`md:flex ${
            isMobileMenuOpen ? "block" : "hidden"
          } md:space-x-6 md:space-y-0 space-y-2`}
        >
          <li>
            <Link href="/" passHref>
              <div className=" text-white py-2">Home</div>
            </Link>
          </li>
          <li className="relative group">
            <Link href="/about" passHref>
              <div className=" text-white py-2">About Us</div>
            </Link>
          </li>
          <li>
            <Link href="/" passHref>
              <div className="text-white py-2">Contact Us</div>
            </Link>
          </li>
          <li>
            <Link href="/tracking" passHref>
              <div className="text-white py-2">Track Package</div>
            </Link>
          </li>
        </ul>

        {/* Desktop Login Icon (Right) */}
        <div className="hidden md:flex items-center">
          <Link href="/login" className="flex items-center text-white">
            <User
              size={30}
              className="text-xl font-bold focus:outline-none text-white"
            />
            <div className="ml-2">Log in</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar

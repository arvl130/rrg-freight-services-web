import { useState, useEffect, FC } from "react"
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

  const toggleAboutOptions = () => {
    setShowAboutOptions(!showAboutOptions)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop

      const scrollThreshold = 100

      setIsScrolled(scrollY > scrollThreshold)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className={`fixed p-10 w-full transition-all duration-300 ${
        isScrolled ? "bg-[#A4D8D8] opacity-95" : "bg-transparent"
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
            <div
              onClick={toggleAboutOptions}
              className="text-white py-2 cursor-pointer flex items-center"
            >
              About Us <CaretDown size={18} />
            </div>
            <ul
              className={`${
                showAboutOptions ? "block" : "hidden"
              } absolute left-0 space-y-2 bg-white text-black border rounded-md border-gray-300`}
            >
              <li>
                <Link href="/about" passHref>
                  <div className=" py-2">Company Profile</div>
                </Link>
              </li>
              <li>
                <Link href="/about" passHref>
                  <div className=" py-2">Meet the Team</div>
                </Link>
              </li>
            </ul>
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

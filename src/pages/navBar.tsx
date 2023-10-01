<<<<<<< HEAD
import React, { useState, useEffect } from 'react'
import { FiMenu, FiUser } from 'react-icons/fi'
import Link from 'next/link';
import Image from 'next/image'
import { User } from "@phosphor-icons/react/User"
import { CaretDown } from "@phosphor-icons/react/CaretDown" 
=======
import React, { useState, useEffect } from 'react';
import { FiMenu, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { MdKeyboardArrowDown } from 'react-icons/md';
>>>>>>> parent of 9ee14a2 (Revert "feat: added homepage w/ updated nav bar |  added about us")

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showAboutOptions, setShowAboutOptions] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAboutOptions = () => {
    setShowAboutOptions(!showAboutOptions);
  };

  useEffect(() => {
    const handleScroll = () => {
      
      const scrollY = window.scrollY || document.documentElement.scrollTop;

     
      const scrollThreshold = 100; 

      setIsScrolled(scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
<<<<<<< HEAD
      className={`fixed p-10 w-full transition-all duration-300 ${
=======
      className={`fixed p-8 w-full transition-all duration-300 ${
>>>>>>> parent of 9ee14a2 (Revert "feat: added homepage w/ updated nav bar |  added about us")
        isScrolled ? 'bg-[#A4D8D8] opacity-95' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center text-white">
        {/* Hamburger Menu (Mobile View) */}
        <div className="md:hidden">
          <button
<<<<<<< HEAD
            type='button'
=======
>>>>>>> parent of 9ee14a2 (Revert "feat: added homepage w/ updated nav bar |  added about us")
            onClick={toggleMobileMenu}
            className="text-3xl font-bold focus:outline-none "
          >
            <FiMenu />
          </button>
        </div>

        {/* Logo (Centered) */}
        <div className="text-xl font-bold text-center">
          <Link href="/">
            <Image
              src="/assets/img/logos/logo-header.png"
              alt="Logo"
<<<<<<< HEAD
              width={130}
              height={50}
=======
              width={120}
              height={40}
>>>>>>> parent of 9ee14a2 (Revert "feat: added homepage w/ updated nav bar |  added about us")
            />
          </Link>
        </div>

        {/* Login Icon (Right) */}
        <div className="md:hidden">
          <Link href="/login">
            <FiUser className="text-3xl font-bold focus:outline-none" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul
          className={`md:flex ${
            isMobileMenuOpen ? 'block' : 'hidden'
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
<<<<<<< HEAD
              About Us  <CaretDown size={18} />
=======
              About Us  <MdKeyboardArrowDown className="ml-1" />
>>>>>>> parent of 9ee14a2 (Revert "feat: added homepage w/ updated nav bar |  added about us")
            </div>
            <ul
              className={`${
                showAboutOptions ? 'block' : 'hidden'
              } absolute left-0 space-y-2 bg-white text-black border rounded-md border-gray-300`}
            >
              <li>
<<<<<<< HEAD
                <Link href="/about" passHref>
=======
                <Link href="/" passHref>
>>>>>>> parent of 9ee14a2 (Revert "feat: added homepage w/ updated nav bar |  added about us")
                  <div className=" py-2">Company Profile</div>  
                </Link>
              </li>
              <li>
<<<<<<< HEAD
                <Link href="/about" passHref>
=======
                <Link href="/" passHref>
>>>>>>> parent of 9ee14a2 (Revert "feat: added homepage w/ updated nav bar |  added about us")
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
<<<<<<< HEAD
            <Link href="/tracking" passHref>
=======
            <Link href="/" passHref>
>>>>>>> parent of 9ee14a2 (Revert "feat: added homepage w/ updated nav bar |  added about us")
              <div className="text-white py-2">Track Package</div>
            </Link>
          </li>
        </ul>

        {/* Desktop Login Icon (Right) */}
        <div className="hidden md:flex items-center">
          <Link href="/login" className="flex items-center text-white">
<<<<<<< HEAD
            <User size={30} className="text-xl font-bold focus:outline-none text-white" />
=======
            <FiUser className="text-xl font-bold focus:outline-none text-white" />
>>>>>>> parent of 9ee14a2 (Revert "feat: added homepage w/ updated nav bar |  added about us")
            <div className="ml-2">Log in</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

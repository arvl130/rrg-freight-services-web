import Image from "next/image"
import Link from "next/link"
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple"
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone"

export function Footer() {
  return (
    <footer className="bg-[#acdee2]">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-10">
        <div className="md:flex md:justify-between">
          <div className="mb-5 md:mb-0  hidden md:block">
            <a href="#" className="flex items-center">
              <Image
                src="/assets/img/logos/logo-footer.png"
                className="image w-[45%] mx-20 my-5"
                alt="RRG Freight Services Logo"
                width={250}
                height={250}
              />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 dark:text-black">
                Useful Links
              </h2>
              <ul className="text-gray-500 dark:text-gray-700 font-medium">
                <li className="mb-4">
                  <Link href="/login" className="hover:underline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/tracking" className="hover:underline">
                    Tracking page
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 dark:text-black">
                Company
              </h2>
              <ul className="text-gray-500 dark:text-gray-700 font-medium">
                <li className="mb-5">
                  <Link href="/about" className="hover:underline ">
                    About Us
                  </Link>
                </li>
                <li className="mb-5">
                  <Link href="/about" className="hover:underline">
                    Mission and Vision
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 dark:text-black">
                Legal
              </h2>
              <ul className="text-gray-500 dark:text-gray-700 font-medium">
                <li className="mb-4">
                  <Link href="/privacy-and-policy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-condition" className="hover:underline">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © 2023{" "}
            <Link href="#" className="hover:underline">
              RRG FREIGHT SERVICES
            </Link>
          </span>
          <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
            <Link
              href="#"
              className="text-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              <EnvelopeSimple size={25} color="#1e2324" weight="bold" />
            </Link>
            <span className="flex m-0">
              <Phone className="mr-3" size={26} color="#000000" weight="bold" />{" "}
              (+02)84616027
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

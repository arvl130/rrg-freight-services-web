import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple"
import { FacebookLogo } from "@phosphor-icons/react/dist/ssr/FacebookLogo"
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr/InstagramLogo"
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin"
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone"
import { TwitterLogo } from "@phosphor-icons/react/dist/ssr/TwitterLogo"
import Link from "next/link"

export function ContactSection() {
  return (
    <section
      id="contact-us"
      style={{
        background:
          "linear-gradient(#FFFFFF 10%, #79CFDC 5%, #79CFDC 90%, #FFFFFF 90%)",
      }}
      key="section5"
      className=" w-1920 my-20"
    >
      <div className="drop-shadow-[-5px_10px_10px_rgba(0,0,0,0.25)] w-full px-10 flex md:w-2/3 md:m-auto">
        {/*LEFT SIDE */}
        <div
          style={{
            background: "linear-gradient(to right ,#A4D8D8 ,#2BC0E4)",
          }}
          className="hidden relative w-1/2 bg-[#FFFFFF] rounded-l-xl lg:block"
        >
          <div className="flex justify-center items-center h-2/3">
            <p
              style={{ textShadow: "3px 3px gray" }}
              className="text-[40px] -rotate-90  h-1/2 flex text-white font-semibold"
            >
              CONTACT US!
            </p>
          </div>

          <div className="flex justify-evenly pt-20">
            <div>
              <Link href="#">
                <InstagramLogo size={35} color="#FFFFFF" weight="bold" />
              </Link>
            </div>
            <div>
              <Link href="#">
                <FacebookLogo size={35} color="#FFFFFF" weight="bold" />
              </Link>
            </div>
            <div>
              <Link href="#">
                <TwitterLogo size={35} color="#FFFFFF" weight="bold" />
              </Link>
            </div>
          </div>
        </div>

        {/*RIGHT SIDE */}
        <div className="w-full bg-[#FFFFFF] p-2 rounded-xl lg:rounded-l-none">
          <div>
            <p className="text-center mt-5 text-[27px] font-semibold ">
              Get in touch!
            </p>
            <p className="text-center font-medium">
              Contact us for help, testimonies, or join our team
            </p>
          </div>

          <div className="flex justify-around w-2/2 m-auto mt-8 mb-10 px-5">
            <div className="flex flex-col items-center w-1/3">
              <MapPin size={40} color="#000000" weight="duotone" />
              <p className="text-[12px] text-center hidden sm:block">
                Blk 213 Lot 41 Yuan Street Phase 8 North Fairview
              </p>
            </div>
            <div className="flex flex-col items-center w-1/3">
              <Phone size={40} color="#000000" weight="duotone" />
              <p className="text-[12px] text-center hidden sm:block">
                (+02)84616027
              </p>
            </div>
            <div className="flex flex-col items-center w-1/3">
              <EnvelopeSimple size={40} color="#000000" weight="duotone" />
              <p className="text-[12px] text-center hidden sm:block">
                rrgfreight_imports@yahoo.com
              </p>
            </div>
          </div>

          <div className="pb-4">
            <form className="w-2/3 m-auto">
              <div className="flex flex-col mb-3">
                <label className="mb-1">Full Name</label>
                <input
                  type="text"
                  style={{ borderBottom: "2px solid #79CFDC" }}
                  className="outline-none px-2"
                  required
                ></input>
              </div>
              <div className="flex flex-col mb-3">
                <label className="mb-1">Email Address</label>
                <input
                  type="email"
                  style={{ borderBottom: "2px solid #79CFDC" }}
                  className="outline-none px-2"
                  required
                ></input>
              </div>
              <div className="flex flex-col mb-3">
                <label className="mb-1">Message</label>
                <textarea
                  style={{ borderBottom: "2px solid #79CFDC" }}
                  className="outline-none px-2"
                  required
                ></textarea>
              </div>
              <div className="flex flex-col mb-3">
                <button
                  style={{ borderRadius: "10px" }}
                  className="p-2 bg-red-500 text-white font-semibold duration-500 hover:bg-red-800"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

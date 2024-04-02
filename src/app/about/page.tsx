import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Path } from "@phosphor-icons/react/dist/ssr/Path"
import Link from "next/link"
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone"
import { Envelope } from "@phosphor-icons/react/dist/ssr/Envelope"
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock"
import { GlobePlaneVector } from "@/components/vector/globe-plane"
import { validateSessionWithCookies } from "@/server/auth"

function HeroSection() {
  return (
    <section>
      <div className="[background-color:_#79CFDC]">
        <div className="min-h-[60vh] max-w-6xl mx-auto grid md:grid-cols-2">
          <div className="flex flex-col justify-center text-white font-semibold">
            <p className="text-4xl w-full text-center mb-3">About Us</p>
            <p className="text-2xl w-full text-center">
              Learn about our company.{" "}
            </p>
          </div>
          <div className="hidden md:flex items-center h-full w-full">
            <div className="w-full max-w-sm mx-auto">
              <GlobePlaneVector />
            </div>
          </div>
        </div>
      </div>
      <div className="h-24 bg-gradient-to-b from-[#79CFDC] to-white"></div>
    </section>
  )
}

export default async function AboutUsPage() {
  const { user } = await validateSessionWithCookies()

  return (
    <>
      <title>About Us &#x2013; RRG Freight Services</title>
      <Navbar user={user} />
      <main>
        <HeroSection />

        <div className="container mx-auto px-8 mt-16">
          <div className="text-3xl font-bold mb-6">Company Profile</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {/* About RRG */}
            <div className="bg-white p-6 rounded-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]">
              <h2 className="text-xl font-bold mb-2">About RRG</h2>
              <p className="text-sm">
                RRG FREIGHT SERVICES is a Domestic and International Freight
                Forwarder founded by its proprietor Mr. Rafael C. Fabia located
                in Blk 213 Lot 41 Yuan Street Phase 8 North Fairview, Quezon
                City, Philippines, inspired by the New Heroes the OFW&apos;s.
              </p>
            </div>
            {/* Mission */}
            <div className="bg-white p-6 rounded-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]">
              <h2 className="text-xl font-bold mb-2">Mission</h2>
              <p className="text-sm">
                To import an exemplary service in the domestic and international
                transportation and logistics service in the market, by working
                hard we accord to our valued customer the greatest satisfaction
                they need. Delivering Love.
              </p>
            </div>
            {/* Vision */}
            <div className="bg-white p-6 rounded-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]">
              <h2 className="text-xl font-bold mb-2">Vision</h2>
              <p className="text-sm">
                To be one of the best and most trusted companies both nationally
                and internationally in the field of forwarding company.
              </p>
            </div>
          </div>
        </div>

        <div className="text-4xl font-bold text-center my-20">
          Meet the Team
        </div>
        <section className="bg-white  grid grid-cols-2 gap-10 flex-col  mx-8 my-10 lg:px-28 md:grid-cols-4 ">
          <div className="w-full">
            <Image
              src="/assets/img/about/ceo.png"
              alt="..."
              className="w-11/12 items-center m-auto  rounded-br-[126px] rounded-tl-[120px] shadow hover:shadow-[20px_0_25px_0_rgba(0,0,0,0.7)] hover:bg-sky-400"
              width={700}
              height={800}
            />
            <div className="text-center text-[12px] md:text-[16px] mt-3">
              Rafael C. Fabia
              <div className="font-bold">Chief Executive Officer</div>
            </div>
          </div>

          <div>
            <Image
              src="/assets/img/about/om.png"
              alt="..."
              className="w-11/12 items-center m-auto  rounded-br-[126px] rounded-tl-[120px] shadow hover:shadow-[20px_0_25px_0_rgba(0,0,0,0.7)] hover:bg-sky-400"
              width={600}
              height={800}
            />
            <div className="text-center text-[12px] md:text-[16px] mt-3">
              Gina F. Mengote
              <div className="font-bold">Operation Manager</div>
            </div>
          </div>

          <div>
            <Image
              src="/assets/img/about/sec.png"
              alt="..."
              className="w-11/12 items-center m-auto  rounded-br-[126px] rounded-tl-[120px] shadow hover:shadow-[20px_0_25px_0_rgba(0,0,0,0.7)] hover:bg-sky-400"
              width={600}
              height={800}
            />
            <div className="text-center text-[12px] md:text-[16px] mt-3">
              Clarissa E. Fabia
              <div className="font-bold">Secretary</div>
            </div>
          </div>

          <div>
            <Image
              src="/assets/img/about/billing.png"
              alt="..."
              className="w-11/12 items-center m-auto  rounded-br-[126px] rounded-tl-[120px] shadow hover:shadow-[20px_0_25px_0_rgba(0,0,0,0.7)] hover:bg-sky-400"
              width={600}
              height={800}
            />
            <div className="text-center text-[12px] md:text-[16px] mt-3">
              Joanne B. Dacuba
              <div className="font-bold">Billing Incharge</div>
            </div>
          </div>
        </section>

        <section className="bg-white  grid grid-cols-3 gap-10 flex-col  mx-12 my-10 lg:px-28 md:mx-40 ">
          <div className="w-full">
            <Image
              src="/assets/img/about/import.png"
              alt="..."
              className="w-11/12 items-center m-auto  rounded-br-[126px] rounded-tl-[120px] shadow hover:shadow-[20px_0_25px_0_rgba(0,0,0,0.7)] hover:bg-sky-400"
              width={600}
              height={800}
            />
            <div className="text-center text-[12px] md:text-[16px] mt-3">
              John Jerecho C. Valenzuela
              <div className="font-bold">Import Incharge</div>
            </div>
          </div>

          <div>
            <Image
              src="/assets/img/about/messenger.png"
              alt="..."
              className="w-11/12 items-center m-auto  rounded-br-[126px] rounded-tl-[120px] shadow hover:shadow-[20px_0_25px_0_rgba(0,0,0,0.7)] hover:bg-sky-400"
              width={600}
              height={800}
            />
            <div className="text-center text-[12px] md:text-[16px] mt-3">
              Mark Sherwin Valenzuela
              <div className="font-bold">Messenger</div>
            </div>
          </div>

          <div>
            <Image
              src="/assets/img/about/csr.png"
              alt="..."
              className="w-11/12 items-center m-auto  rounded-br-[126px] rounded-tl-[120px] shadow hover:shadow-[20px_0_25px_0_rgba(0,0,0,0.7)] hover:bg-sky-400"
              width={600}
              height={800}
            />
            <div className="text-center text-[12px] md:text-[16px] mt-3">
              Henry D. Lumansoc
              <div className="font-bold">Customs Reprenstative</div>
            </div>
          </div>
        </section>

        <section className="py-10 bg-[#79CFDC] mb-20">
          <div className="block px-10 md:flex md:justify-center">
            <div className="m-0 mb-5 md:mr-10">
              <Image
                src="/assets/img/about/office.jpg"
                alt="..."
                className="m-auto rounded-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]"
                width={500}
                height={450}
              />
            </div>
            <div className="flex justify-center items-center ">
              <div>
                <h1 className="text-[30px] font-semibold">
                  RRG Freight Services
                </h1>
                <p className="font-medium mb-3">
                  Blk 213 Lot 41 Yuan Street Phase 8 North Fairview
                </p>
                <ul className="font-medium">
                  <li className="flex items-center mb-2">
                    <Phone
                      className="mr-3"
                      size={26}
                      color="#000000"
                      weight="light"
                    />{" "}
                    (+02)84616027
                  </li>
                  <li className="flex items-center mb-2">
                    <Envelope
                      className="mr-3"
                      size={26}
                      color="#000000"
                      weight="light"
                    />{" "}
                    rrgfreight_imports@yahoo.com
                  </li>{" "}
                  <li className="flex items-center mb-2">
                    <Clock
                      className="mr-3"
                      size={26}
                      color="#000000"
                      weight="light"
                    />{" "}
                    <div>
                      <p>Office Hours</p>
                      <p>9:00 AM To 6:00PM</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="p-3 h-[350px] bg-[url('/assets/img/about/boxes.png')] bg-cover bg-no-repeat bg-center  flex justify-center items-center">
          <div>
            <h1 className="text-center text-[40px] text-white font-semibold">
              Want to track your Package? <br /> Track it now here!
            </h1>
            <div className="flex justify-center">
              <Link href={"/tracking"}>
                <button className="drop-shadow-lg inline-flex items-center bg-red-500 text-white px-6 py-2 text-base rounded-full hover:bg-red-800 font-bold font-family  ">
                  Track Now{" "}
                  <Path
                    className="ml-1"
                    size={22}
                    color="#FFFFFF"
                    weight="thin"
                  />
                </button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}

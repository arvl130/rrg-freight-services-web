import Head from "next/head"
import Navbar from "@/components/navBar"
import Footer from "@/components/footer"
import Image from "next/image"
import { Path } from "@phosphor-icons/react/dist/icons/Path"
import Link from "next/link"
import { Phone } from "@phosphor-icons/react/dist/icons/Phone"
import { Envelope } from "@phosphor-icons/react/dist/icons/Envelope"
import { Clock } from "@phosphor-icons/react/dist/icons/Clock"
import Globe from "@/components/icons/globe"

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <Head>
        <title>About Us &#x2013; RRG Freight Services</title>
        <meta
          name="description"
          content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
        />
      </Head>
      <main className="flex flex-col">
        <div className=" container max-w-fit  max-h-px">
          <section
            style={{ background: "linear-gradient(#79CFDC 90%, #FFFFFF)" }}
            className=" w-1920 h-734  "
          >
            <div
              style={{
                minWidth: "100%",
                background: "linear-gradient(#79CFDC 80%, #FFFFFF)",
              }}
              className="relative min-h-[450px] md:min-h-[650px]"
            >
              <p
                style={{ letterSpacing: "2px", textShadow: "2px 2px #707070" }}
                className="flex flex-col text-[70px] text-white text-center w-full pt-[200px] font-bold leading-none tracking-wide lg:absolute lg:w-[650px] lg:top-[40%] lg:left-32 lg:text-left lg:pt-0"
              >
                About Us
                <span className="text-base font-normal">
                  Learn about our company.
                </span>
              </p>
              <div className="absolute right-0 bottom-20 hidden md:block">
                <Globe></Globe>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-8 mt-16">
            <div className="text-3xl font-bold mb-6">Company Profile</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {/* About RRG */}
              <div className="bg-white p-6 rounded-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]">
                <h2 className="text-xl font-bold mb-2">About RRG</h2>
                <p className="text-sm">
                  RRG FREIGHT SERVICES is a Domestic and International Freight
                  Forwarder founded by its proprietor Mr. Rafael C. Fabia
                  located in Blk 213 Lot 41 Yuan Street Phase 8 North Fairview,
                  Quezon City, Philippines, inspired by the New Heroes the
                  OFW&apos;s.
                </p>
              </div>
              {/* Mission */}
              <div className="bg-white p-6 rounded-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]">
                <h2 className="text-xl font-bold mb-2">Mission</h2>
                <p className="text-sm">
                  To import an exemplary service in the domestic and
                  international transportation and logistics service in the
                  market, by working hard we accord to our valued customer the
                  greatest satisfaction they need. Delivering Love.
                </p>
              </div>
              {/* Vision */}
              <div className="bg-white p-6 rounded-lg drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)]">
                <h2 className="text-xl font-bold mb-2">Vision</h2>
                <p className="text-sm">
                  To be one of the best and most trusted companies both
                  nationally and internationally in the field of forwarding
                  company.
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
                className="w-11/12 items-center m-auto "
                width={600}
                height={800}
              />
              <div className="text-center text-[12px] md:text-[16px]">
                Rafael C. Fabia
                <div className="font-bold">Chief Executive Officer</div>
              </div>
            </div>

            <div>
              <Image
                src="/assets/img/about/om.png"
                alt="..."
                className="w-11/12 items-center m-auto"
                width={600}
                height={800}
              />
              <div className="text-center text-[12px] md:text-[16px]">
                Gina F. Mengote
                <div className="font-bold">Operation Manager</div>
              </div>
            </div>

            <div>
              <Image
                src="/assets/img/about/sec.png"
                alt="..."
                className="w-11/12 items-center m-auto"
                width={600}
                height={800}
              />
              <div className="text-center text-[12px] md:text-[16px]">
                Clarissa E. Fabia
                <div className="font-bold">Secretary</div>
              </div>
            </div>

            <div>
              <Image
                src="/assets/img/about/billing.png"
                alt="..."
                className="w-11/12 items-center m-auto"
                width={600}
                height={800}
              />
              <div className="text-center text-[12px] md:text-[16px]">
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
                className="w-11/12 items-center m-auto "
                width={600}
                height={800}
              />
              <div className="text-center text-[12px] md:text-[16px]">
                John Jerecho C. Valenzuela
                <div className="font-bold">Import Incharge</div>
              </div>
            </div>

            <div>
              <Image
                src="/assets/img/about/messenger.png"
                alt="..."
                className="w-11/12 items-center m-auto"
                width={600}
                height={800}
              />
              <div className="text-center text-[12px] md:text-[16px]">
                Mark Sherwin Valenzuela
                <div className="font-bold">Messenger</div>
              </div>
            </div>

            <div>
              <Image
                src="/assets/img/about/csr.png"
                alt="..."
                className="w-11/12 items-center m-auto"
                width={600}
                height={800}
              />
              <div className="text-center text-[12px] md:text-[16px]">
                Henry D. Lumansoc
                <div className="font-bold">Customs Reprenstative</div>
              </div>
            </div>
          </section>

          <section
            style={{
              background:
                "linear-gradient(#FFFFFF 0%, #79CFDC 10%, #79CFDC 95%, #FFFFFF 100%)",
            }}
            className="py-10  mb-20"
          >
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
        </div>
      </main>
    </>
  )
}

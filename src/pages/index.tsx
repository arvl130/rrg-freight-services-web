import Head from "next/head"
import Link from "next/link"
import { FC } from "react"
import { Navbar } from "@/components/navbar"
import Image from "next/image"
import Footer from "@/components/footer"
import { MapPin } from "@phosphor-icons/react/MapPin"
import { Phone } from "@phosphor-icons/react/Phone"
import { EnvelopeSimple } from "@phosphor-icons/react/EnvelopeSimple"
import { InstagramLogo } from "@phosphor-icons/react/InstagramLogo"
import { FacebookLogo } from "@phosphor-icons/react/FacebookLogo"
import { TwitterLogo } from "@phosphor-icons/react/TwitterLogo"
import { Quotes } from "@phosphor-icons/react/Quotes"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { CaretRight } from "@phosphor-icons/react/dist/icons/CaretRight"
import { Path } from "@phosphor-icons/react/dist/icons/Path"
import { ShipVector } from "@/components/vector/ship"
import { PersonCarryingPackageVector } from "@/components/vector/person-carrying-package"

const images = [
  "/assets/img/home/ship1.jpg",
  "/assets/img/home/ship2.jpg",
  "/assets/img/home/ship3.jpg",
]

function HeroSection() {
  return (
    <section className="[background-color:_#79CFDC] relative">
      <div className="min-h-[60vh] max-w-6xl mx-auto grid md:grid-cols-2 px-6">
        <div className="flex flex-col justify-center text-white font-semibold">
          <p className="text-4xl w-full text-center mb-3 max-w-md mx-auto">
            Don&apos;t leave your shipments to chance.
          </p>
          <p className="text-2xl w-full text-center">
            Take charge of your logistics today.
          </p>
        </div>
        <div className="hidden md:flex items-end">
          <div className="w-full max-w-lg mx-auto translate-y-24">
            <ShipVector />
          </div>
        </div>
      </div>
      <div className="h-24 bg-gradient-to-b from-[#79CFDC] to-white"></div>
    </section>
  )
}

function TrackSection() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12 sm:grid grid-cols-[minmax(0,_1fr)_minmax(0,_3fr)] gap-12">
      {/* Track Section */}
      <div className="hidden sm:flex justify-end">
        <div className="h-96 w-fit">
          <PersonCarryingPackageVector />
        </div>
      </div>
      <div className="flex flex-col justify-center font-bold text-center text-3xl sm:text-left">
        <p className="max-w-md leading-relaxed">
          Track now your package and ensure your cargo arrives safely and on
          schedule!
        </p>

        <div>
          <Link
            href="/tracking"
            className="drop-shadow-lg inline-flex items-center gap-1 bg-red-500 hover:bg-red-400 transition-colors text-white px-6 py-3.5 text-base rounded-full font-bold font-family my-5"
          >
            <span>Track Now</span>
            <Path className="ml-1" size={22} color="#FFFFFF" weight="thin" />
          </Link>
        </div>
      </div>
    </section>
  )
}

const HomePage: FC = () => {
  return (
    <>
      <Head>
        <title>Homepage &#x2013; RRG Freight Services</title>
      </Head>
      <Navbar />

      <main>
        <HeroSection />
        <TrackSection />

        <section key="section3">
          {/* Carousel section */}

          <div
            style={{
              background: "#79CFDC",
            }}
            className=" w-fullscreen flex px-10 py-[20px] md:py-[60px]"
          >
            <div className="drop-shadow-lg m-auto">
              <Carousel
                showStatus={false}
                showThumbs={false}
                useKeyboardArrows={true}
              >
                {images.map((URL, index) => (
                  <div
                    style={{ borderRadius: "10px" }}
                    key={index}
                    className="slide"
                  >
                    <Image
                      style={{ borderRadius: "10px" }}
                      src={URL}
                      alt="ship"
                      width={616}
                      height={370}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            <div className="hidden text-white m-auto px-12 md:block">
              <div className="flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-5">About RRG</h2>
                <p className="ml-5 mb-10">
                  RRG FREIGHT SERVICES is a Domestic and International Freight
                  Forwarder founded by its proprietor Mr. Rafael C. Fabia
                  located in Blk 213 Lot 41 Yuan Street Phase 8 North Fairview,
                  Quezon City, Philippines, inspired by the New Heroes the
                  OFW&apos;s.
                </p>
              </div>
              <Link href="/about">
                <button
                  style={{ borderRadius: "20px" }}
                  className="group p-3 px-4 bg-[#FFFFFF] text-[#79CFDC] font-bold hover:bg-slate-200 flex items-center	transition duration-500"
                >
                  Learn More{" "}
                  <CaretRight
                    className=" group-hover:ml-[10px]  duration-500"
                    size={22}
                    color="#79CFDC"
                    weight="thin"
                  />
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section key="section4">
          {/* Testimonials Section */}
          <div className="bg-white">
            <div className="text-center my-1 md:my-3">
              <div className="font-size font-semibold text-2xl sm:text-2xl md:text-3xl lg:text-4xl my-2 sm:my-15 ">
                <p className="py-3 mt-10">RRG CLIENTS TESTIMONIALS</p>
              </div>
            </div>
          </div>
        </section>
        <section>
          {/* Testimonial Cards */}
          <div className="py-2">
            <div className="max-w-6xl mx-auto flex flex-wrap justify-center">
              {/* Testimonial Card 1 */}
              <div className="w-full md:w-1/2 lg:w-1/3 p-5 md:p-5">
                <div className="min-h-[100%] drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)] bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl text-gray-600 mb-4">
                    <Quotes size={32} weight="fill" /> {/* Quotation Icon */}
                  </div>
                  <p className="text-lg text-gray-800 mb-4">
                    RRG Freight Company is like the James Bond of logistics
                    always on a top-secret mission to deliver packages with
                    unmatched precision and style. I&apos;m convinced your
                    trucks come equipped with secret agent gadgets and a license
                    to thrill every client with lightning-fast deliveries.
                  </p>
                  <div className="text-3xl text-gray-600 mb-4">
                    <i className="far fa-comment-dots"></i> {/* Comment Icon */}
                  </div>
                  <p className="text-lg text-gray-800">&#x2013; John Doe</p>
                </div>
              </div>

              {/* Testimonial Card 2 */}
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="min-h-[100%] drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)] bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl text-gray-600 mb-4">
                    <Quotes size={32} weight="fill" /> {/* Quotation Icon */}
                  </div>
                  <p className="text-lg text-gray-800 mb-4">
                    RRG Freight Company doesn&apos;t just transport goods;
                    you&apos;re the magicians of moving merchandise! I&apos;ve
                    heard rumors that your trucks have a magical touch, turning
                    traffic jams into open highways and transforming delivery
                    deadlines into mere suggestions. It&apos;s like watching a
                    magical spectacle every time RRG hits the road!
                  </p>
                  <div className="text-3xl text-gray-600 mb-4">
                    <i className="far fa-comment-dots"></i> {/* Comment Icon */}
                  </div>
                  <p className="text-lg text-gray-800">&#x2013; Jane Smith</p>
                </div>
              </div>

              {/* Testimonial Card 3 */}
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="min-h-[100%] drop-shadow-[0_5px_5px_rgba(0,0,0,0.25)] bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl text-gray-600 mb-4">
                    <Quotes size={32} weight="fill" /> {/* Quotation Icon */}
                  </div>
                  <p className="text-lg text-gray-800 mb-4">
                    RRG Freight Company, you&apos;re the rock stars of the
                    shipping world! Your trucks are like tour buses on a
                    cross-country concert, bringing joy and harmony to every
                    destination. I hear your delivery drivers even have their
                    own fan clubs, complete with screaming admirers whenever
                    they roll into town. Keep on rocking those deliveries, RRG!
                  </p>
                  <div className="text-3xl text-gray-600 mb-4">
                    <i className="far fa-comment-dots"></i> {/* Comment Icon */}
                  </div>
                  <p className="text-lg text-gray-800">
                    &#x2013; Sarah Johnson
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact-us"
          style={{
            background:
              "linear-gradient(#FFFFFF 5%, #79CFDC 15%, #79CFDC 85%, #FFFFFF 95%)",
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

        <Footer />
      </main>
    </>
  )
}

export default HomePage

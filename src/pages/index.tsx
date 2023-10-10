import Head from "next/head"
import Link from "next/link"
import { useState, FC } from "react"
import Navbar from "@/components/navBar"
import Image from "next/image"
import Footer from "@/components/footer"
import { MapPin } from "@phosphor-icons/react/MapPin"
import { Phone } from "@phosphor-icons/react/Phone"
import { EnvelopeSimple } from "@phosphor-icons/react/EnvelopeSimple"
import { InstagramLogo } from "@phosphor-icons/react/InstagramLogo"
import { FacebookLogo } from "@phosphor-icons/react/FacebookLogo"
import { TwitterLogo } from "@phosphor-icons/react/TwitterLogo"
import { Quotes } from "@phosphor-icons/react/Quotes"

const HomePage: FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % 2)
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + 2) % 2)
  }

  return (
    <>
      <Head>
        <title>Homepage &#x2013; RRG Freight Services</title>
      </Head>

      <main className="">
        <Navbar />
        <section key="section1">
          <div className="imageWrapper">
            <Image
              src="/assets/img/homepage/homepage-bg1.png"
              alt="RRG Freight Services logo with its name on the right"
              sizes="(max-width: 1920px) 100vw, (max-width: 1104px) 50vw, 33vw"
              width={1920}
              height={1080}
            />
          </div>
        </section>

        <section key="section2">
          {/* Track Section */}
          <div className="bg-white">
            <div className="text-center my-5 md:my-10">
              <div className="font-sans font-bold text-2xl sm:text-2xl md:text-3xl lg:text-6xl my-5 sm:my-20 lg:my-20">
                <p className="lg:p-4 sm:p-2">Track now your package and</p>
                <p className="lg:p-4 sm:p-2">
                  ensure your cargo arrives safely
                </p>
                <p className="lg:p-4 sm:p-2">and on schedule!</p>
              </div>
              <button className="bg-red-500 text-white px-6 py-3.5 rounded-full hover:bg-red-800 font-bold font-family my-5">
                Track Now
              </button>
            </div>
          </div>
        </section>

        <section key="section3">
          {/* Carousel section */}
          <div className="bg-[#acdee2] w-fullscreen">
            <div
              id="controls-carousel"
              className="relative max-w-full h-[70vh] md:h-[100vh]"
              data-carousel="static"
            >
              {/* Carousel Content */}
              <div
                className="relative max-w-[1923px] h-full flex items-center justify-center transform transition-transform"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                <div className="w-full max-w-full">
                  <div className="relative">
                    <div className=" inset-0 flex items-center justify-center">
                      <Image
                        src="/assets/img/homepage/carousel1.png"
                        alt="Truck"
                        sizes="(max-width: 1920px) 100vw, (max-width: 1104px) 50vw, 33vw"
                        width={1920}
                        height={1080}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2  hover:bg-opacity-70"
              >
                &lt; {/* Previous Arrow */}
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2  hover:bg-opacity-70"
              >
                &gt; {/* Next Arrow */}
              </button>
            </div>
          </div>
        </section>

        <section key="section4">
          {/* Testimonials Section */}
          <div className="bg-white">
            <div className="text-center my-5 md:my-10">
              <div className="font-size font-semibold text-2xl sm:text-2xl md:text-3xl lg:text-5xl my-5 sm:my-20 lg:my-20">
                <p className="sm:p-4 sm:p-2">RRG CLIENTS TESTIMONIALS</p>
              </div>
            </div>
          </div>
        </section>
        <section>
          {/* Testimonial Cards */}
          <div className="py-12">
            <div className="max-w-6xl mx-auto flex flex-wrap justify-center">
              {/* Testimonial Card 1 */}
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl text-gray-600 mb-4">
                    <Quotes size={32} weight="fill" /> {/* Quotation Icon */}
                  </div>
                  <p className="text-lg text-gray-800 mb-4">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the
                    industry&apos;s standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled
                    it to make a type specimen book. It has survived not only
                    five centuries, but also the leap into electronic
                    typesetting, remaining essentially unchanged.
                  </p>
                  <div className="text-3xl text-gray-600 mb-4">
                    <i className="far fa-comment-dots"></i> {/* Comment Icon */}
                  </div>
                  <p className="text-lg text-gray-800">&#x2013; John Doe</p>
                </div>
              </div>

              {/* Testimonial Card 2 */}
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl text-gray-600 mb-4">
                    <Quotes size={32} weight="fill" /> {/* Quotation Icon */}
                  </div>
                  <p className="text-lg text-gray-800 mb-4">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the
                    industry&apos;s standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled
                    it to make a type specimen book. It has survived not only
                    five centuries, but also the leap into electronic
                    typesetting, remaining essentially unchanged.
                  </p>
                  <div className="text-3xl text-gray-600 mb-4">
                    <i className="far fa-comment-dots"></i> {/* Comment Icon */}
                  </div>
                  <p className="text-lg text-gray-800">&#x2013; Jane Smith</p>
                </div>
              </div>

              {/* Testimonial Card 3 */}
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="text-3xl text-gray-600 mb-4">
                    <Quotes size={32} weight="fill" /> {/* Quotation Icon */}
                  </div>
                  <p className="text-lg text-gray-800 mb-4">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the
                    industry&apos;s standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of type and scrambled
                    it to make a type specimen book. It has survived not only
                    five centuries, but also the leap into electronic
                    typesetting, remaining essentially unchanged.
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
          key="section5"
          className="bg-[#A4D8D8] w-1920 h-674 pb-16 py-10 md:py-20 mb-20"
        >
          <div className="flex flex-col md:flex-row items-center rounded-lg">
            {/* Left side with social media links */}
            <div className="md:w-1/2 min-h-[720px] rounded-lg flex flex-col items-center py-6 md:py-4 bg-gradient-to-r from-[#d3ebeb] via-[#91d4da] to-[#2bc0e4] text-white">
              <div className="text-5xl font-semibold mt-60 mb-40 -rotate-90">
                CONTACT US
              </div>
              <div className="flex space-x-4 mt-40 mb-4">
                <Link href="#">
                  <InstagramLogo size={32} color="#fffafa" weight="bold" />
                </Link>
                <Link
                  href="#"
                  className="text-4xl text-white hover:text-gray-200"
                >
                  <FacebookLogo size={32} color="#fffafa" weight="bold" />
                </Link>
                <Link
                  href="#"
                  className="text-4xl text-white hover:text-gray-200"
                >
                  <TwitterLogo size={32} color="#fffafa" weight="bold" />
                </Link>
              </div>
            </div>
            {/* Right side with contact form */}
            <div className=" md:2/4 py-10 px-6 bg-white text-black rounded-lg">
              <div className="text-center">
                <p className="text-4xl font-semibold mb-3">Get in touch!</p>
                <p className="text-lg font-semibold mb-8">
                  Contact us for assistance, testimonials, or career
                  opportunities.
                </p>
                <div className="grid grid-cols-3  text-sm text-center mb-8 font-semibold">
                  <div>
                    <MapPin size={32} weight="fill" className="mx-auto mb-2" />
                    <p>Blk 213 Lot 41 Yuan Street Phase 8 North Fairview</p>
                  </div>
                  <div>
                    <Phone size={32} weight="fill" className="mx-auto mb-2" />
                    <p>(+02) 8461 6027</p>
                  </div>
                  <div>
                    <EnvelopeSimple
                      size={32}
                      weight="fill"
                      className="mx-auto mb-2"
                    />
                    <p>rrgfreight_imports@yahoo.com</p>
                  </div>
                </div>
              </div>

              <form>
                <div className="bg-gray-200 p-6 rounded-lg">
                  <div className="mb-4">
                    <label
                      className="block text-lg font-medium mb-2 px-1"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-lg font-medium mb-2 px-1"
                      htmlFor="emailAddress"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="emailAddress"
                      name="emailAddress"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-lg font-medium mb-2 px-1"
                      htmlFor="messageContent"
                    >
                      Message
                    </label>
                    <textarea
                      id="messageContent"
                      name="messageContent"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                      required
                    ></textarea>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-red-500 hover:bg-red-800 text-white font-medium rounded-lg text-lg px-6 py-3"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}

export default HomePage

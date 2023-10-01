import { FC } from "react"
import Image from "next/image"
import Head from "next/head"
import Footer from "@/components/footer"
import Navbar from "@/components/navBar"
import VerticalTimeline from "../components/tracking/tracking_timeline"
import { Truck } from "@phosphor-icons/react/Truck"
import { Path } from "@phosphor-icons/react/Path"
import { MapPin } from "@phosphor-icons/react/MapPin"
import { CheckCircle } from "@phosphor-icons/react/CheckCircle"
import { Package } from "@phosphor-icons/react/Package"

function TrackingPageHead() {
  return (
    <Head>
      <title>Tracking &#x2013; RRG Freight Services</title>
      <meta
        name="description"
        content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
      />
    </Head>
  )
}

const Tracking: FC = () => {
  return (
    <>
      <TrackingPageHead />
      <Navbar />

      <header>
        <div className="flex justify-center">
          <Image
            src="/assets/img/tracking/tracking-bg-1.png"
            alt="Track Package"
            className="max-w-full h-full shadow-md"
            width={1923}
            height={832}
          />
        </div>
      </header>

      <div className="container mx-auto p-8">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="bg-[#ACDEE2] w-full lg:w-1/2 h-96 flex flex-col items-center justify-center rounded-md lg:mr-2 lg:mb-0 ">
            <Image
              src="/assets/img/logos/logo.jpg"
              alt="Logo"
              width={350}
              height={50}
            />
          </div>

          <div className="bg-[#EEEAEA] w-full lg:w-4/5 min-h-[18rem] h-96 rounded-md p-8 lg:ml-4 flex flex-col justify-center items-center lg:mt-0 mt-6">
            <div className="font-dm-sans text-4xl lg:text-6xl text-center mb-4 font-semibold">
              Track your Shipment
            </div>
            <div className="text-2xl lg:text-2xl text-center">
              Let’s Find your Package!
            </div>
            <div className="text-2xl lg:text-2xl text-center mb-6">
              Enter your Tracking Number to Track your Package
            </div>

            <input
              type="text"
              placeholder="Enter Shipping Number:"
              className="bg-white border rounded-md p-4 text-xl w-full mb-6"
            />
            <button className="bg-[#ED5959] text-white rounded-full p-4">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-10">
        <div className="flex justify-between mt-10">
          <div className="flex flex-col items-center">
            <div className="outline black rounded-full p-4 mb-6">
              <Package size={44} color="#1d798b" />
            </div>
            <div>Handed Over</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="outline black rounded-full p-4 mb-6">
              <Truck size={44} color="#1d798b" />
            </div>
            <div>In Transit</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="outline black rounded-full p-4 mb-6">
              <Path size={44} color="#1d798b" />
            </div>
            <div>Out for Delivery</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="outline black rounded-full p-4 mb-6">
              <MapPin size={44} color="#1d798b" />
            </div>
            <div>Delivered</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-8">
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <div className="bg-[#EEEAEA] w-full lg:w-1/2 h-96 flex flex-col items-center justify-center rounded-md lg:mr-2 lg:mb-0 ">
            <CheckCircle size={96} color="#1E1E1E" />
            <div className="text-2xl lg:text-2xl text-center font-semibold">
              Estimated Delivery
            </div>
            <div className="text-2xl lg:text-xl text-center mb-6">
              September 3, 2023
            </div>
            <button className="bg-[#ACDEE2] text-black rounded-lg p-4">
              Delivered
            </button>
          </div>

          <div className="bg-[#ACDEE2] w-full lg:w-4/5 h-auto lg:h-96 rounded-md p-8 lg:ml-4 flex flex-col  justify-center items-center lg:mt-0 mt-6">
            <div className="font-dm-sans text-4xl lg:text-6xl text-center mb-6 font-semibold ">
              Shipping Details
            </div>

            <div className="w-full lg:w-4/5 h-auto lg:h-96 rounded-md p-8 lg:ml-4 flex flex-col  justify-center items-center lg:flex-row">
              <div>
                <div className="text-2xl lg:text-2xl text-center mb-6">
                  Shipping Number
                </div>
                <div className="text-2xl lg:text-2xl text-center mb-6">
                  Recipient Name
                </div>
                <div className="text-2xl lg:text-2xl text-center">Location</div>
              </div>
              <div className="hidden lg:block bg-black h-24 w-2 lg:w-[3px] mx-4"></div>
              <div>
                <div className="text-2xl lg:text-2xl text-center mb-6">
                  0123456789
                </div>
                <div className="text-2xl lg:text-2xl text-center mb-6">
                  Willy D. Parrot
                </div>
                <div className="text-2xl lg:text-2xl text-center ">
                  Quezon City
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VerticalTimeline />
      <div className="flex justify-center items-center">
        <Image
          src="/assets/img/tracking/tracking-bg-2.png"
          alt="Track Package"
          className="max-w-full h-full shadow-md"
          width={1923}
          height={832}
        />
      </div>
      <Footer />
    </>
  )
}

export default Tracking

"use client"

import "react-responsive-carousel/lib/styles/carousel.min.css"
import Image from "next/image"
import { Carousel } from "react-responsive-carousel"
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import Link from "next/link"

const images = [
  "/assets/img/home/ship1.jpg",
  "/assets/img/home/ship2.jpg",
  "/assets/img/home/ship3.jpg",
]

export function CarouselSection() {
  return (
    <section>
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
              Forwarder founded by its proprietor Mr. Rafael C. Fabia located in
              Blk 213 Lot 41 Yuan Street Phase 8 North Fairview, Quezon City,
              Philippines, inspired by the New Heroes the OFW&apos;s.
            </p>
          </div>
          <Link href="/about"
          style={{ borderRadius: "20px" }}
          className="group p-3 px-4 w-[152px] bg-[#FFFFFF] text-[#79CFDC] font-bold hover:bg-slate-200 flex items-center transition duration-500">
              Learn More{" "}
              <CaretRight
                className=" group-hover:ml-[10px]  duration-500"
                size={22}
                color="#79CFDC"
                weight="thin"
              />
            
          </Link>
        </div>
      </div>
    </section>
  )
}

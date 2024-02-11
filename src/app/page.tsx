import Head from "next/head"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CarouselSection } from "@/components/home/carousel-section"
import { TestimonialSection } from "@/components/home/testimonial-section"
import { ContactSection } from "@/components/home/contact-section"
import { HeroSection } from "@/components/home/hero-section"
import { TrackSection } from "@/components/home/track-section"

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Homepage &#x2013; RRG Freight Services</title>
      </Head>
      <Navbar />
      <main>
        <HeroSection />
        <TrackSection />
        <CarouselSection />
        <TestimonialSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}

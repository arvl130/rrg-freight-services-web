import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CarouselSection } from "./carousel-section"
import { TestimonialSection } from "./testimonial-section"
import { ContactSection } from "./contact-section"
import { HeroSection } from "./hero-section"
import { TrackSection } from "./track-section"
import { validateSessionFromCookies } from "@/server/auth"

export default async function HomePage() {
  const session = await validateSessionFromCookies()

  return (
    <>
      <title>Homepage &#x2013; RRG Freight Services</title>
      <Navbar user={session?.user ?? null} />
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

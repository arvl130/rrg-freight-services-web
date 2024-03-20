import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { MainSection } from "./main-section"
import { validateSessionWithCookies } from "@/server/auth"

function TrackingPageHead() {
  return (
    <>
      <title>Tracking &#x2013; RRG Freight Services</title>
      <meta
        name="description"
        content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
      />
    </>
  )
}

export default async function TrackingPage({
  searchParams,
}: {
  searchParams?: {
    id?: string
  }
}) {
  const session = await validateSessionWithCookies()

  return (
    <>
      <TrackingPageHead />
      <Navbar user={session?.user ?? null} />
      <MainSection preselectedId={searchParams?.id ?? null} />
      <Footer />
    </>
  )
}

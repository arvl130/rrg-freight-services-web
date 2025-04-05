import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { MainSection } from "./main-section"
import { validateSessionWithCookies } from "@/server/auth"

function TrackingPageHead() {
  return <title>Tracking &#x2013; RRG Freight Services</title>
}

export default async function TrackingPage(
  props: {
    searchParams?: Promise<{
      id?: string
    }>
  }
) {
  const searchParams = await props.searchParams;
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

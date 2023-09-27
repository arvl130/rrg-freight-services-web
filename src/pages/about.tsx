import Head from "next/head"

export default function AboutUsPage() {
  return (
    <>
      <Head>
        <title>About Us &#x2013; RRG Freight Services</title>
        <meta
          name="description"
          content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
        />
      </Head>
      <main className="font-semibold text-2xl max-w-6xl mx-auto px-6 py-4 text-center">
        This is the About Us page.
      </main>
    </>
  )
}

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { validateSessionWithCookies } from "@/server/auth"
import Link from "next/link"

function HeroSection() {
  return (
    <section>
      <div style={{ backgroundColor: "#79CFDC" }}>
        <div className="min-h-[45vh] max-w-6xl mx-auto grid">
          <div className="flex flex-col justify-center text-white font-semibold">
            <p className="text-[50px] w-full text-center mb-3">
              Company Policy
            </p>
          </div>
        </div>
      </div>
      <div className="h-24 bg-gradient-to-b from-[#79CFDC] to-white"></div>
    </section>
  )
}

export default async function TermsCondition() {
  const { user } = await validateSessionWithCookies()

  return (
    <>
      <title>Company Policy &#x2013; RRG Freight Services</title>
      <Navbar user={user} />
      <main>
        <HeroSection />
        <div className="mx-20 my-20 flex flex-col content-center">
          <div className="text-[#B0A8A8] text-[30px] px-20 font-bold font-sans">
            Effective April 19, 2024
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            Scope
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem]">
            <p>
              This policy applies to all employees, contractors, and agents of
              RRG Freight Services, a freight forwarding company. It outlines
              the company&rsquo;s commitment to providing professional,
              efficient, and compliant freight forwarding services.
            </p>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            I. Services Offered
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem] mb-3">
            <p>
              RRG Freight Services offers a variety of freight forwarding
              services, including:
            </p>
          </div>
          <div className="px-40 text-stone-900 text-xl text-justify font-normal font-poppins leading-loose">
            <div className="flex text-justify pr-20">
              <p className="font-bold mb-2">1. Sea Freight</p>
            </div>
            <div className="pl-20">
              <p className="mb-3">
                <strong>• Sea Freight Forwarding: </strong> RRG Freight Services
                offers efficient and reliable sea freight forwarding services
                for import cargo.
              </p>
              <p className="mb-3">
                <strong>• Customs Clearance: </strong> Our experienced team will
                handle all customs clearance procedures to ensure fast and
                smooth release of your goods, minimizing delays in your supply
                chain.
              </p>
              <p className="mb-5">
                <strong>• Documentation and Compliance: </strong> We will
                prepare all necessary documentation to meet customs
                requirements, ensuring smooth processing and reduced risk of
                inspections.
              </p>
            </div>
          </div>

          <div className="px-40 text-stone-900 text-xl text-justify font-normal font-poppins leading-loose">
            <div className="flex text-justify pr-20">
              <p className="font-bold mb-2">2. Air Freight</p>
            </div>
            <div className="pl-20">
              <p className="mb-3">
                <strong>• Air Freight Forwarding: </strong> RRG Freight Services
                provides time-sensitive air freight solutions for your urgent
                cargo needs.
              </p>
              <p className="mb-5">
                <strong>• Customs Clearance: </strong> Our team will expedite
                customs clearance for air shipments, ensuring your cargo reaches
                its destination quickly.
              </p>
            </div>
          </div>

          <div className="px-40 text-stone-900 text-xl text-justify font-normal font-poppins leading-loose">
            <div className="flex text-justify pr-20">
              <p className="font-bold mb-2">3. Land Transportation</p>
            </div>
            <div className="pl-20">
              <p className="mb-5">
                <strong>• RRG Fleet Advantage: </strong> RRG Freight Services
                offers complete control over your land transportation needs with
                our own fleet of vehicles, including tractor heads and closed
                vans. This ensures flexibility, reliability, and on-time
                delivery for your domestic shipments.
              </p>
            </div>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5 ">
            II. Prohibited Goods
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem]">
            <p>RRG Freight Services will not accept shipments containing:</p>
          </div>
          <div className="px-40 text-stone-900 text-xl text-justify font-normal font-poppins leading-loose">
            <div className="pl-1 pb">
              <p className="mt-3">
                ● Illegal goods or substances (as defined by national and
                international law).
              </p>
              <p>
                ● Perishable goods without prior agreement and proper
                documentation.
              </p>
              <p>● Live animals.</p>
              <p>
                ● Flammable, explosive, or hazardous materials without proper
                classification and packaging.
              </p>
              <p className="mb-5">
                ● Items exceeding weight or size limitations.
              </p>
            </div>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            III. Client Responsibilities
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem]">
            <p>Clients are responsible for:</p>
          </div>
          <div className="px-40 text-stone-900 text-xl text-justify font-normal font-poppins leading-loose">
            <div className="pl-1 pb">
              <p className="mt-3">
                ● Providing accurate and complete information about the
                shipment, including description, weight, dimensions, and value.
              </p>
              <p>
                ● Obtaining necessary permits and licenses for restricted goods.
              </p>
              <p>
                ● Packing goods according to industry standards and following
                all carrier guidelines.
              </p>
              <p className="mb-5">
                ● Providing clear instructions and incoterms (international
                commercial terms) for the shipment.
              </p>
            </div>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            IV. Company Responsibilities
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem]">
            <p>RRG Freight Services is committed to:</p>
          </div>
          <div className="px-40 text-stone-900 text-xl text-justify font-normal font-poppins leading-loose">
            <div className="pl-1 pb">
              <p className="mt-3">
                ● Upholding the highest ethical standards in all business
                dealings.
              </p>
              <p>
                ● Complying with all applicable laws and regulations related to
                freight forwarding.
              </p>
              <p>
                ● Exercising due diligence in the selection of carriers and
                partners.
              </p>
              <p>
                ● Providing clients with accurate and timely information about
                their shipments.
              </p>
              <p>
                ● Handling cargo with care and ensuring its secure
                transportation.
              </p>
              <p className="mb-5">
                ● Maintaining clear communication with clients throughout the
                shipping process.
              </p>
            </div>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            V. Claims and Insurance
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem]">
            <p className="mb-5">
              RRG Freight Services will assist clients in filing claims for lost
              or damaged cargo. However, the company&lsquo;s liability is
              limited as outlined in the service agreement.{" "}
            </p>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            VI. Confidentiality
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem]">
            <p className="mb-5">
              RRG Freight Services maintains a strict policy of confidentiality
              regarding all client information and shipment details. We are
              committed to safeguarding this sensitive data and will only
              disclose it with your prior written consent, as required by law,
              or in exceptional circumstances to protect the safety and security
              of individuals or cargo.{" "}
            </p>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            VII. Continuous Improvement
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem]">
            <p className="mb-5">
              RRG Freight Services is dedicated to continuous improvement in all
              aspects of our services. We value feedback from our clients and
              actively seek their input to identifyareas where we can enhance
              our operations and exceed expectations. We encourage you to
              provide feedback through rrgfreight_imports@yahoo.com.{" "}
            </p>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            VIII. Policy Review and Updates
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem]">
            <p className="mb-5">
              This policy is subject to periodic review and update to ensure its
              continued alignment with evolving industry regulations, best
              practices, and the company&lsquo;s commitment to providing
              exceptional service. We will make all reasonable efforts to keep
              clients informed of any significant policy changes.{" "}
            </p>
          </div>

          <div className="mt-10 px-20 text-[#263238] text-2xl font-bold font-sans">
            Contact Us
          </div>
          <div className="mt-2 mb-10 px-20 text-stone-900 text-xl font-normal font-poppins">
            <p>
              If you have any questions about this Privacy Policy, please{" "}
              <Link
                style={{ textDecoration: "underline" }}
                href="/#contact-us"
                className="font-bold text-blue-400"
                passHref
              >
                contact us
              </Link>{" "}
              at rrgfreight_imports@yahoo.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

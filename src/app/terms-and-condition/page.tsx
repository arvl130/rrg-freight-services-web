import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { validateSessionWithCookies } from "@/server/auth"
import Link from "next/link"

function HeroSection() {
  return (
    <section>
      <div className="[background-color:_#79CFDC]">
        <div className="min-h-[45vh] max-w-6xl mx-auto grid">
          <div className="flex flex-col justify-center text-white font-semibold">
            <p className="text-[50px] w-full text-center mb-3">
              Terms and Conditions
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
      <title>Terms and Conditions &#x2013; RRG Freight Services</title>
      <Navbar user={user} />
      <main>
        <HeroSection />
        <div className=" mx-20 my-20 flex flex-col content-center">
          <div className="text-[#B0A8A8] text-[30px] px-20 font-bold font-'DM Sans'">
            Effective by April 19, 2024
          </div>
          <div className="text-[#263238] text-2xl my-3 px-20 font-bold font-'DM Sans'">
            Terms and Conditions
          </div>
          <div className=" mx-auto px-40 text-stone-900 text-xl text-justify font-normal font-'Poppins' leading-[4rem]">
            <div className="flex text-justify pr-20">
              1.&nbsp;
              <p>
                All information are true and correct, particularly, names and
                addresses of shipper and consignee, as well as, the declared
                contents and value of the shipment.
              </p>
            </div>

            <div className="flex text-justify pr-20">
              2.&nbsp;
              <p>
                The shipment contains no hazardous or prohibited items, e.g.
                explosives, flammable, firearms and parts, ammunitions, illegal
                drugs, live animals, and all other items prohibited by law or
                common carriers, or requires government permit for its
                transport.
              </p>
            </div>

            <div className="flex text-justify pr-20">
              3.&nbsp;
              <p>
                The consignee or any person of sufficient age and discretion
                will be at the given address to receive the shipment.
              </p>
            </div>

            <div className="flex text-justify pr-20">
              4.&nbsp;
              <p>
                Consignee or any person of sufficient age and discretion shall
                check the shipment upon receiving.
              </p>
            </div>

            <div className="flex text-justify pr-20">
              5.&nbsp;
              <p>
                The recipient&lsquo;s cargo will be transported and delivered by
                RRG Freight & Services to the location specified on the waybill,
                packing list, and delivery receipts.
              </p>
            </div>

            <div className="flex text-justify pr-20">
              6.&nbsp;
              <p>
                For complains or damage, immediately communicate to RRG Freight
                and Services.
              </p>
            </div>

            <div className="flex text-justify pr-20">
              7.&nbsp;
              <p>
                Arising from force majeure, acts of Government authority, or
                shipper&lsquo;s breach, RRG Freight & Services shall not be
                liable for loss, damage, or delay.
              </p>
            </div>

            <div className="flex text-justify pr-20">
              8.&nbsp;
              <p>
                RRG Freight & Services are not liable for any damages, delay or
                loss once the package was transferred from the agent on your
                area.
              </p>
            </div>
          </div>

          <div className=" mt-10 px-20 text-[#263238] text-2xl font-bold font-'DM Sans'">
            Contact Us
          </div>
          <div className="mt-2 mb-10 px-20 text-stone-900 text-xl font-normal font-'Poppins'">
            <p className="text-left pr-">
              If you have any questions about this Privacy Policy, please&nbsp;
              <Link
                href="/#contact-us"
                className="font-bold text-blue-400"
                passHref
              >
                contact us
              </Link>{" "}
              at rrgfreight_imports@yahoo.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

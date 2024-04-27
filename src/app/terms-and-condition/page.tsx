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
        <div className="mx-10 my-20 flex flex-col content-center">
          <div className="text-[#B0A8A8] text-[30px] font-bold font-'DM Sans'">
            Effective by April 19, 2024
          </div>
          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            Terms and Conditions
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem]">
            <p>
              This document outlines the terms and conditions for using our
              freight services, by using our services, you agree to these terms.
            </p>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            I. Delivery Areas
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem] mb-10">
            <p>
              We deliver throughout Luzon and it is listed on the Deliverable
              Areas on our Website, for the areas that is not listed and for
              Visayas, Mindanao we have a Domestic Agent that will manage all
              your deliveries.{" "}
            </p>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            II. Delivery Time Frames
          </div>
          <div className="mx-20 mb-3 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem]">
            <p>
              We deliver throughout Luzon and it is listed on the Deliverable
              Areas on our Website, for the areas that is not listed and for
              Visayas, Mindanao we have a Domestic Agent that will manage all
              your deliveries.{" "}
            </p>
          </div>
          <div className="px-4 text-stone-900 text-xl text-justify font-normal font-poppins leading-loose">
            <div className="text-justify pr-20 leading-[3rem]">
              <p>
                <strong>● Standard Delivery: </strong> 4-5 days after we receive
                your shipment.
              </p>
              <p>
                <strong>● Express Delivery: </strong> We strive for delivery
                within 2-3 days after receiving your shipment.
              </p>
              <p>
                <strong>● National Holiday: </strong> RRG Freight Services does
                operate on Philippine national holidays.
              </p>
              <p className="mb-10">
                <strong>● Weekend Operations: </strong> RRG Freight Services
                deliveries operates on weekends.
              </p>
            </div>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            III. Shipping Method
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem] mb-5">
            <p>
              We deliver your shipment using trucks throughout Luzon, and for
              Visayas, Mindanao it depends on the Domestic Agent.{" "}
            </p>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            IV. Order Tracking
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem] mb-5">
            <p>
              When your package is out for delivery, you&lsquo;ll receive a
              notification email and SMS with a tracking number. Track your
              delivery progress on our website using this number.{" "}
            </p>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            V. Delivery Exceptions
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem] mb-5">
            <p>
              Arising from force majeure, acts of Government authority, or
              shipper&lsquo;s breach, RRG Freight & Services shall not be liable
              for loss, damage, or delays.{" "}
            </p>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            VI. Missed Deliveries
          </div>
          <div className="px-4 text-stone-900 text-xl text-justify font-normal font-poppins leading-loose">
            <div className="text-justify pr-20 leading-[3rem]">
              <p>
                ● If unavailable to receive your delivery, the carrier will
                return it to our warehouse, and you will receive an email and
                text for the update every time for failed attempt delivery
              </p>
              <p>
                ● After two failed delivery attempts, your shipment will be held
                back at the warehouse{" "} 
              </p>
              <p>
                ● Within Metro Manila for every failed attempts the package will
                be held back at the warehouse
              </p>
              <div className="flex text-justify pr-20">
                <p>
                  ● To claim your shipment within the Warehouse for failed
                  deliveries
                </p>
              </div>
              <div className=" pl-10">
                <p>• Contact RRG Freight Services to arrange a pick-up.</p>
                <p className="mb-5">• Reschedule a delivery for a fee.</p>
              </div>
            </div>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            VII. Delivery Verification and Recipient Requirements
          </div>
          <div className="px-4 text-stone-900 text-xl text-justify font-normal font-poppins leading-loose">
            <div className="text-justify pr-20 leading-[3rem]">
              <p className="pb-2">
                ● We deliver 24/7 except for national holidays.
              </p>
              <p className="pb-2">
                ● For security, you will be required to verify your identity
                upon claiming your package.
              </p>
              <p className="pb-2">
                ● Verification uses a one-time password (OTP) sent to your
                registered phone number and email.
              </p>
              <p className="pb-2">
                ● Once the package is forwarded to the Domestic Agent you will
                be sent the details and information of the Domestic Agent via
                email and text message.
              </p>
              <p className="pb-2">
                ● The recipient&apos;s cargo will be transported and delivered
                by RRG Freight & Services to the location specified on the
                waybill, packing list, and delivery receipts.
              </p>
              <p className="pb-2">
                ● Consignee or any person of sufficient age and discretion shall
                check the shipment upon receiving.
              </p>
              <p className="pb-2">
                ● The consignee or any person of sufficient age and discretion
                will be at the given address to receive the shipment.
              </p>
              <p className="pb-2">
                ● The shipment contains no hazardous or prohibited items, e.g.
                explosives, flammable, firearms and parts, ammunitions, illegal
                drugs, live animals, and all other items prohibited by law or
                common carriers, or requires government permit for its
                transport.
              </p>
              <p className="mb-5">
                ● All information is true and correct, particularly, names and
                addresses of shipper and consignee, as well as, the declared
                contents of the shipment.
              </p>
            </div>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            VII. Damaged or Lost Packages
          </div>
          <div className="px-4 text-stone-900 text-xl text-justify font-normal font-poppins leading-loose">
            <div className="flex text-justify pr-20">
              <p className="font-bold">Within Luzon</p>
            </div>
            <div className="pl-20">
              <p>
                ● For complains or damage, immediately communicate to RRG
                Freight and Services.
              </p>
              <p className="mb-5">
                ● For lost packages, we will work with the carrier to locate the
                item and take appropriate action.{" "}
              </p>
            </div>
            <div className="flex text-justify pr-20">
              <p className="font-bold">For Visayas and Mindanao</p>
            </div>
            <div className="pl-20">
              <p className="mb-5">
                ● RRG Freight & Services are not liable for any damages, delay
                or loss once the package was transferred from the agent on your
                area.
              </p>
            </div>
          </div>

          <div className="text-[#263238] text-2xl mx-20 mt-5 font-bold font-sans pb-2.5">
            IX. Contact Us
          </div>
          <div className="mx-20 text-stone-900 text-xl text-justify font-normal font-poppins leading-[2.5rem]">
            <p>Have questions? Contact us at:</p>
          </div>
          <div className="px-4 text-stone-900 text-xl text-justify font-normal font-poppins leading-loose">
            <div className="text-justify pr-20 leading-[3rem]">
              <p>
                <strong>● Phone: </strong> 02-84616027
              </p>
              <p className="mb-10">
                <strong>● Email: </strong> rrgfreight_imports@yahoo.com
              </p>
            </div>
          </div>

          <div className="mt-10 px-4 text-[#263238] text-2xl font-bold font-'DM Sans' padding-0">
            Additional Information
          </div>
          <div className="mt-2 mb-0 px-4 text-stone-900 text-xl font-normal font-'Poppins'">
            <p className="text-justify mb-5">
              For specific inquiries regarding delivery windows or rescheduling
              deliveries, please refer to the contact information above.
            </p>
            <p className="text-justify font-bold">
              By using RRG FREIGHT SERVICES, you acknowledge that you have read,
              understood, and agreed to abide by the terms and conditions
              outlined above.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

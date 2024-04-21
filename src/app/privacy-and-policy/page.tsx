import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { validateSessionWithCookies } from "@/server/auth"
import Link from "next/link"

function HeroSection() {
  return (
    <section>
      <div className="[background-color:_#79CFDC]">
        <div className="min-h-[45vh] max-w-6xl mx-auto grid md:grid-cols-2">
          <div className="flex flex-col justify-center text-white font-semibold">
            <p className="text-[50px] w-full text-center mb-3">
              Privacy Policy
            </p>
          </div>
        </div>
      </div>
      <div className="h-24 bg-gradient-to-b from-[#79CFDC] to-white"></div>
    </section>
  )
}

export default async function PrivacyPolicy() {
  const { user } = await validateSessionWithCookies()

  return (
    <>
      <title>Privacy and Policy &#x2013; RRG Freight Services</title>
      <Navbar user={user} />
      <main>
        <HeroSection />
        <div className=" mx-20 my-20 flex flex-col">
          <div className="text-[#B0A8A8] text-[30px] font-bold font-'DM Sans'">
            Effective by April 19, 2024
          </div>
          <div className="text-[#263238] text-2xl mt-5 font-bold font-'DM Sans'">
            Privacy Policy
          </div>
          <div className=" mx-auto text-stone-900 text-2xl text-justify font-normal font-'Poppins'">
            <p>
              RRG Freight Services operates{" "}
              <a
                href="https://www.rrgfreight.services"
                className="text-blue-400 font-bold"
              >
                www.rrgfreight.services
              </a>
              . This page informs you of our policies regarding the collection,
              use, and disclosure of Personal Information we receive from users
              of the Site.
              <br />
              <br />
              We use your Personal Information only for providing and improving
              the Site. By using the Site, you agree to the collection and use
              of information in accordance with this policy.
            </p>
          </div>

          <div className="mx-auto px-20 ">
            <div className=" mt-10 text-[#263238] text-2xl font-bold font-'DM Sans'">
              1. Information Collection and Use
            </div>
            <div className=" mx-auto mt-2 text-stone-900 text-2xl text-justify font-normal font-'Poppins'">
              <p>
                {" "}
                While using our Site, we may ask you to provide us with certain
                personally identifiable information that can be used to contact
                or identify you. Personally identifiable information may
                include, but is not limited to your name.
              </p>
            </div>
            <div className=" mt-10 text-[#263238] text-2xl font-bold font-'DM Sans'">
              {" "}
              2. Security
            </div>
            <div className=" mx-auto mt-2 text-stone-900 text-2xl text-justify font-normal font-'Poppins'">
              <p>
                {" "}
                While using our Site, we may ask you to provide us with certain
                personally identifiable information that can be used to contact
                or identify you. Personally identifiable information may
                include, but is not limited to your name.
              </p>
            </div>
            <div className=" mt-10 text-[#263238] text-2xl font-bold font-'DM Sans'">
              {" "}
              3. Changes to This Privacy Policy
            </div>
            <div className=" mx-auto mt-2 text-stone-900 text-2xl text-justify font-normal font-'Poppins'">
              <p>
                This Privacy Policy is effective as of April 19, 2024 and will
                remain in effect except with respect to any changes in its
                provisions in the future, which will be in effect immediately
                after being posted on this page.
                <br />
                <br />
                We reserve the right to update or change our Privacy Policy at
                any time and you should check this Privacy Policy periodically.
                Your continued use of the Service after we post any
                modifications to the Privacy Policy on this page will constitute
                your acknowledgment of the modifications and your consent to
                abide and be bound by the modified Privacy Policy.
                <br />
                <br />
                If we make any material changes to this Privacy Policy, we will
                notify you either through the email address you have provided
                us, or by placing a prominent notice on our website.
              </p>
            </div>
          </div>
          <div className=" mt-10 text-[#263238] text-2xl font-bold font-'DM Sans'">
            Contact Us
          </div>
          <div className="mt-2 mb-10 text-stone-900 text-2xl font-normal font-'Poppins'">
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

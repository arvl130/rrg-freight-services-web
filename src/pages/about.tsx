import Head from "next/head"
import Navbar from "./navBar"
import Footer from "./footer"

export default function AboutUsPage() {
  return (
    <>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      <Navbar/>
=======
>>>>>>> parent of 9c9acdb (feat: added homepage w/ updated nav bar | added about us)
=======
>>>>>>> parent of 9c9acdb (feat: added homepage w/ updated nav bar | added about us)
=======
    <div>
      <Navbar/>
    </div>
>>>>>>> parent of 9ee14a2 (Revert "feat: added homepage w/ updated nav bar |  added about us")
      <Head>
        <title>About Us &#x2013; RRG Freight Services</title>
        <meta
          name="description"
          content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
        />
      </Head>
    <main className="flex flex-col">
     
      <div className=" container max-w-fit  max-h-px">
        <section className="bg-gradient-to-r from-[#a4d8d8] via-[#91d4da] to-[#2bc0e4] w-1920 h-734 pb-16"> 
            <div className="text-5xl pt-56 ml-20 font-bold">About Us 
            <div className="text-base font-light"> 
              Learn about our company.
            </div>
            </div>   
        </section>  

        <div className="container mx-auto px-8 mt-16">
          <div className="text-3xl font-bold mb-6">Company Profile</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {/* About RRG */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-2">About RRG</h2>
              <p className="text-sm">
                RRG FREIGHT SERVICES is a Domestic and International Freight
                Forwarder founded by its proprietor Mr. Rafael C. Fabia located
                in Blk 213 Lot 41 Yuan Street Phase 8 North Fairview, Quezon
                City, Philippines, inspired by the New Heroes the OFW's.
              </p>
            </div>
            {/* Mission */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-2">Mission</h2>
              <p className="text-sm">
                To import an exemplary service in the domestic and international
                transportation and logistics service in the market, by working
                hard we accord to our valued customer the greatest satisfaction
                they need. Delivering Love.
              </p>
            </div>
            {/* Vision */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-2">Vision</h2>
              <p className="text-sm">
                To be one of the best and most trusted companies both nationally
                and internationally in the field of forwarding company.
              </p>
            </div>
          </div>
        </div>
   
        <div className="text-4xl font-bold text-center my-20">Meet the Team</div>
        <section className="bg-white h-96 grid grid-cols-4 flex-col mx-8 my-10 m">
          <div>
           <img src="/assets/img/about/person-1.png" alt="..." className="w-11/12 items-center"/>
            <div className="text-center">
                Juan Dela Cruz
                  <div className="font-bold">
                    Chief Executive Officer
                  </div>
            </div>
          </div>

          <div>
          <img src="/assets/img/about/person-2.png" alt="..." className="w-11/12 items-center"/>
           <div className="text-center">
                Juan Dela Cruz
                  <div className="font-bold">
                    Chief Executive Officer
                  </div>
            </div>
          </div>

          <div>
          <img src="/assets/img/about/person-3.png" alt="..." className="w-11/12 items-center"/>
          <div className="text-center">
                Juan Dela Cruz
                  <div className="font-bold">
                    Chief Executive Officer
                  </div>
            </div>
          </div>

          <div>
          <img src="/assets/img/about/person-4.png" alt="..." className="w-11/12 items-center"/>
          <div className="text-center">
                Juan Dela Cruz
                  <div className="font-bold">
                    Chief Executive Officer
                  </div>
            </div>
          </div> 
        <div>
           <img src="/assets/img/about/person-5.png" alt="..." className="w-11/12 items-center mt-20"/>
            <div className="text-center">
                Juan Dela Cruz
                  <div className="font-bold">
                    Chief Executive Officer
                  </div>
            </div>
          </div>

          <div>
          <img src="/assets/img/about/person-6.png" alt="..." className="w-11/12 items-center mt-20"/>
           <div className="text-center">
                Juan Dela Cruz
                  <div className="font-bold">
                    Chief Executive Officer
                  </div>
            </div>
          </div>

          <div>
          <img src="/assets/img/about/person-7.png" alt="..." className="w-11/12 items-center mt-20"/>
          <div className="text-center">
                Juan Dela Cruz
                  <div className="font-bold">
                    Chief Executive Officer
                  </div>
            </div>
          </div>

          <div>
          <img src="/assets/img/about/person-8.png" alt="..." className="w-11/12 items-center mt-20"/>
          <div className="text-center">
                Juan Dela Cruz
                  <div className="font-bold">
                    Chief Executive Officer
                  </div>
            </div>
          </div>
        </section>

        <section className="flex pb-24 mb-96 ">
        
        </section>
        <section className="flex h-full mt-90 mb-50 ">
         <div className=" relative">
         <img src="/assets/img/about/WantToTrackYourPackage.png" alt="..." className="" />
          <h1 className="absolute text-5xl font-semibold text-white inset-x-0 top-0 text-center my-20">
            Want to track your Package?
          </h1>
          <h1 className="absolute text-5xl font-semibold text-white inset-x-0 top-0 text-center my-32">
            track it now here!
          </h1>

          <div className="flex flex-col items-center justify-center absolute top-60 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  <button
    type="button"
    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
  >
    Track Now
  </button>
</div>

        </div>
        <section className="flex pb-24 mb-96 ">
        
        </section>
        </section>

        <Footer/>
      </div>

    </main>
  
    </>
  )
}
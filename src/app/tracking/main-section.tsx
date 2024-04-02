"use client"

import Image from "next/image"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { VerticalTimeline } from "./timeline"
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck"
import { Path } from "@phosphor-icons/react/dist/ssr/Path"
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin"
import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle"
import { Package } from "@phosphor-icons/react/dist/ssr/Package"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { BrowsingPhoneVector } from "@/components/vector/browsing-phone"
import { DELIVERABLE_PROVINCES_IN_PH } from "@/utils/region-code"

function TrackingPageHead() {
  return <title>Tracking &#x2013; RRG Freight Services</title>
}

function First() {
  return (
    <section className="max-w-4xl mx-auto grid grid-cols-[5rem_1fr_5rem_1fr_5rem_1fr_5rem] justify-between mb-6">
      <div className="border-2 border-black rounded-full p-4">
        <Package size={44} color="#1d798b" />
      </div>
      <div className="flex items-center">
        <div className="w-full bg-[#A4D8D8]"></div>
      </div>
      <div className="border-2 border-black rounded-full p-4">
        <Truck size={44} color="#1d798b" />
      </div>
      <div className="flex items-center">
        <div className="w-full bg-[#A4D8D8]"></div>
      </div>
      <div className="border-2 border-black rounded-full p-4">
        <Path size={44} color="#1d798b" />
      </div>
      <div className="flex items-center">
        <div className="w-full bg-[#A4D8D8]"></div>
      </div>
      <div className="border-2 border-black rounded-full p-4">
        <MapPin size={44} color="#1d798b" />
      </div>
      <div className="text-center">Handed Over</div>
      <div></div>
      <div className="text-center">In Transit</div>
      <div></div>
      <div className="text-center">Out for Delivery</div>
      <div></div>
      <div className="text-center">Delivered</div>
    </section>
  )
}

function Second() {
  return (
    <section className="max-w-4xl mx-auto grid grid-cols-[5rem_1fr_5rem_1fr_5rem_1fr_5rem] justify-between mb-6">
      <div className="border-2 border-black rounded-full p-4">
        <Package size={44} color="#1d798b" />
      </div>
      <div className="flex items-center">
        <div className="h-1 w-full bg-[#A4D8D8]"></div>
      </div>
      <div className="border-2 border-black rounded-full p-4">
        <Truck size={44} color="#1d798b" />
      </div>
      <div className="flex items-center">
        <div className="w-full bg-[#A4D8D8]"></div>
      </div>
      <div className="border-2 border-black rounded-full p-4">
        <Path size={44} color="#1d798b" />
      </div>
      <div className="flex items-center">
        <div className="w-full bg-[#A4D8D8]"></div>
      </div>
      <div className="border-2 border-black rounded-full p-4">
        <MapPin size={44} color="#1d798b" />
      </div>
      <div className="text-center">Handed Over</div>
      <div></div>
      <div className="text-center">In Transit</div>
      <div></div>
      <div className="text-center">Out for Delivery</div>
      <div></div>
      <div className="text-center">Delivered</div>
    </section>
  )
}

function Third() {
  return (
    <section className="max-w-4xl mx-auto grid grid-cols-[5rem_1fr_5rem_1fr_5rem_1fr_5rem] justify-between mb-6">
      <div className="border-2 border-black rounded-full p-4">
        <Package size={44} color="#1d798b" />
      </div>
      <div className="flex items-center">
        <div className="h-1 w-full bg-[#A4D8D8]"></div>
      </div>
      <div className="border-2 border-black rounded-full p-4">
        <Truck size={44} color="#1d798b" />
      </div>
      <div className="flex items-center">
        <div className="h-1 w-full bg-[#A4D8D8]"></div>
      </div>
      <div className="border-2 border-black rounded-full p-4">
        <Path size={44} color="#1d798b" />
      </div>
      <div className="flex items-center">
        <div className="w-full bg-[#A4D8D8]"></div>
      </div>
      <div className="border-2 border-black rounded-full p-4">
        <MapPin size={44} color="#1d798b" />
      </div>
      <div className="text-center">Handed Over</div>
      <div></div>
      <div className="text-center">In Transit</div>
      <div></div>
      <div className="text-center">Out for Delivery</div>
      <div></div>
      <div className="text-center">Delivered</div>
    </section>
  )
}

function Fourth() {
  return (
    <section className="max-w-4xl mx-auto grid grid-cols-[5rem_1fr_5rem_1fr_5rem_1fr_5rem] justify-between mb-6">
      <div className="border-2 border-black rounded-full p-4">
        <Package size={44} color="#1d798b" />
      </div>
      <div className="flex items-center">
        <div className="h-1 w-full bg-[#A4D8D8]"></div>
      </div>
      <div className="border-2 border-black rounded-full p-4">
        <Truck size={44} color="#1d798b" />
      </div>
      <div className="flex items-center">
        <div className="h-1 w-full bg-[#A4D8D8]"></div>
      </div>
      <div className="border-2 border-black rounded-full p-4">
        <Path size={44} color="#1d798b" />
      </div>
      <div className="flex items-center">
        <div className="h-1 w-full bg-[#A4D8D8]"></div>
      </div>
      <div className="border-2 border-black rounded-full p-4">
        <MapPin size={44} color="#1d798b" />
      </div>
      <div className="text-center">Handed Over</div>
      <div></div>
      <div className="text-center">In Transit</div>
      <div></div>
      <div className="text-center">Out for Delivery</div>
      <div></div>
      <div className="text-center">Delivered</div>
    </section>
  )
}

function censorWords(words: string) {
  return words.replaceAll(/(?<=\w{2,})\w/g, "*")
}

function PackageDetailsSections({ packageId }: { packageId: string }) {
  const {
    status,
    data: _package,
    error,
  } = api.package.getWithStatusLogsById.useQuery(
    {
      id: packageId,
    },
    {
      retry: false,
    },
  )

  const hasDeliverableDestination =
    _package === undefined
      ? false
      : DELIVERABLE_PROVINCES_IN_PH.includes(
          _package.receiverStateOrProvince.trim().toUpperCase(),
        )

  if (status === "loading")
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner></LoadingSpinner>
      </div>
    )

  if (status === "error")
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Image
          src="/assets/img/tracking/package-not-found.png" //FIXME: Replace with HD image
          alt="Package not found."
          className="w-[30%] h-[40%] object-contain"
          width={100}
          height={100}
        />
        <p className="text-xl text-[#CEC6C6] font-semibold mt-auto">
          Package not found
        </p>
      </div>
    )

  return (
    <>
      {_package.status === "INCOMING" && <First />}
      {_package.status === "IN_WAREHOUSE" && <Second />}
      {_package.status === "SORTING" && <Second />}
      {_package.status === "DELIVERING" && <Third />}
      {_package.status === "DELIVERED" && <Fourth />}
      {_package.status === "TRANSFERRING_WAREHOUSE" && <Second />}
      {_package.status === "TRANSFERRING_FORWARDER" && <Third />}
      {_package.status === "TRANSFERRED_FORWARDER" && <Fourth />}

      <section className="max-w-4xl mx-auto">
        <div className="grid grid-cols-[2fr,_3fr] gap-4">
          <div className="bg-[#EEEAEA] w-full rounded-lg flex flex-col justify-center items-center py-4">
            <CheckCircle size={96} color="#1E1E1E" />
            <div className="text-center font-semibold">Estimated Delivery</div>
            <div className="text-center">
              {_package.status === "INCOMING" && <>30-45 days</>}

              {hasDeliverableDestination ? (
                <>
                  {_package.status === "IN_WAREHOUSE" && <>2-3 days</>}
                  {_package.status === "SORTING" && <>2-3 days</>}
                </>
              ) : (
                <>
                  {_package.status === "IN_WAREHOUSE" && <>N/A</>}
                  {_package.status === "SORTING" && <>N/A</>}
                </>
              )}

              {_package.status === "DELIVERING" && <>2-3 days</>}
              {_package.status === "DELIVERED" && <>N/A</>}

              {_package.status === "TRANSFERRING_FORWARDER" && <>N/A</>}
              {_package.status === "TRANSFERRED_FORWARDER" && <>N/A</>}

              {_package.status === "TRANSFERRING_WAREHOUSE" && <>4-5 days</>}
            </div>
          </div>

          <div className="bg-[#ACDEE2] w-full rounded-lg flex flex-col items-center px-6 py-4">
            <div className="text-center mb-3 font-semibold">
              Shipping Details
            </div>

            <div className="w-full justify-center items-center grid grid-cols-2">
              <div className="text-center">Tracking Number</div>
              <div className="text-center border-l border-black px-3">
                {_package.id.toString().padStart(4, "0")}
              </div>
              <div className="text-center">Recipient Name</div>
              <div className="text-center border-l border-black px-3">
                {censorWords(_package.receiverFullName)}
              </div>
              <div className="text-center">Location</div>
              <div className="text-center border-l border-black px-3">
                {_package.receiverCity}, {_package.receiverStateOrProvince},{" "}
                {_package.receiverCountryCode}
              </div>
            </div>
          </div>
        </div>
      </section>

      <VerticalTimeline packageStatusLogs={_package.statusLogs} />
    </>
  )
}

const choosePackageFormSchema = z.object({
  packageId: z.string().min(1, {
    message: "Please enter a tracking number",
  }),
})

type ChoosePackageFormType = z.infer<typeof choosePackageFormSchema>

function ChoosePackageForm({
  setSelectedPackageId,
}: {
  setSelectedPackageId: (packageId: string) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChoosePackageFormType>({
    resolver: zodResolver(choosePackageFormSchema),
  })

  return (
    <div className="px-16 mb-14 w-full md:w-full md:mx-auto md:grid md:grid-cols-[auto_1fr] md:gap-4 md:my-16 lg:px-52 ">
      <div className="bg-[#ACDEE2]  rounded-lg hidden md:block">
        <Image
          src="/assets/img/logos/logo.jpg"
          alt="Logo"
          width={250}
          height={250}
          className="w-full h-full m-auto p-6 "
        />
      </div>
      <form
        className="bg-[#EEEAEA] w-full px-6 py-4 rounded-lg flex flex-col items-center justify-center"
        onSubmit={handleSubmit((formData) => {
          setSelectedPackageId(formData.packageId)
        })}
      >
        <div className="text-4xl text-center font-semibold">
          Track your Shipment
        </div>
        <div className="text-center font-medium mb-5">
          Let&apos;s Find your Package! <br />
          Enter your Tracking Number to Track your Package
        </div>

        <input
          {...register("packageId")}
          type="text"
          placeholder="Enter tracking number ..."
          className="bg-white border rounded-md px-4 py-1 text-xl w-full outline-none"
        />
        {errors.packageId && (
          <p className="text-red-600 mt-1">{errors.packageId.message}.</p>
        )}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-[#ED5959] text-white rounded-full px-5 py-2"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="[background-color:_#79CFDC] relative">
      <div className="min-h-[60vh] max-w-6xl mx-auto grid md:grid-cols-2 px-6 py-8">
        <div className="flex items-center text-center text-white font-semibold">
          <p className="text-4xl w-full text-center mb-3">Track Package</p>
        </div>
        <div className="hidden md:flex items-center h-full w-full">
          <div className="w-full max-w-sm mx-auto">
            <BrowsingPhoneVector />
          </div>
        </div>
      </div>
      <div className="h-24 bg-gradient-to-b from-[#79CFDC] to-white"></div>
    </section>
  )
}

export function MainSection(props: { preselectedId: string | null }) {
  const [selectedPackageId, setSelectedPackageId] = useState<null | string>(
    props.preselectedId,
  )

  return (
    <>
      <HeroSection />
      <ChoosePackageForm
        setSelectedPackageId={(packageId) => setSelectedPackageId(packageId)}
      />

      {selectedPackageId !== null && (
        <PackageDetailsSections packageId={selectedPackageId} />
      )}
      <div className="p-4  bg-[url('/assets/img/tracking/tracking-bg-footer.png')] bg-cover bg-no-repeat bg-center">
        <div className="py-10">
          <h1 className="text-center text-white font-semibold text-4xl mb-10">
            Any other inquiries? <br />
            Just Contact Us!
          </h1>
          <div className="flex justify-center">
            <button className="drop-shadow-lg inline-flex items-center bg-red-500 text-white px-6 py-2 text-base rounded-full hover:bg-red-800 font-bold font-family  ">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

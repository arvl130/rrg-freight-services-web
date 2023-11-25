import Image from "next/image"
import Head from "next/head"
import Footer from "@/components/footer"
import Navbar from "@/components/navBar"
import { TrackingVerticalTimeline } from "../components/tracking/timeline"
import { Truck } from "@phosphor-icons/react/Truck"
import { Path } from "@phosphor-icons/react/Path"
import { MapPin } from "@phosphor-icons/react/MapPin"
import { CheckCircle } from "@phosphor-icons/react/CheckCircle"
import { Package } from "@phosphor-icons/react/Package"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import Boxes from "@/components/icons/boxes"

function TrackingPageHead() {
  return (
    <Head>
      <title>Tracking &#x2013; RRG Freight Services</title>
      <meta
        name="description"
        content="RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs."
      />
    </Head>
  )
}

function PackageDetailsSections({ packageId }: { packageId: number }) {
  const {
    status,
    data: _package,
    error,
  } = api.package.getWithStatusLogsById.useQuery({
    id: packageId,
  })

  if (status === "loading")
    return (
      <>
        <div className="flex justify-center py-10">
          <LoadingSpinner></LoadingSpinner>
        </div>
      </>
    )
  if (status === "error")
    return (
      <>
        <div className="flex justify-center py-10">
          <h2 className="text-[25px] text-red font-semibold">
            Package Not Found!
          </h2>
        </div>
      </>
    )

  return (
    <>
      <section className="max-w-4xl mx-auto flex justify-between mb-6">
        <div className="flex flex-col items-center">
          <div className="outline black rounded-full p-4 mb-6">
            <Package size={44} color="#1d798b" />
          </div>
          <div>Handed Over</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="outline black rounded-full p-4 mb-6">
            <Truck size={44} color="#1d798b" />
          </div>
          <div>In Transit</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="outline black rounded-full p-4 mb-6">
            <Path size={44} color="#1d798b" />
          </div>
          <div>Out for Delivery</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="outline black rounded-full p-4 mb-6">
            <MapPin size={44} color="#1d798b" />
          </div>
          <div>Delivered</div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto">
        <div className="grid grid-cols-[2fr,_3fr] gap-4">
          <div className="bg-[#EEEAEA] w-full rounded-lg flex flex-col justify-center items-center py-4">
            <CheckCircle size={96} color="#1E1E1E" />
            <div className="text-center font-semibold">Estimated Delivery</div>
            <div className="text-center">N/A</div>
          </div>

          <div className="bg-[#ACDEE2] w-full rounded-lg flex flex-col items-center px-6 py-4">
            <div className="text-center mb-3 font-semibold">
              Shipping Details
            </div>

            <div className="w-full justify-center items-center grid grid-cols-2">
              <div className="text-center">Tracking Number</div>
              <div className="text-center border-l border-black px-3">
                {_package.id}
              </div>
              <div className="text-center">Recipient Name</div>
              <div className="text-center border-l border-black px-3">
                {_package.receiverFullName}
              </div>
              <div className="text-center">Location</div>
              <div className="text-center border-l border-black px-3">
                {_package.receiverStreetAddress}, Brgy.{" "}
                {_package.receiverBarangay}, {_package.receiverCity},{" "}
                {_package.receiverStateOrProvince},{" "}
                {_package.receiverCountryCode} {_package.receiverPostalCode}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrackingVerticalTimeline packageStatusLogs={_package.statusLogs} />
    </>
  )
}

const choosePackageFormSchema = z.object({
  packageId: z
    .string()
    .min(1, {
      message: "Please enter a tracking number",
    })
    .regex(/^\d+$/, {
      message: "Please enter a valid tracking number",
    }),
})

type ChoosePackageFormType = z.infer<typeof choosePackageFormSchema>

export function ChoosePackageForm({
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
    <div className="px-16 mb-14 w-full md:w-full md:mx-auto md:grid md:grid-cols-[auto_1fr] md:gap-4 md:my-6 lg:px-52 ">
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

export default function TrackingPage() {
  const [selectedPackageId, setSelectedPackageId] = useState<null | number>(
    null,
  )

  return (
    <>
      <TrackingPageHead />
      <Navbar />

      <header>
        <section key="section1">
          <div
            style={{
              minWidth: "100%",
              background: "linear-gradient(#79CFDC 80%, #FFFFFF)",
            }}
            className="relative min-h-[450px] md:min-h-[650px]"
          >
            <p
              style={{ letterSpacing: "2px", textShadow: "2px 2px #707070" }}
              className="text-[70px] text-white text-center w-full pt-[200px] font-bold leading-none tracking-wide lg:absolute lg:w-[650px] lg:top-[40%] lg:left-32 lg:text-left lg:pt-0"
            >
              Track Package
            </p>
            <div className="absolute right-0 bottom-20 hidden md:block">
              <Boxes></Boxes>
            </div>
          </div>
        </section>
      </header>

      <ChoosePackageForm
        setSelectedPackageId={(packageId) =>
          setSelectedPackageId(parseInt(packageId))
        }
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
      <Footer />
    </>
  )
}

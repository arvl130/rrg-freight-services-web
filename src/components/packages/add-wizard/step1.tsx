import React, { useRef } from "react"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { api } from "@/utils/api"
import {
  ShippingMode,
  ShippingType,
  supportedShippingModes,
  supportedShippingTypes,
  supportedReceptionModes,
  ReceptionMode,
} from "@/utils/constants"
import { countryCodeToName, supportedCountryCodes } from "@/utils/country-code"
import toast from "react-hot-toast"

export default function Forms() {
  const formRef = useRef<null | HTMLFormElement>(null)
  const { status, data: packages, refetch } = api.package.getAll.useQuery()
  const { isLoading, mutate: addPackage } = api.package.create.useMutation({
    onSuccess: () => {
      toast.success("Submit successful!")
      refetch()
      formRef.current?.reset()
    },
  })

  return (
    <form
      ref={formRef}
      className="bg-white px-12 py-6 rounded-2xl"
      onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        addPackage({
          shippingMode: formData.get("shippingMode") as ShippingMode,
          shippingType: formData.get("shippingType") as ShippingType,
          receptionMode: formData.get("receptionMode") as ReceptionMode,
          weightInKg: parseInt(formData.get("weightInKg") as string),
          senderFullName: formData.get("senderFullName") as string,
          senderContactNumber: formData.get("senderContactNumber") as string,
          senderEmailAddress: formData.get("senderEmailAddress") as string,
          senderStreetAddress: formData.get("senderStreetAddress") as string,
          senderCity: formData.get("senderCity") as string,
          senderStateOrProvince: formData.get(
            "senderStateOrProvince",
          ) as string,
          senderCountryCode: formData.get("senderCountryCode") as string,
          senderPostalCode: parseInt(
            formData.get("senderPostalCode") as string,
          ),
          receiverFullName: formData.get("receiverFullName") as string,
          receiverContactNumber: formData.get(
            "receiverContactNumber",
          ) as string,
          receiverEmailAddress: formData.get("receiverEmailAddress") as string,
          receiverStreetAddress: formData.get(
            "receiverStreetAddress",
          ) as string,
          receiverBarangay: formData.get("receiverBarangay") as string,
          receiverCity: formData.get("receiverCity") as string,
          receiverStateOrProvince: formData.get(
            "receiverStateOrProvince",
          ) as string,
          receiverCountryCode: formData.get("receiverCountryCode") as string,
          receiverPostalCode: parseInt(
            formData.get("receiverPostalCode") as string,
          ),
        })
      }}
    >
      <h1 className="font-semibold text-lg mb-2">Sender Info:</h1>
      <div className="grid grid-cols-3 gap-x-4 mb-4">
        <div className="mb-2">
          <label className="block mb-1">Full Name</label>
          <input
            required
            name="senderFullName"
            type="text"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Contact Number</label>
          <input
            required
            name="senderContactNumber"
            type="text"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Email Address</label>
          <input
            required
            name="senderEmailAddress"
            type="email"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">City</label>
          <input
            required
            name="senderCity"
            type="text"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Street Address</label>
          <input
            required
            name="senderStreetAddress"
            type="text"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">State/Province</label>
          <input
            required
            name="senderStateOrProvince"
            type="text"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Country Code</label>
          <select
            name="senderCountryCode"
            className="block w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          >
            {supportedCountryCodes.map((countryCode) => (
              <option key={countryCode} value={countryCode}>
                {countryCodeToName(countryCode)}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Postal Code</label>
          <input
            required
            name="senderPostalCode"
            type="number"
            placeholder="1111"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Shipping Mode</label>
          <select
            name="shippingMode"
            className="block w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          >
            {supportedShippingModes.map((shippingMode) => (
              <option key={shippingMode} value={shippingMode}>
                {shippingMode}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block mb-1">Shipping Type</label>
          <select
            name="shippingType"
            className="block w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          >
            {supportedShippingTypes.map((shippingType) => (
              <option key={shippingType} value={shippingType}>
                {shippingType}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Weight in KG</label>
          <input
            required
            name="weightInKg"
            type="number"
            placeholder="50"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Reception Mode</label>
          <select
            name="receptionMode"
            className="block w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          >
            {supportedReceptionModes.map((receptionMode) => (
              <option key={receptionMode} value={receptionMode}>
                {receptionMode}
              </option>
            ))}
          </select>
        </div>
      </div>
      <hr className="my-4 border-t border-gray-200" />

      <h1 className="font-semibold text-lg mb-2">Receiver Info:</h1>
      <div className="grid grid-cols-3 gap-x-4 mb-4">
        <div className="mb-2">
          <label className="block mb-1">Full Name</label>
          <input
            required
            name="receiverFullName"
            type="text"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Contact Number</label>
          <input
            required
            name="receiverContactNumber"
            type="text"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>

        <div className="mb-2">
          <label className="block mb-1">Email Address</label>
          <input
            required
            name="receiverEmailAddress"
            type="email"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>

        <div className="mb-2">
          <label className="block mb-1">Street Address</label>
          <input
            required
            name="receiverStreetAddress"
            type="text"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Barangay</label>
          <input
            required
            name="receiverBarangay"
            type="text"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">City</label>
          <input
            required
            name="receiverCity"
            type="text"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">State/Province</label>
          <input
            required
            name="receiverStateOrProvince"
            type="text"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Country Code</label>
          <select
            name="receiverCountryCode"
            className="block w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          >
            {supportedCountryCodes.map((countryCode) => (
              <option key={countryCode} value={countryCode}>
                {countryCodeToName(countryCode)}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Postal Code</label>
          <input
            required
            name="receiverPostalCode"
            type="number"
            placeholder="1111"
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-red-400 hover:bg-blue-400 disabled:bg-blue-300 transition-colors px-4 py-2 rounded-md font-medium mr-2 text-white" 
        onClick={close}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-400 hover:bg-slate-400 disabled:bg-green-300 transition-colors px-4 py-2 rounded-md font-medium text-white"
        >
          {isLoading ? "Saving ..." : "Save"}
        </button>
      </div>
    </form>
  )
}

export function PackagesAddWizardInformation({
  isOpenModal,
}: {
  isOpenModal: boolean
}) {
  const { reset } = useForm()

  useEffect(() => {
    if (!isOpenModal) reset()
  }, [isOpenModal, reset])
  return (
    <div className="h-full grid grid-rows-[auto_1fr] grid-cols-[100%]">
      <div className="text-white font-bold text-center items-center py-4 [background-color:_#78CFDC] text-3xl">
        ADD PACKAGE
      </div>
      <div className="px-12 py-4 grid grid-rows-[auto_auto_1fr]">
        <Forms />
      </div>
    </div>
  )
}

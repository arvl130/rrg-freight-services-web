import { useForm, SubmitHandler } from "react-hook-form"
import { useEffect, useState } from "react"
import { api } from "@/utils/api"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

type Inputs = {
  sender_full_name: string
  sender_contact_number: string
  sender_email_address: string
  sender_street_address: string
  sender_state_province: string
  sender_country_code: string
  sender_postal_code: string
  shipping_mode: string
  shipping_type: string
  weight_in_kg: string
  receiver_full_name: string
  receiver_contact_number: string
  receiver_email_address: string
  receiver_street_address: string
  receiver_barangay: string
  receiver_state_province: string
  receiver_country_code: string
  receiver_postal_code: string
}

export function PackagesAddWizardInformation({
  isOpenModal,
  setIsOpenModal,
}: {
  isOpenModal: boolean
  setIsOpenModal: (isOpen: boolean) => void
}) {
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsLoading(true)
    setIsConfirmationVisible(true)
  }

  const handleSaveConfirmed = (data: Inputs) => {
    const packageData = {
      sender_full_name: data.sender_full_name,
      sender_contact_number: data.sender_contact_number,
      sender_email_address: data.sender_email_address,
      sender_street_address: data.sender_street_address,
      sender_state_province: data.sender_state_province,
      sender_country_code: data.sender_country_code,
      sender_postal_code: data.sender_postal_code,
      shipping_mode: data.shipping_mode,
      shipping_type: data.shipping_type,
      weight_in_kg: data.weight_in_kg,
      receiver_full_name: data.receiver_full_name,
      receiver_contact_number: data.receiver_contact_number,
      receiver_email_address: data.receiver_email_address,
      receiver_street_address: data.receiver_street_address,
      receiver_barangay: data.receiver_barangay,
      receiver_state_province: data.receiver_state_province,
      receiver_country_code: data.receiver_country_code,
      receiver_postal_code: data.receiver_postal_code,
    }
  }

  const close = () => {
    setIsConfirmationVisible(false)
  }
  const handleCancelSave = () => {
    close()
  }

  const utils = api.useUtils()

  useEffect(() => {
    if (!isOpenModal) reset()
  }, [isOpenModal, reset])

  return (
    <div className="h-full grid grid-rows-[auto_1fr] grid-cols-[100%]">
      <div className="text-white font-bold text-center items-center py-4 bg-cyan-400 text-3xl">
        ADD PACKAGE
      </div>
      <div className="px-12 py-4 grid grid-rows-[auto_auto_1fr]">
        <div className="overflow-auto p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="font-semibold text-lg mb-2">Sender Info:</h1>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-bold">Full Name</label>
                <input
                  {...register("sender_full_name", {
                    required: "Full Name is required",
                  })}
                  id="sender_full_name"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.sender_full_name
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="Fernando Jabili"
                />
                {errors.sender_full_name && (
                  <span className="text-red-500 text-sm">
                    {errors.sender_full_name.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold">Contact Number</label>
                <input
                  {...register("sender_contact_number", {
                    required: "Contact Number is required",
                  })}
                  id="sender_contact_number"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.sender_contact_number
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="+852 | 2838 8961"
                />
                {errors.sender_contact_number && (
                  <span className="text-red-500 text-sm">
                    {errors.sender_contact_number.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold">Email Address</label>
                <input
                  {...register("sender_email_address", {
                    required: "Email Address is required",
                  })}
                  id="sender_email_address"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.sender_email_address
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="e-mail@example.com"
                />
                {errors.sender_email_address && (
                  <span className="text-red-500 text-sm">
                    {errors.sender_email_address.message}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-bold">
                  Street Name, Building
                </label>
                <input
                  {...register("sender_street_address", {
                    required: "Street Address is required",
                  })}
                  id="sender_street_address"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.sender_street_address
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="Cambridge House 19 Cameron Road Tsimshatsui Kow..."
                />
                {errors.sender_street_address && (
                  <span className="text-red-500 text-sm">
                    {errors.sender_street_address.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold">Province</label>
                <select
                  {...register("sender_state_province", {
                    required: "Province is required",
                  })}
                  id="sender_state_province"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.sender_state_province
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="State/Province"
                >
                  <option></option>
                  <option value="HK">Hong Kong</option>
                  <option value="TV">TV/Monitors</option>
                  <option value="PC">PC</option>
                </select>

                {errors.sender_state_province && (
                  <span className="text-red-500 text-sm">
                    {errors.sender_state_province.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold">Country</label>
                <select
                  {...register("sender_country_code", {
                    required: "Country is required",
                  })}
                  id="sender_country_code"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.sender_country_code
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="Country Code"
                >
                  <option></option>
                  <option value="HK">Hong Kong</option>
                  <option value="TV">TV/Monitors</option>
                  <option value="PC">PC</option>
                </select>

                {errors.sender_country_code && (
                  <span className="text-red-500 text-sm">
                    {errors.sender_country_code.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold">Postal Code</label>
                <input
                  {...register("sender_postal_code", {
                    required: "Postal Code is required",
                  })}
                  id="sender_postal_code"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.sender_postal_code
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="Postal Code"
                />
                {errors.sender_postal_code && (
                  <span className="text-red-500 text-sm">
                    {errors.sender_postal_code.message}
                  </span>
                )}
              </div>
            </div>
            <div className=" mt-4 grid grid-cols-5 gap-5 pb-4">
              <div className="flex flex-col">
                <label htmlFor="shipping_mode" className="text-sm font-bold">
                  Mode
                </label>
                <select
                  {...register("shipping_mode", {
                    required: "Mode is required",
                  })}
                  id="shipping_mode"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.shipping_mode ? "border-red-500" : "border-stone-300"
                  } p-2`}
                  placeholder="Country Code"
                >
                  <option></option>
                  <option value="AF">Air Freight</option>
                  <option value="TV">TV/Monitors</option>
                  <option value="PC">PC</option>
                </select>
                {errors.shipping_mode && (
                  <span className="text-red-500 text-sm">
                    {errors.shipping_mode.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="shipping_type" className="text-sm font-bold">
                  Delivery Type
                </label>
                <select
                  {...register("shipping_type", {
                    required: "Delivery Type is required",
                  })}
                  id="shipping_type"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.shipping_type ? "border-red-500" : "border-stone-300"
                  } p-2`}
                  placeholder="Country Code"
                >
                  <option></option>
                  <option value="SD">Standard Delivery</option>
                  <option value="TV">TV/Monitors</option>
                  <option value="PC">PC</option>
                </select>
                {errors.shipping_type && (
                  <span className="text-red-500 text-sm">
                    {errors.shipping_type.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="weight_in_kg" className="text-sm font-bold">
                  Weight
                </label>
                <input
                  {...register("weight_in_kg", {
                    required: "Weight is required",
                  })}
                  id="weight_in_kg"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.weight_in_kg ? "border-red-500" : "border-stone-300"
                  } p-2`}
                  placeholder="KG | 50"
                />
                {errors.weight_in_kg && (
                  <span className="text-red-500 text-sm">
                    {errors.weight_in_kg.message}
                  </span>
                )}
              </div>
              <div className="flex items-center mb-2 ml-10 space-x-10">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="pickup" className="w-5 h-5" />
                  <label htmlFor="pickup" className="text-sm font-bold">
                    For Pick-Up
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="d2d" className="w-5 h-5" />
                  <label htmlFor="d2d" className="text-sm font-bold">
                    Door-to-Door Delivery
                  </label>
                </div>
              </div>
            </div>
            <hr className="my-4 border-t border-gray-200" />
            <h1 className="font-semibold text-lg mt-4 mb-2">Receiver Info:</h1>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-bold">Full Name</label>
                <input
                  {...register("receiver_full_name", {
                    required: "Full Name is required",
                  })}
                  id="receiver_full_name"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.receiver_full_name
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="Receiver Full Name"
                />
                {errors.receiver_full_name && (
                  <span className="text-red-500 text-sm">
                    {errors.receiver_full_name.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold">Contact Number</label>
                <input
                  {...register("receiver_contact_number", {
                    required: "Contact Number is required",
                  })}
                  id="receiver_contact_number"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.receiver_contact_number
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="Receiver Contact Number"
                />
                {errors.receiver_contact_number && (
                  <span className="text-red-500 text-sm">
                    {errors.receiver_contact_number.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold">Email Address</label>
                <input
                  {...register("receiver_email_address", {
                    required: "Email Address is required",
                  })}
                  id="receiver_email_address"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.receiver_email_address
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="Receiver Email Address"
                />
                {errors.receiver_email_address && (
                  <span className="text-red-500 text-sm">
                    {errors.receiver_email_address.message}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-bold">
                  Street Name, Building
                </label>
                <input
                  {...register("receiver_street_address", {
                    required: "Street Address is required",
                  })}
                  id="receiver_street_address"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.receiver_street_address
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="Receiver Street Address"
                />
                {errors.receiver_street_address && (
                  <span className="text-red-500 text-sm">
                    {errors.receiver_street_address.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold">Barangay</label>
                <select
                  {...register("receiver_barangay", {
                    required: "Barangay is required",
                  })}
                  id="receiver_barangay"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.receiver_barangay
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="Receiver Barangay"
                >
                  <option></option>
                  <option value="AF">Air Freight</option>
                  <option value="TV">TV/Monitors</option>
                </select>
                {errors.receiver_barangay && (
                  <span className="text-red-500 text-sm">
                    {errors.receiver_barangay.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold">Province</label>
                <select
                  {...register("receiver_state_province", {
                    required: "Province is required",
                  })}
                  id="receiver_state_province"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.receiver_state_province
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="Province"
                >
                  <option></option>
                  <option value="AF">Air Freight</option>
                  <option value="TV">TV/Monitors</option>
                </select>
                {errors.receiver_state_province && (
                  <span className="text-red-500 text-sm">
                    {errors.receiver_state_province.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold">Country</label>
                <input
                  {...register("receiver_country_code", {
                    required: "Country Code is required",
                  })}
                  id="receiver_country_code"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.receiver_country_code
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="Receiver Country Code"
                />
                {errors.receiver_country_code && (
                  <span className="text-red-500 text-sm">
                    {errors.receiver_country_code.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold">Postal Code</label>
                <input
                  {...register("receiver_postal_code", {
                    required: "Postal Code is required",
                  })}
                  id="receiver_postal_code"
                  className={`w-full h-10 bg-white rounded border ${
                    errors.receiver_postal_code
                      ? "border-red-500"
                      : "border-stone-300"
                  } p-2`}
                  placeholder="Receiver Postal Code"
                />
                {errors.receiver_postal_code && (
                  <span className="text-red-500 text-sm">
                    {errors.receiver_postal_code.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="w-20 h-10 text-white bg-green-400 rounded-lg"
              >
                Save
              </button>
              <button
                type="button"
                className="w-20 h-10 text-white bg-red-400 rounded-lg ml-2"
                onClick={() => close()}
              >
                Cancel
              </button>
            </div>
            {isConfirmationVisible && (
              <div className="fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg shadow-md w-[448px]">
                  <p className="text-lg font-bold mb-4">Confirm the Package?</p>
                  <p>
                    Are you sure you want to save any changes on the package
                    information?
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleCancelSave}
                      className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveConfirmed}
                      className="px-4 py-2 bg-green-400 text-white rounded-lg"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

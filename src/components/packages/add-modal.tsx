import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as Dialog from "@radix-ui/react-dialog"
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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const createPackageFormSchema = z.object({
  shippingMode: z.custom<ShippingMode>((val) =>
    supportedShippingModes.includes(val as ShippingMode),
  ),
  shippingType: z.custom<ShippingType>((val) =>
    supportedShippingTypes.includes(val as ShippingType),
  ),
  receptionMode: z.custom<ReceptionMode>((val) =>
    supportedReceptionModes.includes(val as ReceptionMode),
  ),
  weightInKg: z.number(),
  senderFullName: z.string().min(1).max(100),
  senderContactNumber: z.string().min(1).max(15),
  senderEmailAddress: z.string().min(1).max(100),
  senderStreetAddress: z.string().min(1).max(255),
  senderCity: z.string().min(1).max(100),
  senderStateOrProvince: z.string().min(1).max(100),
  senderCountryCode: z.string().min(1).max(3),
  senderPostalCode: z.number(),
  receiverFullName: z.string().min(1).max(100),
  receiverContactNumber: z.string().min(1).max(15),
  receiverEmailAddress: z.string().min(1).max(100),
  receiverStreetAddress: z.string().min(1).max(255),
  receiverBarangay: z.string().min(1).max(100),
  receiverCity: z.string().min(1).max(100),
  receiverStateOrProvince: z.string().min(1).max(100),
  receiverCountryCode: z.string().min(1).max(3),
  receiverPostalCode: z.number(),
})

type CreatePackageFormType = z.infer<typeof createPackageFormSchema>

export function PackagesAddModal({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: () => void
}) {
  const { register, handleSubmit, reset } = useForm<CreatePackageFormType>({
    resolver: zodResolver(createPackageFormSchema),
  })

  const apiUtils = api.useUtils()
  const { isLoading, mutate } = api.package.create.useMutation({
    onSuccess: () => {
      toast.success("Submit successful!")
      apiUtils.package.getAll.invalidate()
      reset()
      close()
    },
  })

  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100%,_64rem)] h-[calc(100vh-_6rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-4 [background-color:_#78CFDC] h-full rounded-t-2xl text-3xl">
            ADD PACKAGE
          </Dialog.Title>
          <form
            className="bg-white px-24 py-10 rounded-2xl h-full overflow-y-auto"
            onSubmit={handleSubmit((formData) => mutate(formData))}
          >
            <h1 className="font-semibold text-lg mb-2">Sender Info:</h1>
            <div className="grid grid-cols-3 gap-x-4 mb-4">
              <div className="mb-2">
                <label className="block mb-1">Full Name</label>
                <input
                  required
                  {...register("senderFullName")}
                  type="text"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Contact Number</label>
                <input
                  required
                  {...register("senderContactNumber")}
                  type="text"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Email Address</label>
                <input
                  required
                  {...register("senderEmailAddress")}
                  type="email"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Street Address</label>
                <input
                  required
                  {...register("senderStreetAddress")}
                  type="text"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">City</label>
                <input
                  required
                  {...register("senderCity")}
                  type="text"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">State/Province</label>
                <input
                  required
                  {...register("senderStateOrProvince")}
                  type="text"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Country Code</label>
                <select
                  {...register("senderCountryCode")}
                  className="block w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                  defaultValue={"ARE"}
                >
                  {supportedCountryCodes.map((countryCode) => (
                    <option key={countryCode} value={countryCode}>
                      {countryCodeToName(countryCode)} ({countryCode})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block mb-1">Postal Code</label>
                <input
                  required
                  {...register("senderPostalCode")}
                  type="number"
                  placeholder="1111"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Shipping Mode</label>
                <select
                  {...register("shippingMode")}
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
                  {...register("shippingType")}
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
                  {...register("weightInKg")}
                  type="number"
                  placeholder="50"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Reception Mode</label>
                <select
                  {...register("receptionMode")}
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
                  {...register("receiverFullName")}
                  type="text"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Contact Number</label>
                <input
                  required
                  {...register("receiverContactNumber")}
                  type="text"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>

              <div className="mb-2">
                <label className="block mb-1">Email Address</label>
                <input
                  required
                  {...register("receiverEmailAddress")}
                  type="email"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>

              <div className="mb-2">
                <label className="block mb-1">Street Address</label>
                <input
                  required
                  {...register("receiverStreetAddress")}
                  type="text"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Barangay</label>
                <input
                  required
                  {...register("receiverBarangay")}
                  type="text"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">City</label>
                <input
                  required
                  {...register("receiverCity")}
                  type="text"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">State/Province</label>
                <input
                  required
                  {...register("receiverStateOrProvince")}
                  type="text"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Country Code</label>
                <select
                  {...register("receiverCountryCode")}
                  className="block w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                  defaultValue={"PHL"}
                >
                  {supportedCountryCodes.map((countryCode) => (
                    <option key={countryCode} value={countryCode}>
                      {countryCodeToName(countryCode)} ({countryCode})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block mb-1">Postal Code</label>
                <input
                  required
                  {...register("receiverPostalCode")}
                  type="number"
                  placeholder="1111"
                  className="block w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-400 focus:ring-blue-300/40"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-400 disabled:bg-red-300 transition-colors px-4 py-2 rounded-md font-medium mr-2 text-white"
                onClick={() => close()}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-400 disabled:bg-green-300 transition-colors px-4 py-2 rounded-md font-medium text-white"
              >
                {isLoading ? "Saving ..." : "Save"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

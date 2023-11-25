import * as Dialog from "@radix-ui/react-dialog"
import { Package } from "@/server/db/entities"
import {
  REGEX_ONE_OR_MORE_DIGITS,
  ReceptionMode,
  ShippingMode,
  ShippingParty,
  ShippingType,
  supportedReceptionModes,
  supportedShippingModes,
  supportedShippingParties,
  SUPPORTED_SHIPPING_TYPES,
} from "@/utils/constants"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"

const editFormSchema = z.object({
  id: z.number(),
  shippingParty: z.custom<ShippingParty>((val) =>
    supportedShippingParties.includes(val as ShippingParty),
  ),
  shippingMode: z.custom<ShippingMode>((val) =>
    supportedShippingModes.includes(val as ShippingMode),
  ),
  shippingType: z.custom<ShippingType>((val) =>
    SUPPORTED_SHIPPING_TYPES.includes(val as ShippingType),
  ),
  receptionMode: z.custom<ReceptionMode>((val) =>
    supportedReceptionModes.includes(val as ReceptionMode),
  ),
  weightInKg: z.string().min(1).regex(REGEX_ONE_OR_MORE_DIGITS),
  senderFullName: z.string().min(1).max(100),
  senderContactNumber: z.string().min(1).max(15),
  senderEmailAddress: z.string().min(1).max(100).email(),
  senderStreetAddress: z.string().min(1).max(255),
  senderCity: z.string().min(1).max(100),
  senderStateOrProvince: z.string().min(1).max(100),
  senderCountryCode: z.string().length(3),
  senderPostalCode: z.string().min(1).regex(REGEX_ONE_OR_MORE_DIGITS),
  receiverFullName: z.string().min(1).max(100),
  receiverContactNumber: z.string().min(1).max(15),
  receiverEmailAddress: z.string().min(1).max(100).email(),
  receiverStreetAddress: z.string().min(1).max(255),
  receiverBarangay: z.string().min(1).max(100),
  receiverCity: z.string().min(1).max(100),
  receiverStateOrProvince: z.string().min(1).max(100),
  receiverCountryCode: z.string().length(3),
  receiverPostalCode: z.string().min(1).regex(REGEX_ONE_OR_MORE_DIGITS),
})

type EditFormType = z.infer<typeof editFormSchema>

export function PackagesEditDetailsModal({
  package: _package,
  isOpen,
  close,
}: {
  package: Package
  isOpen: boolean
  close: () => void
}) {
  const apiUtils = api.useUtils()
  const { isLoading, mutate } = api.package.updateById.useMutation({
    onSuccess: () => {
      apiUtils.package.getAll.invalidate()
      toast.success("Update success!")
      close()
      reset()
    },
  })

  const {
    reset,
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<EditFormType>({
    resolver: zodResolver(editFormSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    defaultValues: {
      id: _package.id,
      shippingParty: _package.shippingParty,
      shippingMode: _package.shippingMode,
      shippingType: _package.shippingType,
      receptionMode: _package.receptionMode,
      weightInKg: _package.weightInKg.toString(),
      senderFullName: _package.senderFullName,
      senderContactNumber: _package.senderContactNumber,
      senderEmailAddress: _package.senderEmailAddress,
      senderStreetAddress: _package.senderStreetAddress,
      senderCity: _package.senderCity,
      senderStateOrProvince: _package.senderStateOrProvince,
      senderCountryCode: _package.senderCountryCode,
      senderPostalCode: _package.senderPostalCode.toString(),
      receiverFullName: _package.receiverFullName,
      receiverContactNumber: _package.receiverContactNumber,
      receiverEmailAddress: _package.receiverEmailAddress,
      receiverStreetAddress: _package.receiverStreetAddress,
      receiverBarangay: _package.receiverBarangay,
      receiverCity: _package.receiverCity,
      receiverStateOrProvince: _package.receiverStateOrProvince,
      receiverCountryCode: _package.receiverCountryCode,
      receiverPostalCode: _package.receiverPostalCode.toString(),
    },
  })

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_2rem),_56rem)] h-[32rem] grid grid-rows-[2.5rem_1fr] rounded-lg bg-white"
        >
          <Dialog.Title className="[background-color:_#78CFDC] px-4 py-2 rounded-t-lg text-white font-semibold text-center">
            Edit Package
          </Dialog.Title>
          <form
            className="px-6 py-4 h-full grid overflow-y-auto"
            onSubmit={handleSubmit((formData) =>
              mutate({
                ...formData,
                weightInKg: Number(formData.weightInKg),
                senderPostalCode: Number(formData.senderPostalCode),
                receiverPostalCode: Number(formData.receiverPostalCode),
              }),
            )}
          >
            <div className="overflow-y-auto pb-2">
              <div className="border-b border-gray-300 pb-6 mb-5">
                <p className="font-semibold">Sender Info:</p>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="col-span-2">
                    <label className="block font-medium">Full Name</label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("senderFullName")}
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Contact Number</label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("senderContactNumber")}
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Email Address</label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("senderEmailAddress")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block font-medium">Street address</label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("senderStreetAddress")}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-medium">
                        State / Province
                      </label>
                      <input
                        type="text"
                        className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        {...register("senderStateOrProvince")}
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Country</label>
                      <input
                        type="text"
                        className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        {...register("senderCountryCode")}
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Postal Code</label>
                      <input
                        type="text"
                        className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        {...register("senderPostalCode")}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-48">
                    <label className="block font-medium">Shipping Mode</label>
                    <select
                      className="block w-full text-sm px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("shippingMode")}
                    >
                      {supportedShippingModes.map((shippingMode) => (
                        <option key={shippingMode} value={shippingMode}>
                          {shippingMode}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-36">
                    <label className="block font-medium">Delivery Type</label>
                    <select
                      className="block w-full text-sm px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("shippingType")}
                    >
                      {SUPPORTED_SHIPPING_TYPES.map((shippingType) => (
                        <option key={shippingType} value={shippingType}>
                          {shippingType}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block font-medium">Weight</label>
                    <input
                      type="number"
                      className="block w-full text-sm px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("weightInKg")}
                    />
                  </div>
                  <div className="flex gap-3">
                    {supportedReceptionModes.map((receptionMode) => (
                      <label className="flex items-center" key={receptionMode}>
                        <input
                          type="radio"
                          className="text-sm mr-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                          value={receptionMode}
                          {...register("receptionMode")}
                        />
                        <span className="font-medium">{receptionMode}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold">Receiver Info:</p>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="col-span-2">
                    <label className="block font-medium">Full Name</label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("receiverFullName")}
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Contact Number</label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("receiverContactNumber")}
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Email Address</label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("receiverEmailAddress")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="col-span-2">
                    <label className="block font-medium">Street address</label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("receiverStreetAddress")}
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Barangay</label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("receiverBarangay")}
                    />
                  </div>
                  <div>
                    <label className="block font-medium">
                      State / Province
                    </label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("receiverStateOrProvince")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block font-medium">Country</label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("receiverCountryCode")}
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Postal Code</label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("receiverPostalCode")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end border-t pt-2 gap-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => close()}
                className="bg-red-500 hover:bg-red-400 disabled:bg-red-300 transition-colors text-white px-6 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !isDirty}
                className="bg-green-500 hover:bg-green-400 disabled:bg-green-300 transition-colors text-white px-6 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

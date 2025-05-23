import * as Dialog from "@radix-ui/react-dialog"
import type { Package } from "@/server/db/entities"
import type {
  PackageReceptionMode,
  PackageShippingMode,
  PackageShippingType,
} from "@/utils/constants"
import {
  REGEX_EMPTY_STRING_OR_ONE_OR_MORE_DIGITS,
  REGEX_ONE_OR_MORE_DIGITS,
  REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS,
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
} from "@/utils/constants"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { useState, useEffect } from "react"
import { Trash } from "@phosphor-icons/react/dist/ssr/Trash"
const editFormSchema = z.object({
  id: z.string(),
  preassignedId: z.string(),
  shippingMode: z.custom<PackageShippingMode>((val) =>
    SUPPORTED_PACKAGE_SHIPPING_MODES.includes(val as PackageShippingMode),
  ),
  shippingType: z.custom<PackageShippingType>((val) =>
    SUPPORTED_PACKAGE_SHIPPING_TYPES.includes(val as PackageShippingType),
  ),
  receptionMode: z.custom<PackageReceptionMode>((val) =>
    SUPPORTED_PACKAGE_RECEPTION_MODES.includes(val as PackageReceptionMode),
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
  isFragile: z.boolean(),
  declaredValue: z
    .string()
    .regex(REGEX_EMPTY_STRING_OR_ONE_OR_MORE_DIGITS)
    .optional(),
  volumeInCubicMeter: z
    .string()
    .min(1)
    .regex(REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS),
  failedAttempts: z.string().min(1).regex(REGEX_ONE_OR_MORE_DIGITS),
})

type EditFormType = z.infer<typeof editFormSchema>

function PromptDeletePackageModal({
  packageId,
  isOpen,
  close: closeDeleteModal,
}: {
  packageId: string
  isOpen: boolean
  close: () => void
}) {
  const apiUtils = api.useUtils()
  const { isPending: loadingDeletion, mutate: deletePackage } =
    api.package.deletedById.useMutation({
      onSuccess: () => {
        apiUtils.package.getAll.invalidate()
        toast.success("Delete success!")
        closeDeleteModal()
      },
    })

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_2rem),_18rem)] h-[15rem] grid grid-rows-[2.5rem_1fr] rounded-lg bg-white "
        >
          <Dialog.Title className="[background-color:_#78CFDC] px-4 py-2 rounded-t-lg text-white font-semibold text-center ">
            Delete Package
          </Dialog.Title>
          <div className="p-3 flex flex-col justify-between">
            {" "}
            <div>Are ypu sure you want to delete this package?</div>
            <div className="flex justify-between pt-2 gap-2">
              <button
                type="button"
                onClick={() => closeDeleteModal()}
                className="bg-red-500 hover:bg-red-400 disabled:bg-red-300 transition-colors text-white px-6 py-2 rounded-md mr-4"
              >
                Cancel
              </button>
              <button
                disabled={loadingDeletion}
                onClick={() => {
                  deletePackage({ id: packageId })
                }}
                type="button"
                className="bg-green-500 hover:bg-green-400 disabled:bg-green-300 transition-colors text-white px-6 py-2 rounded-md"
              >
                {loadingDeletion ? <>Loading..</> : <>Delete</>}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function EditDetailsModal({
  package: _package,
  isOpen,
  close,
}: {
  package: Package
  isOpen: boolean
  close: () => void
}) {
  const apiUtils = api.useUtils()
  const { isPending, mutate } = api.package.updateById.useMutation({
    onSuccess: () => {
      apiUtils.package.getAll.invalidate()
      toast.success("Update success!")
      close()
      reset()
    },
  })
  const [showDeletePackageModal, setShowDeletePackageModal] = useState<
    "DELETE_PACKAGE" | null
  >(null)

  const defaultValues = {
    id: _package.id,
    preassignedId: _package.preassignedId,
    shippingMode: _package.shippingMode,
    shippingType: _package.shippingType as PackageShippingType,
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
    declaredValue:
      _package.declaredValue === null
        ? undefined
        : _package.declaredValue.toString(),
    failedAttempts: _package.failedAttempts.toString(),
    volumeInCubicMeter: _package.volumeInCubicMeter.toString(),
    isFragile: _package.isFragile === 1,
  }

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { isDirty },
    watch,
  } = useForm<EditFormType>({
    resolver: zodResolver(editFormSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    defaultValues,
  })

  const provinceWatched = watch("receiverStateOrProvince")
  const cityWatched = watch("receiverCity")
  const barangayWatched = watch("receiverBarangay")

  const [hasDeclaredValue, setHasDeclaredValue] = useState(
    _package.declaredValue !== null,
  )

  const { data: provinces } = api.addressPicker.getAllProvinces.useQuery()

  const [selectedProvinceId, setSelectedProvinceId] = useState("")

  const { data: cities } = api.addressPicker.getAllCitiesByProvinceId.useQuery({
    provinceId: selectedProvinceId!,
  })
  const [selectedCityId, setSelectedCityId] = useState("")

  const { data: barangays } = api.addressPicker.getAllBarangayByCityId.useQuery(
    {
      cityId: selectedCityId!,
    },
  )

  const [selectedBarangayId, setSelectedBarangayId] = useState("")

  useEffect(() => {
    const initialSelectedProvinceId =
      provinces?.find((province) => province.name === provinceWatched)
        ?.provinceId || ""

    setSelectedProvinceId(initialSelectedProvinceId)
  }, [provinces, provinceWatched])

  useEffect(() => {
    const initialSelectedCityId =
      cities?.find((city) => city.name === cityWatched)?.cityId || ""

    setSelectedCityId(initialSelectedCityId)
  }, [cities, cityWatched])

  useEffect(() => {
    const initialSelectedBarangayId =
      barangays?.find((barangay) => barangay.name === barangayWatched)?.code ||
      ""

    setSelectedBarangayId(initialSelectedBarangayId)
  }, [barangayWatched, barangays])

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
            onSubmit={handleSubmit((formData) => {
              console.log("province;", selectedProvinceId)
              console.log("barangay;", selectedBarangayId)

              mutate({
                ...formData,
                receiverStateOrProvince: selectedProvinceId,
                receiverCity: selectedCityId!,
                receiverBarangay: selectedBarangayId!,
                weightInKg: Number(formData.weightInKg),
                senderPostalCode: Number(formData.senderPostalCode),
                receiverPostalCode: Number(formData.receiverPostalCode),
                declaredValue:
                  formData.declaredValue === "" ||
                  formData.declaredValue === undefined
                    ? null
                    : Number(formData.declaredValue),
                failedAttempts: Number(formData.failedAttempts),
                volumeInCubicMeter: Number(formData.volumeInCubicMeter),
              })
            })}
          >
            <div className="overflow-y-auto pb-2">
              <div className="border-b border-gray-300 pb-6 mb-5 grid grid-cols-2 gap-x-3 gap-y-2">
                <div>
                  <label className="block font-medium">
                    Tracking Number (from Agent)
                  </label>
                  <input
                    type="text"
                    className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    {...register("preassignedId")}
                  />
                </div>
                <div className="grid grid-cols-[auto_1fr]">
                  <label className="block font-medium">
                    <input
                      type="checkbox"
                      checked={hasDeclaredValue}
                      onChange={(e) => {
                        if (e.currentTarget.checked) {
                          if (defaultValues.declaredValue)
                            resetField("declaredValue")
                          else setValue("declaredValue", "1")
                        } else {
                          setValue("declaredValue", "")
                        }

                        setHasDeclaredValue(e.currentTarget.checked)
                      }}
                    />
                    <span className="ml-2">Declared Value (₱)</span>
                  </label>
                  {hasDeclaredValue ? (
                    <input
                      type="number"
                      className="col-span-2 block text-sm w-full px-4 py-2 text-gray-700 disabled:text-gray-400 bg-white disabled:bg-gray-100 border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      min={1}
                      step={1}
                      {...register("declaredValue")}
                    />
                  ) : (
                    <input
                      disabled
                      type="number"
                      className="col-span-2 block text-sm w-full px-4 py-2 text-gray-700 disabled:text-gray-400 bg-white disabled:bg-gray-100 border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                  )}
                </div>
                <div>
                  <label className="block font-medium">Space Use (m³)</label>
                  <input
                    type="number"
                    className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    min={1}
                    step={1}
                    {...register("volumeInCubicMeter")}
                  />
                </div>
                <div>
                  <label className="block font-medium">Failed attempts</label>
                  <input
                    type="number"
                    className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    min={0}
                    step={1}
                    {...register("failedAttempts")}
                  />
                </div>
                <div>
                  <label className="font-medium">
                    <input
                      type="checkbox"
                      className="text-sm px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("isFragile")}
                    />
                    <span className="ml-2">Fragile?</span>
                  </label>
                </div>
              </div>
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
                      {SUPPORTED_PACKAGE_SHIPPING_MODES.map((shippingMode) => (
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
                      {SUPPORTED_PACKAGE_SHIPPING_TYPES.map((shippingType) => (
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
                    {SUPPORTED_PACKAGE_RECEPTION_MODES.map((receptionMode) => (
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
                  <div>
                    <label className="block font-medium">
                      State / Province
                    </label>

                    <select
                      onChange={(e) => {
                        setSelectedProvinceId(e.currentTarget.value)
                      }}
                      value={selectedProvinceId}
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    >
                      {provinces?.map((province) => (
                        <option
                          value={province.provinceId}
                          selected={
                            province.name === provinceWatched ? true : false
                          }
                          key={province.id}
                        >
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block font-medium">City</label>

                    <select
                      onChange={(e) => {
                        setSelectedCityId(e.currentTarget.value)
                      }}
                      value={selectedCityId}
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    >
                      {cities?.map((city) => (
                        <option
                          selected={city.name === cityWatched ? true : false}
                          value={city.cityId}
                          key={city.id}
                        >
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium">Barangay</label>

                    <select
                      onChange={(e) => {
                        setSelectedBarangayId(e.currentTarget.value)
                      }}
                      value={selectedBarangayId}
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    >
                      {barangays?.map((barangay) => (
                        <option
                          selected={
                            barangay.name === barangayWatched ? true : false
                          }
                          value={barangay.code}
                          key={barangay.id}
                        >
                          {barangay.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block font-medium">Street address</label>
                    <input
                      type="text"
                      className="block text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                      {...register("receiverStreetAddress")}
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
            <div className="flex justify-between border-t pt-2 gap-2">
              <div>
                <button
                  type="button"
                  onClick={() => setShowDeletePackageModal("DELETE_PACKAGE")}
                  className="bg-red-500 hover:bg-red-400 disabled:bg-red-300 transition-colors text-white px-6 py-2 rounded-md flex justify-center items-center"
                >
                  <Trash size={20} />
                  Delete
                </button>
              </div>
              <div>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => close()}
                  className="bg-red-500 hover:bg-red-400 disabled:bg-red-300 transition-colors text-white px-6 py-2 rounded-md mr-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-green-500 hover:bg-green-400 disabled:bg-green-300 transition-colors text-white px-6 py-2 rounded-md"
                >
                  Save
                </button>
                {
                  <PromptDeletePackageModal
                    packageId={_package.id}
                    isOpen={showDeletePackageModal === "DELETE_PACKAGE"}
                    close={() => {
                      setShowDeletePackageModal(null)
                      close()
                    }}
                  />
                }
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

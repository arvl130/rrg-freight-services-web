import * as Dialog from "@radix-ui/react-dialog"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import type { ChangeEvent, FormEvent } from "react"
import { useEffect, useState } from "react"
import { Plus } from "@phosphor-icons/react/dist/ssr/Plus"
import { api } from "@/utils/api"
import { generateUniqueId } from "@/utils/uuid"
import { Package } from "@/server/db/entities"
import toast from "react-hot-toast"
export function UnmanifestedPackagesModal({
  isOpen,
  onClose,
  shipmentId,
  currentUserId,
}: {
  isOpen: boolean
  onClose: () => void
  shipmentId: number
  currentUserId: string
}) {
  const [numberRows, setNumberRows] = useState(1)
  const [choosenProvince, setChoosenProvince] = useState<string>("")
  const [choosenCity, setChoosenCity] = useState<string>("")
  const [choosenBarangay, setChoosenBarangay] = useState<string>("")
  const [shippingMode, setShippingMode] = useState<"AIR" | "SEA">("SEA")
  const [shippingType, setShippingType] = useState<"STANDARD" | "EXPRESS">(
    "STANDARD",
  )
  const [receptionMode, setReceptionMode] = useState<
    "DOOR_TO_DOOR" | "FOR_PICKUP"
  >("DOOR_TO_DOOR")
  const [fragile, setFragile] = useState<boolean>(true)

  const { data: provinces } = api.addressPicker.getAllProvinces.useQuery()

  const { data: cities } = api.addressPicker.getAllCitiesByProvinceId.useQuery({
    provinceId: choosenProvince!,
  })

  const { data: barangays } = api.addressPicker.getAllBarangayByCityId.useQuery(
    {
      cityId: choosenCity!,
    },
  )
  const { data: agentId } = api.shipment.getSentAgentIdByShipmentId.useQuery({
    id: shipmentId,
  })

  const [newPackage, setNewPackage] = useState({
    sentByAgentId: "",
    preassignedId: "",
    shippingMode: "AIR",
    shippingType: "STANDARD",
    receptionMode: "FOR_PICKUP",
    weightInKg: 0,
    volumeInCubicMeter: 0,
    senderFullName: "",
    senderContactNumber: "",
    senderEmailAddress: "",
    senderStreetAddress: "",
    senderCity: "",
    senderStateOrProvince: "",
    senderCountryCode: "",
    senderPostalCode: 0,
    receiverFullName: "",
    receiverContactNumber: "",
    receiverEmailAddress: "",
    receiverStreetAddress: "",
    receiverBarangay: "",
    receiverCity: "",
    receiverStateOrProvince: "",
    receiverCountryCode: "PH",
    receiverPostalCode: 0,
    isFragile: "",
    declaredValue: 0,
  })
  const utils = api.useUtils()
  const { isLoading, mutate } =
    api.shipment.incoming.createIndividual.useMutation({
      onSuccess: () => {
        utils.package.getIncomingStatusByShipmentId.invalidate()
        onClose()
        setNewPackage({
          sentByAgentId: "",
          preassignedId: "",
          shippingMode: "AIR",
          shippingType: "STANDARD",
          receptionMode: "FOR_PICKUP",
          weightInKg: 0,
          volumeInCubicMeter: 0,
          senderFullName: "",
          senderContactNumber: "",
          senderEmailAddress: "",
          senderStreetAddress: "",
          senderCity: "",
          senderStateOrProvince: "",
          senderCountryCode: "",
          senderPostalCode: 0,
          receiverFullName: "",
          receiverContactNumber: "",
          receiverEmailAddress: "",
          receiverStreetAddress: "",
          receiverBarangay: "",
          receiverCity: "",
          receiverStateOrProvince: "",
          receiverCountryCode: "PH",
          receiverPostalCode: 0,
          isFragile: "",
          declaredValue: 0,
        })
        toast.success("Unmanifested package added successfully!")
      },
    })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setNewPackage((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target
    setNewPackage((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (
      !newPackage.senderEmailAddress.includes("@gmail.com") ||
      !newPackage.receiverEmailAddress.includes("@gmail.com")
    ) {
      toast.error("email should be gmail.com")
    } else {
      mutate({
        currentUserId: currentUserId,
        shipmentId: shipmentId,
        sentByAgentId: agentId!,
        preassignedId: newPackage.preassignedId,
        shippingMode: shippingMode,
        shippingType: shippingType,
        receptionMode: receptionMode,
        weightInKg: parseInt(newPackage.weightInKg.toString()),
        volumeInCubicMeter: parseInt(newPackage.volumeInCubicMeter.toString()),
        senderFullName: newPackage.senderFullName,
        senderContactNumber: newPackage.senderContactNumber,
        senderEmailAddress: newPackage.senderEmailAddress,
        senderStreetAddress: newPackage.senderStreetAddress,
        senderCity: newPackage.senderCity,
        senderStateOrProvince: newPackage.senderStateOrProvince,
        senderCountryCode: newPackage.senderCountryCode,
        senderPostalCode: parseInt(newPackage.senderPostalCode.toString()),
        receiverFullName: newPackage.receiverFullName,
        receiverContactNumber: newPackage.receiverContactNumber,
        receiverEmailAddress: newPackage.receiverEmailAddress,
        receiverStreetAddress: newPackage.receiverStreetAddress,
        receiverBarangay: choosenBarangay,
        receiverCity: choosenCity,
        receiverStateOrProvince: choosenProvince,
        receiverCountryCode: newPackage.receiverCountryCode,
        receiverPostalCode: parseInt(newPackage.receiverPostalCode.toString()),
        isFragile: fragile,
        declaredValue: parseInt(newPackage.declaredValue.toString()),
      })
    }

    console.log(newPackage)
  }

  useEffect(() => {
    setChoosenCity("")
  }, [choosenProvince])

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="bg-black/40 fixed inset-0"
          onClick={onClose}
        />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="fixed pb-7 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_70rem)] h-[min(calc(100%_-_3rem),_50rem)]  grid grid-rows-[auto_1fr] bg-white rounded-2xl"
        >
          <Dialog.Title className="text-white font-bold px-4 py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            <span className="inline-flex items-center gap-3">
              Add Unmanifested Package
            </span>
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="px-4 overflow-auto">
            <div>
              <div className="py-3 font-semibold"></div>

              <div>
                {/* General Info */}
                <section style={{ marginBottom: "30px" }}>
                  <span className="text-lg font-semibold	">
                    General Information
                  </span>
                  <div className="	flex flex-wrap	 gap-3">
                    <div className="flex flex-col">
                      <label className="text-sm	">Received Number</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.preassignedId}
                        name={"preassignedId"}
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Received No."
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Shipping Mode</label>
                      <select
                        onChange={(e) => {
                          setShippingMode(
                            e.currentTarget.value === "AIR" ? "AIR" : "SEA",
                          )
                        }}
                        value={shippingMode}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                      >
                        <option value={"SEA"}>SEA</option>
                        <option value={"AIR"}>AIR</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Shipping Type</label>
                      <select
                        onChange={(e) => {
                          setShippingType(
                            e.currentTarget.value === "STANDARD"
                              ? "STANDARD"
                              : "EXPRESS",
                          )
                        }}
                        value={shippingType}
                        name={"shippingType"}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                      >
                        <option value={"STANDARD"}>STANDARD</option>
                        <option value={"EXPRESS"}>EXPRESS</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Reception Mode</label>
                      <select
                        onChange={(e) => {
                          setReceptionMode(
                            e.currentTarget.value === "DOOR_TO_DOOR"
                              ? "DOOR_TO_DOOR"
                              : "FOR_PICKUP",
                          )
                        }}
                        value={receptionMode}
                        name={"receptionMode"}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                      >
                        <option value={"DOOR_TO_DOOR"}>DOOR TO DOOR</option>
                        <option value={"FOR_PICKUP"}>PICK UP</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm	">Weight in Kg</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.weightInKg}
                        name={"weightInKg"}
                        required
                        type="number"
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Weight in Kg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Dimensions in m³</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.volumeInCubicMeter}
                        name={"volumeInCubicMeter"}
                        required
                        type="number"
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Dimensions in m³"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Fragile?</label>
                      <select
                        onChange={(e) => {
                          setFragile(
                            e.currentTarget.value === "yes" ? true : false,
                          )
                          handleSelectChange
                        }}
                        value={`${fragile ? "yes" : "no"}`}
                        name={"isFragile"}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                      >
                        <option value="no">NO</option>
                        <option value="yes">YES</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Declared Value</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.declaredValue}
                        name={"declaredValue"}
                        required
                        type="number"
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Declared Value"
                      />
                    </div>
                  </div>
                </section>
                {/* Sender Info */}
                <section style={{ marginBottom: "30px" }}>
                  <span className="text-lg font-semibold	">
                    Sender Information
                  </span>
                  <div className="	flex flex-wrap	 gap-3">
                    <div className="flex flex-col">
                      <label className="text-sm	">Sender Fullname</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.senderFullName}
                        name={"senderFullName"}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Sender Fullname"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Sender Contact No.</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.senderContactNumber}
                        name={"senderContactNumber"}
                        required
                        type="tel"
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Sender Contact"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Sender Email</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.senderEmailAddress}
                        name={"senderEmailAddress"}
                        required
                        type="email"
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Sender Email"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Sender Street Address</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.senderStreetAddress}
                        name={"senderStreetAddress"}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Sender Street Address"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Sender State/Province</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.senderStateOrProvince}
                        name={"senderStateOrProvince"}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Sender State/Province"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Sender City</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.senderCity}
                        name={"senderCity"}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Sender City"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm	">Sender Country Code</label>
                      <input
                        maxLength={3}
                        type="text"
                        onChange={handleInputChange}
                        value={newPackage.senderCountryCode}
                        name={"senderCountryCode"}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md"
                        placeholder="Sender Country Code"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Sender Postal Code</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.senderPostalCode}
                        name={"senderPostalCode"}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Sender Postal Code"
                      />
                    </div>
                  </div>
                </section>
                {/* Reciever Info */}
                <section>
                  <span className="text-lg font-semibold	">
                    Receiver Information
                  </span>
                  <div className="	flex flex-wrap	 gap-3">
                    <div className="flex flex-col">
                      <label className="text-sm	">Receiver Fullname</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.receiverFullName}
                        name={"receiverFullName"}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Receiver Fullname"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Receiver Contact No.</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.receiverContactNumber}
                        name={"receiverContactNumber"}
                        required
                        type="tel"
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Receiver Contact"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Receiver Email</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.receiverEmailAddress}
                        name={"receiverEmailAddress"}
                        required
                        type="email"
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Receiver Email"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Receiver Street Address</label>
                      <input
                        onChange={handleInputChange}
                        value={newPackage.receiverStreetAddress}
                        name={"receiverStreetAddress"}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Receiver Street Address"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Receiver State/Province</label>

                      <select
                        value={choosenProvince}
                        name={"receiverStateOrProvince"}
                        onChange={(e) => {
                          if (e.currentTarget.value !== undefined) {
                            setChoosenProvince(e.currentTarget.value)
                            handleSelectChange
                          }
                        }}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                      >
                        {provinces?.map((province) => (
                          <option value={province.provinceId} key={province.id}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Receiver City</label>
                      <select
                        value={choosenCity}
                        name={"receiverCity"}
                        onChange={(e) => {
                          if (e.currentTarget.value !== undefined) {
                            setChoosenCity(e.currentTarget.value)
                            handleSelectChange
                          }
                        }}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                      >
                        {cities !== undefined ? (
                          <>
                            {cities.length > 0 ? (
                              <>
                                {cities.map((city) => (
                                  <option value={city.cityId} key={city.id}>
                                    {city.name}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Receiver Barangay</label>
                      <select
                        value={choosenBarangay}
                        name={"receiverBarangay"}
                        onChange={(e) => {
                          if (e.currentTarget.value !== undefined) {
                            setChoosenBarangay(e.currentTarget.value)
                            handleSelectChange
                          }
                        }}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                      >
                        {barangays !== undefined ? (
                          <>
                            {barangays.length > 0 ? (
                              <>
                                {barangays.map((barangay) => (
                                  <option
                                    value={barangay.code}
                                    key={barangay.id}
                                  >
                                    {barangay.name}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm	">Receiver Country Code</label>
                      <input
                        value={newPackage.receiverCountryCode}
                        name={"receiverCountryCode"}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Receiver Country Code"
                        disabled
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm	">Receiver Postal Code</label>
                      <input
                        value={newPackage.receiverPostalCode}
                        name={"receiverPostalCode"}
                        onChange={handleInputChange}
                        required
                        className="px-1 py-2 border border-gray-700	rounded-md	"
                        placeholder="Receiver Postal Code"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div className="flex justify-between mt-3 px-5 ">
              <Dialog.Close asChild>
                <button
                  onClick={onClose}
                  className="px-3 py-2 bg-[#DD4762] text-white	rounded-md	cursor-pointer	"
                >
                  Close
                </button>
              </Dialog.Close>
              <input
                disabled={isLoading}
                onClick={() => {}}
                className="px-3 py-2 bg-[#3DE074] text-white	rounded-md	cursor-pointer	"
                type="submit"
                value={`${isLoading ? "Loading..." : "Add Package"}`}
              />
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              type="button"
              className="text-white absolute top-3 right-3"
              onClick={onClose}
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

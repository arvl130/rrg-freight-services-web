import React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import type { Package } from "@/server/db/entities"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
export function MissingPackagesModal({
  isOpen,
  onClose,
  shipmentId,
  currentUserId,
  packages,
}: {
  isOpen: boolean
  onClose: () => void
  shipmentId: number
  currentUserId: string
  packages: Package[]
}) {
  //   api.shipment.package.tagAsMissingByShipmentId.useMutation({
  //     onSuccess: () => {
  //       utils.package.getIncomingStatusByShipmentId.invalidate({
  //         shipmentId,
  //       })
  //       utils.package.getCountWithLatestStatusByShipmentId.invalidate()

  //     },
  //     onError: (error) => {
  //       toast.error(error.message)
  //     },
  //   })
  const utils = api.useUtils()
  const { isPending, mutate } =
    api.package.tagAsMissingByShipmentId.useMutation({
      onSuccess: () => {
        utils.package.getIncomingStatusByShipmentId.invalidate()
        onClose()
        toast.success("Packages Successfully tagged as missing")
      },
    })

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="bg-black/40 fixed inset-0"
          onClick={onClose}
        />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="fixed pb-7 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_25rem)] h-[min(calc(100%_-_3rem),_30rem)]  grid grid-rows-[auto_1fr] bg-white rounded-2xl"
        >
          <Dialog.Title className="text-white font-bold px-4 py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            <span className="inline-flex items-center gap-3">
              Tag Unscanned as Missing
            </span>
          </Dialog.Title>
          <div className="px-4 overflow-auto">
            <div className="py-5 font-semibold">
              Are you sure you want to mark package/s as missing?
            </div>
            <div className="">
              {packages?.map((_package) => (
                <div key={_package.id} className="text-sm py-2">
                  <div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Package ID: </div>
                      <div className="col-span-3">{_package.id}</div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Sender: </div>
                      <div className="col-span-3">
                        {_package.senderFullName}
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Receiver: </div>
                      <div className="col-span-3">
                        {_package.receiverFullName}
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">address:</div>
                      <div className="col-span-3">
                        <p>
                          {_package.receiverStreetAddress},{" "}
                          {_package.receiverBarangay}, {_package.receiverCity}
                        </p>
                        <p>
                          {_package.receiverStateOrProvince}{" "}
                          {_package.receiverPostalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
              //   disabled={isPending}

              onClick={() => {
                mutate({
                  misingPackages: packages.map((_package) => ({
                    packageId: _package.id,
                    shipmentId: shipmentId,
                    preassignedId: _package.preassignedId,
                    shippingMode: _package.shippingMode,
                    shippingType: _package.shippingType,

                    weightInKg: _package.weightInKg,
                    volumeInCubicMeter: _package.volumeInCubicMeter,
                    senderFullName: _package.senderFullName,
                    senderContactNumber: _package.senderContactNumber,
                    senderEmailAddress: _package.senderEmailAddress,
                    senderStreetAddress: _package.senderStreetAddress,
                    senderCity: _package.senderCity,
                    senderStateOrProvince: _package.senderStateOrProvince,

                    senderCountryCode: _package.senderCountryCode,
                    senderPostalCode: _package.senderPostalCode,
                    receiverFullName: _package.receiverFullName,
                    receiverContactNumber: _package.receiverContactNumber,
                    receiverEmailAddress: _package.receiverEmailAddress,
                    receiverStreetAddress: _package.receiverStreetAddress,
                    receiverBarangay: _package.receiverBarangay,
                    receiverCity: _package.receiverCity,
                    receiverStateOrProvince: _package.receiverStateOrProvince,

                    receiverCountryCode: _package.receiverCountryCode,
                    receiverPostalCode: _package.receiverPostalCode,

                    createdAt: _package.createdAt,
                    createdById: _package.createdById,

                    isFragile: _package.isFragile,

                    sentByAgentId: _package.sentByAgentId,
                  })),
                })
              }}
              disabled={isPending}
              className="px-3 py-2 bg-[#3DE074] text-white	rounded-md	cursor-pointer	"
              type="submit"
              value={`${isPending ? "Loading..." : "Tag Missing"}`}
              //   value={"Tag as Missing"}
            />
          </div>
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

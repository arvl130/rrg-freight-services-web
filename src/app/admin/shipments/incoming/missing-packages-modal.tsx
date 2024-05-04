import * as Dialog from "@radix-ui/react-dialog"
import { X } from "@phosphor-icons/react/dist/ssr/X"

import { api } from "@/utils/api"

export function MissingPackagesModal({
  shipmentId,
  isOpen,
  onClose,
}: {
  shipmentId: number
  isOpen: boolean
  onClose: () => void
}) {
  const {
    status,
    data: missingPackages,
    error,
  } = api.package.getMissingPackagesByShipmentId.useQuery({
    shipmentId,
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
          className="fixed pb-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] h-[min(calc(100%_-_3rem),_50rem)]  grid grid-rows-[auto_1fr] bg-white rounded-2xl"
        >
          <Dialog.Title className="text-white font-bold px-4 py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            <span className="inline-flex items-center gap-3">
              Missing Packages - Shipment ID #{shipmentId}
            </span>
          </Dialog.Title>
          <div className="px-4 overflow-auto">
            <div className="">
              {missingPackages?.length === 0 ? (
                <div className="py-6 text-center">
                  No Missing Packages Found.
                </div>
              ) : (
                <div className="py-6">
                  {missingPackages?.map((_package) => (
                    <div key={_package.id} className="text-sm py-2">
                      <div>
                        <div className="grid grid-cols-4">
                          <div className="font-semibold ">Package ID: </div>
                          <div className="col-span-3">{_package.packageId}</div>
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
                          <div className="font-semibold ">Address:</div>
                          <div className="col-span-3">
                            <p>
                              {_package.receiverStreetAddress},{" "}
                              {_package.receiverBarangay},{" "}
                              {_package.receiverCity}
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
              )}
            </div>
          </div>
          <div className="flex justify-between mt-3 px-5 ">
            <Dialog.Close asChild>
              <button onClick={onClose} className="Button green">
                Close
              </button>
            </Dialog.Close>
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

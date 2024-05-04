import * as Dialog from "@radix-ui/react-dialog"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple"
import { api } from "@/utils/api"

export function ViewWaybillsModal({
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
    data: packages,
    error,
  } = api.package.getWithLatestStatusByShipmentId.useQuery({
    shipmentId,
  })
  const { data: missingPackages } =
    api.package.getMissingPackagesByShipmentId.useQuery({
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
              View Report of Shipment - #{shipmentId}
            </span>
          </Dialog.Title>
          <div className="px-4 overflow-auto">
            <div className="">
              <div className="py-5 ">
                <div className="grid grid-cols-2">
                  <div className="font-semibold">Received:</div>
                  <div>{packages?.length}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="font-semibold">Missing:</div>
                  <div>{missingPackages?.length}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="font-semibold">Unmanifested:</div>
                  <div>
                    {
                      packages?.filter(
                        (_package) => _package.isUnmanifested === 1,
                      ).length
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="font-bold text-xl">Received Packages</div>
            {packages?.filter((_package) => _package.isUnmanifested !== 1)
              .length === 0 && <div>No Received Packages</div>}
            {packages
              ?.filter((_package) => _package.isUnmanifested !== 1)
              .map((manifestedPackage) => (
                <div key={manifestedPackage.id} className="text-sm py-2">
                  <div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Assigned ID: </div>
                      <div className="col-span-3">
                        {manifestedPackage.preassignedId}
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Package ID: </div>
                      <div className="col-span-3">{manifestedPackage.id}</div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Sender: </div>
                      <div className="col-span-3">
                        {manifestedPackage.senderFullName}
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Receiver: </div>
                      <div className="col-span-3">
                        {manifestedPackage.receiverFullName}
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Address:</div>
                      <div className="col-span-3">
                        <p>
                          {manifestedPackage.receiverStreetAddress},{" "}
                          {manifestedPackage.receiverBarangay},{" "}
                          {manifestedPackage.receiverCity}
                        </p>
                        <p>
                          {manifestedPackage.receiverStateOrProvince}{" "}
                          {manifestedPackage.receiverPostalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {packages?.filter((_package) => _package.isUnmanifested === 1)
              .length !== 0 && (
              <div className="font-bold text-xl">Unmanifested Packages</div>
            )}

            {packages
              ?.filter((_package) => _package.isUnmanifested === 1)
              .map((unmanifestedPackage) => (
                <div key={unmanifestedPackage.id} className="text-sm py-2">
                  <div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Assigned ID: </div>
                      <div className="col-span-3">
                        {unmanifestedPackage.preassignedId}
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Package ID: </div>
                      <div className="col-span-3">{unmanifestedPackage.id}</div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Sender: </div>
                      <div className="col-span-3">
                        {unmanifestedPackage.senderFullName}
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Receiver: </div>
                      <div className="col-span-3">
                        {unmanifestedPackage.receiverFullName}
                      </div>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="font-semibold ">Address:</div>
                      <div className="col-span-3">
                        <p>
                          {unmanifestedPackage.receiverStreetAddress},{" "}
                          {unmanifestedPackage.receiverBarangay},{" "}
                          {unmanifestedPackage.receiverCity}
                        </p>
                        <p>
                          {unmanifestedPackage.receiverStateOrProvince}{" "}
                          {unmanifestedPackage.receiverPostalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {missingPackages?.length !== 0 && (
              <div className="font-bold text-xl">Missing Packages</div>
            )}
            {missingPackages?.map((missingPackage) => (
              <div key={missingPackage.id} className="text-sm py-2">
                <div>
                  <div className="grid grid-cols-4">
                    <div className="font-semibold ">Assigned ID: </div>
                    <div className="col-span-3">
                      {missingPackage.preassignedId}
                    </div>
                  </div>

                  <div className="grid grid-cols-4">
                    <div className="font-semibold ">Sender: </div>
                    <div className="col-span-3">
                      {missingPackage.senderFullName}
                    </div>
                  </div>
                  <div className="grid grid-cols-4">
                    <div className="font-semibold ">Receiver: </div>
                    <div className="col-span-3">
                      {missingPackage.receiverFullName}
                    </div>
                  </div>
                  <div className="grid grid-cols-4">
                    <div className="font-semibold ">Address:</div>
                    <div className="col-span-3">
                      <p>
                        {missingPackage.receiverStreetAddress},{" "}
                        {missingPackage.receiverBarangay},{" "}
                        {missingPackage.receiverCity}
                      </p>
                      <p>
                        {missingPackage.receiverStateOrProvince}{" "}
                        {missingPackage.receiverPostalCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

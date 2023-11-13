import * as Dialog from "@radix-ui/react-dialog"
import { Shipment } from "@/server/db/entities"
import { api } from "@/utils/api"
import { getColorFromPackageStatus } from "@/utils/colors"
import { X } from "@phosphor-icons/react/X"

export function ShipmentsViewDetailsModal({
  shipment,
  isOpen,
  close,
}: {
  shipment: Shipment
  isOpen: boolean
  close: () => void
}) {
  const {
    status,
    data: packages,
    error,
  } = api.package.getWithLatestStatusByShipmentId.useQuery({
    shipmentId: shipment.id,
  })

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_2rem),_30rem)] min-h-[24rem] bg-gray-100 outline-none"
        >
          <Dialog.Title className="[background-color:_#78CFDC] px-4 py-2 text-white flex justify-between">
            <span className="font-semibold">Shipment - #{shipment.id}</span>
            <button
              type="button"
              className="flex items-center justify-center"
              onClick={() => close()}
            >
              <X size={20} />
            </button>
          </Dialog.Title>
          {status === "loading" && <div>Hello, world!</div>}
          {status === "error" && <div>An error occured: {error.message}</div>}
          {status === "success" && (
            <div>
              {packages.map((_package) => (
                <div
                  key={_package.id}
                  className="grid grid-cols-[1rem_1fr] text-sm"
                >
                  <div
                    className={getColorFromPackageStatus(_package.status)}
                  ></div>
                  <dl className="grid grid-cols-[8rem_1fr] px-4 py-2">
                    <dt className="font-medium">Package ID: </dt>
                    <dd>{_package.id}</dd>
                    <dt className="font-medium flex items-center">Status:</dt>
                    <dd>
                      <span
                        className={`inline-block px-4 py-1 text-white rounded-full ${getColorFromPackageStatus(
                          _package.status,
                        )}`}
                      >
                        {_package.status}
                      </span>
                    </dd>
                    <dt className="font-medium">Sender Name:</dt>
                    <dd>{_package.senderFullName}</dd>
                    <dt className="font-medium">Receiver Name:</dt>
                    <dd>{_package.receiverFullName}</dd>
                    <dt className="font-medium">Receiver Address:</dt>
                    <dd>
                      <p>
                        {_package.receiverStreetAddress},{" "}
                        {_package.receiverBarangay}, {_package.receiverCity}{" "}
                      </p>
                      <p>
                        {_package.receiverStateOrProvince},{" "}
                        {_package.receiverCountryCode},{" "}
                        {_package.receiverPostalCode}{" "}
                      </p>
                    </dd>
                  </dl>
                </div>
              ))}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

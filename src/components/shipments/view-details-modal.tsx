import * as Dialog from "@radix-ui/react-dialog"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { ArrowsClockwise } from "@phosphor-icons/react/dist/ssr/ArrowsClockwise"
import { api } from "@/utils/api"
import { getColorFromPackageStatus } from "@/utils/colors"
import { getHumanizedOfPackageStatus } from "@/utils/humanize"

export function ViewDetailsModal({
  shipmentId,
  isOpen,
  close,
}: {
  shipmentId: number
  isOpen: boolean
  close: () => void
}) {
  const {
    status,
    data: packages,
    error,
    refetch,
    isRefetching,
  } = api.package.getWithLatestStatusByShipmentId.useQuery({
    shipmentId,
  })

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" onClick={close} />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] h-[min(calc(100%_-_3rem),_40rem)] grid grid-rows-[auto_1fr] bg-white rounded-2xl"
        >
          <Dialog.Title className="text-white font-bold px-4 py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            <span className="inline-flex items-center gap-3">
              Shipment - #{shipmentId}
              <button
                type="button"
                disabled={isRefetching}
                className="disabled:opacity-70"
                onClick={() => refetch()}
              >
                <ArrowsClockwise
                  size={20}
                  className={` ${isRefetching ? "animate-spin" : ""}`}
                />
              </button>
            </span>
          </Dialog.Title>
          {status === "pending" && <div>loading ...</div>}
          {status === "error" && <div>An error occured: {error.message}</div>}

          {status === "success" && (
            <>
              {packages.length !== 0 ? (
                <div className="overflow-auto">
                  {packages.map((_package) => (
                    <div
                      key={_package.id}
                      className="bg-gray-100 grid grid-cols-[1rem_1fr] text-sm"
                    >
                      <div
                        className={`${getColorFromPackageStatus(
                          _package.status,
                        )}`}
                      />
                      <div className="border-b border-gray-300 px-3 py-1">
                        <div className="grid grid-cols-[6rem_1fr]">
                          <div className="font-semibold">Package ID:</div>
                          <div>{_package.id}</div>
                        </div>
                        <div className="grid grid-cols-[6rem_1fr]">
                          <div className="font-semibold">Status:</div>
                          <div>
                            <span
                              className={`inline-block text-white px-2 rounded-full ${getColorFromPackageStatus(
                                _package.status,
                              )}`}
                            >
                              {getHumanizedOfPackageStatus(_package.status)}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-[6rem_1fr]">
                          <div className="font-semibold">Sender:</div>
                          <div>{_package.senderFullName}</div>
                        </div>
                        <div className="grid grid-cols-[6rem_1fr]">
                          <div className="font-semibold">Receiver:</div>
                          <div>{_package.receiverFullName}</div>
                        </div>
                        <div className="grid grid-cols-[6rem_1fr]">
                          <div className="font-semibold">Address:</div>
                          <div>
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
              ) : (
                <div className="text-center py-5">No Packages Found.</div>
              )}
            </>
          )}

          <div className=" mt-2 px-5">
            <Dialog.Close asChild>
              <button className="mb-3" onClick={close}>
                Close
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              className="text-white absolute top-3 right-3"
              onClick={close}
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

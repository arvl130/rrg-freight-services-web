import * as Dialog from "@radix-ui/react-dialog"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple"
import { ArrowsClockwise } from "@phosphor-icons/react/dist/ssr/ArrowsClockwise"
import { api } from "@/utils/api"
import { getColorFromPackageStatus } from "@/utils/colors"
import { supportedPackageStatusToHumanized } from "@/utils/humanize"
import { PDFDownloadLink } from "@react-pdf/renderer"
import WaybillsPdf from "./pdf-waybills"

export function ViewWaybillsModal({
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
          className="fixed pb-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] h-[min(calc(100%_-_3rem),_50rem)]  grid grid-rows-[auto_1fr] bg-white rounded-2xl"
        >
          <Dialog.Title className="text-white font-bold px-4 py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            <span className="inline-flex items-center gap-3">
              Print Waybills of Shipment - #{shipmentId}
              {/* <button
                type="button"
                disabled={isRefetching}
                className="disabled:opacity-70"
                onClick={() => refetch()}
              >
                <ArrowsClockwise
                  size={20}
                  className={` ${isRefetching ? "animate-spin" : ""}`}
                />
              </button> */}
            </span>
          </Dialog.Title>
          <div className="px-4 overflow-auto">
            <div className="py-5 font-semibold">
              Waybills will be generated for the following packages.
            </div>

            {status === "loading" && <div>loading ...</div>}
            {status === "error" && <div>An error occured: {error.message}</div>}
            {status === "success" && (
              <div className="">
                {packages.map((_package) => (
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
            )}
          </div>
          <div className="flex justify-between mt-3 px-5 ">
            <Dialog.Close asChild>
              <button onClick={close} className="Button green">
                Close
              </button>
            </Dialog.Close>
            {packages !== undefined ? (
              <PDFDownloadLink
                document={<WaybillsPdf package={packages} />}
                fileName={`RRG-SHIPMENT-ID-${shipmentId}.pdf`}
              >
                <button className="bg-green-600 px-4 py-1 rounded-lg text-white	flex">
                  <span className="mr-2">Download PDF</span>
                  <DownloadSimple size={20} />
                </button>
              </PDFDownloadLink>
            ) : (
              <></>
            )}
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

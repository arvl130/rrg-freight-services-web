import * as Dialog from "@radix-ui/react-dialog"
import Image from "next/image"
import { useRef } from "react"
import generatePDF, { Margin, Resolution } from "react-to-pdf"
import QRCode from "react-qr-code"
import { Package } from "@/server/db/entities"

export function PackagesViewWaybillModal({
  package: _package,
  isOpen,
  close,
}: {
  package: Package
  isOpen: boolean
  close: () => void
}) {
  const waybillRef = useRef<null | HTMLDivElement>(null)

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_2rem),_28rem)] rounded-lg bg-white"
        >
          <Dialog.Title className="[background-color:_#78CFDC] px-4 py-2 rounded-t-lg text-white font-semibold text-center">
            Waybill
          </Dialog.Title>
          <div className="px-4 pt-2">
            <div ref={waybillRef}>
              <div className="grid grid-cols-[100px_1fr_100px] pb-2">
                <Image
                  alt="RRG circle logo"
                  src="/assets/img/logos/logo-white-bg.png"
                  width={100}
                  height={100}
                  style={{ height: "100px", width: "100px" }}
                />
                <div className="flex items-center justify-center flex-col pb-4">
                  <p className="text-lg font-semibold leading-5">
                    RRG Freight Services
                  </p>
                  <p className="text-xs">North Fairview, Quezon City,</p>
                  <p className="text-xs leading-3">
                    Republic of the Philippines
                  </p>
                </div>
                <div className="w-full flex flex-col items-center">
                  <QRCode
                    value="hey"
                    size={256}
                    style={{ height: "80px", width: "80px" }}
                  />
                  <p className="text-xs">{_package.id}</p>
                </div>
              </div>
              <table className="border border-black w-full">
                <tr>
                  <th className="border border-black pb-4">Ship To</th>
                  <td className="border border-black px-2 pb-4" colSpan={3}>
                    <p className="text-xs font-semibold">
                      {_package.receiverFullName}
                    </p>
                    <p className="text-xs">
                      {_package.receiverStreetAddress}, Brgy.{" "}
                      {_package.receiverBarangay}, {_package.receiverCity},{" "}
                      {_package.receiverStateOrProvince},{" "}
                      {_package.receiverCountryCode}{" "}
                      {_package.receiverPostalCode}
                    </p>
                    <p className="text-xs">
                      <span className="font-semibold">Phone</span>{" "}
                      {_package.receiverContactNumber}
                    </p>
                    <p className="text-xs">
                      <span className="font-semibold">Email</span>{" "}
                      {_package.receiverEmailAddress}
                    </p>
                  </td>
                </tr>
                <tr>
                  <th className="border border-black pb-4">Shipped From</th>
                  <td className="border border-black px-2 pb-4" colSpan={3}>
                    <p className="text-xs font-semibold">
                      {_package.senderFullName}
                    </p>
                    <p className="text-xs">
                      {_package.senderStreetAddress}, {_package.senderCity}{" "}
                      {_package.senderStateOrProvince},{" "}
                      {_package.senderCountryCode} {_package.senderPostalCode}
                    </p>
                    <p className="text-xs">
                      <span className="font-semibold">Phone</span>{" "}
                      {_package.senderContactNumber}
                    </p>
                    <p className="text-xs">
                      <span className="font-semibold">Email</span>{" "}
                      {_package.senderEmailAddress}
                    </p>
                  </td>
                </tr>
                <tr>
                  <th className="border border-black pb-4">Parcel Info</th>
                  <td
                    className="border border-black text-center px-2 pb-4 text-sm"
                    colSpan={2}
                  >
                    <p className="font-semibold">Delivery Type</p>
                    <p className="capitalize">
                      {_package.shippingMode} -{" "}
                      {_package.shippingType.toLowerCase()}
                    </p>
                  </td>
                  <td className="text-center pb-4 text-sm">
                    {_package.receptionMode === "FOR_PICKUP"
                      ? "For Pickup"
                      : "Door to Door"}
                  </td>
                </tr>
                <tr>
                  <th className="border border-black pb-4">Package ID</th>
                  <td
                    className="border border-black text-center px-2 pb-4 text-sm"
                    colSpan={3}
                  >
                    {_package.id}
                  </td>
                </tr>
                <tr>
                  <th className="border border-black pb-4">Weight (KG)</th>
                  <td className="border border-black pb-4 text-center w-[80px]">
                    {_package.weightInKg}
                  </td>
                  <th className="border border-black pb-4">
                    Receiver
                    <br />
                    Signature
                  </th>
                  <td className="border border-black text-center px-2 pb-4 text-sm"></td>
                </tr>
              </table>
              <p className="text-center font-semibold py-2">
                RRG Freight Services
              </p>
            </div>
          </div>
          <div className="flex justify-between px-4 pb-2">
            <button
              type="button"
              className="font-medium"
              onClick={() =>
                generatePDF(waybillRef, {
                  canvas: {
                    mimeType: "image/png",
                    qualityRatio: 1,
                  },
                  resolution: Resolution.HIGH,
                  filename: `PACKAGE-WAYBILL-${_package.id}.pdf`,
                  page: {
                    margin: Margin.SMALL,
                    format: "a6",
                  },
                })
              }
            >
              Download
            </button>
            <Dialog.Close asChild>
              <button type="button" className="font-medium" onClick={close}>
                Close
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

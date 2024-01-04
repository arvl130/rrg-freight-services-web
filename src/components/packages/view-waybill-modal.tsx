import * as Dialog from "@radix-ui/react-dialog"
import Image from "next/image"
import { useRef, useState } from "react"
import generatePDF, { Margin } from "react-to-pdf"
import QRCode from "react-qr-code"
import { Package } from "@/server/db/entities"

export function ViewWaybillModal({
  package: _package,
  isOpen,
  close,
}: {
  package: Package
  isOpen: boolean
  close: () => void
}) {
  const [isGenerating, setIsGenerating] = useState(false)
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
                    value={_package.id.toString()}
                    size={256}
                    style={{ height: "100px", width: "100px" }}
                  />
                </div>
              </div>
              <table className="border border-black w-full mb-2">
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
                  <th className="border border-black pb-4">Package Info</th>
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
                    {_package.id.toString().padStart(4, "0")}
                  </td>
                </tr>
                <tr>
                  <th className="border border-black pb-4">Fragile?</th>
                  <td
                    className="border border-black text-center px-2 pb-4 text-sm"
                    colSpan={3}
                  >
                    {_package.isFragile === 1 ? "Yes" : "No"}
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
            </div>
          </div>
          <div className="flex justify-between px-4 pb-2">
            <button
              type="button"
              disabled={isGenerating}
              className="font-medium disabled:text-gray-500 transition-colors inline-flex gap-1.5"
              onClick={async () => {
                setIsGenerating(true)
                try {
                  await generatePDF(waybillRef, {
                    filename: `RRG-WAYBILL-${_package.id}.pdf`,
                    page: {
                      margin: Margin.SMALL,
                      format: "a6",
                    },
                  })
                } finally {
                  setIsGenerating(false)
                }
              }}
            >
              <span>Download</span>
              {isGenerating ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <></>
              )}
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

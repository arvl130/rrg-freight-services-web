import * as Dialog from "@radix-ui/react-dialog"
import QRCode from "react-qr-code"

export function ViewQrCodeModal({
  shipmentId,
  isOpen,
  close,
}: {
  shipmentId: number
  isOpen: boolean
  close: () => void
}) {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_2rem),_28rem)] rounded-lg bg-white"
        >
          <Dialog.Title className="[background-color:_#78CFDC] px-4 py-2 rounded-t-lg text-white font-semibold text-center">
            QR Code
          </Dialog.Title>
          <div className="flex flex-col justify-center items-center px-4 py-2">
            <p className="mb-3">Scan the QR Code below to start tracking:</p>
            <QRCode
              value={shipmentId.toString()}
              size={256}
              style={{ height: "16rem", width: "16rem" }}
            />
            <p className="font-semibold mt-1">Shipment ID {shipmentId}</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

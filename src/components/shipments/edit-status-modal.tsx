import * as Dialog from "@radix-ui/react-dialog"
import { Shipment } from "@/server/db/entities"

export function ShipmentsEditStatusModal({
  shipment,
  isOpen,
  close,
}: {
  shipment: Shipment
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
            Edit Status
          </Dialog.Title>
          <div>Hello, world!</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

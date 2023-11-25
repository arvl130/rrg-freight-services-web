import * as Dialog from "@radix-ui/react-dialog"
import { useEffect } from "react"

export function TransferShipmentsCreateModal({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: () => void
}) {
  useEffect(() => {
    if (!isOpen) {
    }
  }, [isOpen])

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_56rem)] h-[32rem] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            New Incoming Shipment
          </Dialog.Title>
          <div className="px-4 py-2 grid grid-rows-[auto_1fr]">wip</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

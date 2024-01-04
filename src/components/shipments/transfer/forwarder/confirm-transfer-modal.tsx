import { api } from "@/utils/api"
import * as Dialog from "@radix-ui/react-dialog"

export function ConfirmTransferModal({
  isOpen,
  close,
  transferShipmentId,
}: {
  isOpen: boolean
  close: () => void
  transferShipmentId: number
}) {
  const utils = api.useUtils()
  const { isLoading, mutate } =
    api.shipment.forwarderTransfer.confirmTransferById.useMutation({
      onSuccess: () => {
        utils.shipment.forwarderTransfer.getAll.invalidate()
        close()
      },
    })

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-rows-[auto_1fr] max-w-lg rounded-lg bg-white px-8 py-6"
        >
          <Dialog.Title className="font-medium pb-2 items-center h-full">
            Confirm Transfer
          </Dialog.Title>
          <div>
            <p className="mb-3">
              Are you sure you want confirm that this shipment has been
              received?
            </p>
            <div className="flex justify-between">
              <button
                type="button"
                className="border border-blue-500 hover:bg-blue-100 disabled:bg-blue-50 text-blue-500 px-4 py-2 rounded-md font-medium transition-colors"
                disabled={isLoading}
                onClick={() => close()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 px-4 py-2 rounded-md text-white transition-colors"
                disabled={isLoading}
                onClick={() =>
                  mutate({
                    id: transferShipmentId,
                  })
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

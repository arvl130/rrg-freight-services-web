import { api } from "@/utils/api"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import Image from "next/image"

function ConfirmTransferForm(props: {
  onClose: () => void
  shipmentId: number
  proofOfTransferImgUrl: string
}) {
  const utils = api.useUtils()
  const { isPending, mutate } =
    api.shipment.forwarderTransfer.confirmTransferById.useMutation({
      onSuccess: () => {
        utils.shipment.forwarderTransfer.getAll.invalidate()
        props.onClose()
      },
    })

  return (
    <div className="px-4 pt-2 pb-4">
      <p className="mb-3">
        Are you sure you want confirm that this shipment has been received?
      </p>
      <div className="mb-3 flex justify-center">
        <Image
          src={props.proofOfTransferImgUrl}
          alt="Photo taken as Proof of Transfer"
          width={320}
          height={180}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="bg-brand-cyan-500 text-white hover:bg-brand-cyan-600 disabled:bg-brand-cyan-350 px-4 py-2 rounded-md transition-colors font-medium"
          disabled={isPending}
          onClick={() =>
            mutate({
              id: props.shipmentId,
            })
          }
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

export function ConfirmTransferModal({
  isOpen,
  onClose,
  shipmentId,
  proofOfTransferImgUrl,
}: {
  isOpen: boolean
  onClose: () => void
  shipmentId: number
  proofOfTransferImgUrl: string
}) {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            Confirm Transfer
          </Dialog.Title>
          <ConfirmTransferForm
            shipmentId={shipmentId}
            proofOfTransferImgUrl={proofOfTransferImgUrl}
            onClose={onClose}
          />
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

import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { CreateWithRemoteFile } from "./create-with-remote-file"
import { CreateWithDragAndDrop } from "./create-with-dnd"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"

export function CreateModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newShipmentId: number) => void
}) {
  const [createWith, setCreateWith] = useState<"REMOTE_FILE" | "DND">(
    "REMOTE_FILE",
  )

  const { status, data, error } = api.uploadedManifest.getAll.useQuery()

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_72rem)] h-[calc(100svh_-_2.5rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white overflow-auto"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            New Incoming Shipment
          </Dialog.Title>
          {status === "loading" && (
            <div>
              <LoadingSpinner />
            </div>
          )}
          {status === "error" && <div>Error occured: {error.message}</div>}
          {status === "success" && (
            <>
              {createWith === "REMOTE_FILE" && (
                <CreateWithRemoteFile
                  uploadedManifests={data}
                  isOpen={isOpen}
                  onClose={onClose}
                  onSuccess={onSuccess}
                  onSwitchTab={(newTab) => {
                    setCreateWith(newTab)
                  }}
                />
              )}
              {createWith === "DND" && (
                <CreateWithDragAndDrop
                  isOpen={isOpen}
                  onClose={onClose}
                  onSuccess={onSuccess}
                  onSwitchTab={(newTab) => {
                    setCreateWith(newTab)
                  }}
                />
              )}
            </>
          )}
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

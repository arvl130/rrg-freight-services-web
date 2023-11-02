import { useEffect, useRef } from "react"
import { ShipmentsCreateManifestInformation } from "./create-manifest/create"

export function ShipmentsCreateManifest({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: () => void
}) {
  const modalRef = useRef<null | HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen) modalRef.current?.showModal()
    else {
      modalRef.current?.close()
    }
  }, [isOpen])

  return (
    <dialog
      ref={modalRef}
      onClose={close}
      className={`
        bg-white w-[min(100%,_64rem)] rounded-2xl h-[calc(100vh-_6rem)]
        ${isOpen ? "grid" : ""}
      `}
    >
      <div className="h-full grid">
        <ShipmentsCreateManifestInformation isOpenModal={isOpen} />
      </div>
    </dialog>
  )
}

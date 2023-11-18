import { useEffect, useRef, useState } from "react"
import { PackagesAddWizardInformation } from "./add-wizard/step1"
import { WorkBook } from "xlsx"
import { Package } from "@/server/db/entities"

export function PackagesAddWizard({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: () => void
}) {
  const modalRef = useRef<null | HTMLDialogElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsModalOpen(true)
      modalRef.current?.showModal()
    } else {
      setIsModalOpen(false)
      modalRef.current?.close()
    }
  }, [isOpen])

  return (
    <dialog
      ref={modalRef}
      onClose={close}
      className={`
        bg-white w-[min(100%,_64rem)] rounded-2xl h-[calc(100vh-_6rem)]
        ${isModalOpen ? "grid" : ""}
      `}
    >
      <div className="h-full grid">
        <PackagesAddWizardInformation
          isOpenModal={isModalOpen}
          close={() => close()}
        />
      </div>
    </dialog>
  )
}

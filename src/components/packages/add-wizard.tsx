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
        bg-white w-[min(100%,_64rem)] rounded-2xl h-[calc(100vh_-_6rem)]
        ${isOpen ? "grid" : ""}
      `}
    >
      <div className="h-full grid">
       
          <PackagesAddWizardInformation
            isOpenModal={isOpen}
          />

      </div>
    </dialog>
  )
}

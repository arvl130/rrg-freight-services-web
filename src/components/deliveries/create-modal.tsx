import { useEffect, useRef, useState } from "react"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { api } from "@/utils/api"
import { Package } from "@/server/db/entities"
import { useSession } from "@/utils/auth"

function ChooseDestinationPanel({
  isOpenModal,
  selectedDestinationHubId,
  onSelectChange,
}: {
  isOpenModal: boolean
  selectedDestinationHubId: null | number
  onSelectChange: (props: { destinationHubId: null | number }) => void
}) {
  const { role } = useSession()

  return (
    <div>
      <p className="font-medium text-gray-700 mb-1.5">Select a destination:</p>
      <div>wip</div>
    </div>
  )
}

function PackagesTableItem({
  selectedPackageIds,
  package: _package,
  onCheckboxChange,
}: {
  selectedPackageIds: number[]
  package: Package
  onCheckboxChange: ({
    isChecked,
  }: {
    isChecked: boolean
    packageId: number
  }) => void
}) {
  return (
    <div className="grid grid-cols-3 border-b border-gray-300 text-sm">
      <div className=" py-2 flex items-center gap-1">
        <input
          type="checkbox"
          checked={selectedPackageIds.includes(_package.id)}
          onChange={(e) =>
            onCheckboxChange({
              isChecked: e.currentTarget.checked,
              packageId: _package.id,
            })
          }
        />
        <span>{_package.id}</span>
      </div>
      <div className="py-2">
        <div>{_package.senderFullName}</div>
        <div>{_package.senderCountryCode}</div>
      </div>
      <div className="py-2">
        <div>{_package.receiverFullName}</div>
        <div>{_package.receiverCountryCode}</div>
      </div>
    </div>
  )
}

function ChoosePackageTable({
  selectedPackageIds,
  onSelectAll,
  onCheckboxChange,
}: {
  selectedPackageIds: number[]
  onSelectAll: (props: { isChecked: boolean; packageIds: number[] }) => void
  onCheckboxChange: (props: { isChecked: boolean; packageId: number }) => void
}) {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <p className="font-medium text-gray-700">Choose package to include:</p>
        <div className="flex justify-end">
          <div className="flex-col grid grid-cols-[1fr_2.25rem] h-[2.375rem] ml-2">
            <input
              type="text"
              className="rounded-l-lg px-3 border-l border-y border-brand-cyan-500 py-1.5 text-sm"
              placeholder="Search"
            />
            <button
              type="button"
              className="text-white bg-brand-cyan-500 flex justify-center items-center rounded-r-lg border-r border-y border-brand-cyan-500"
            >
              <MagnifyingGlass size={16} />
            </button>
          </div>
        </div>
      </div>
      <div>wip</div>
    </div>
  )
}

export function DeliveriesCreateModal({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: () => void
}) {
  const modalRef = useRef<null | HTMLDialogElement>(null)
  const [selectedDestinationHubId, setSelectedDestinationHubId] = useState<
    null | number
  >(null)
  const [selectedPackageIds, setSelectedPackageIds] = useState<number[]>([])

  return (
    <dialog
      ref={modalRef}
      onClose={close}
      className={`
        bg-white w-[min(100%,_64rem)] rounded-2xl h-[calc(100vh-_6rem)]
        ${isOpen ? "grid" : ""}
      `}
    >
      wip
    </dialog>
  )
}

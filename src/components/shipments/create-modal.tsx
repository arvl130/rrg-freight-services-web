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
  const {
    status,
    isLoading,
    isError,
    data: destinationHubs,
  } = api.shipmentHub.getDestinations.useQuery()

  useEffect(() => {
    if (
      !isOpenModal &&
      role === "OVERSEAS_AGENT" &&
      status === "success" &&
      destinationHubs.length > 0 &&
      selectedDestinationHubId === null
    ) {
      const [firstDestinationHub] = destinationHubs
      onSelectChange({
        destinationHubId: firstDestinationHub.id,
      })
    }
  }, [
    isOpenModal,
    role,
    status,
    destinationHubs,
    selectedDestinationHubId,
    onSelectChange,
  ])

  return (
    <div>
      <p className="font-medium text-gray-700 mb-1.5">Select a destination:</p>
      <div>
        {isLoading ? (
          <>Loading ...</>
        ) : (
          <>
            {isError ? (
              <>error :(</>
            ) : (
              <select
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg"
                value={
                  selectedDestinationHubId === null
                    ? ""
                    : selectedDestinationHubId
                }
                onChange={(e) => {
                  if (e.currentTarget.value === "")
                    onSelectChange({
                      destinationHubId: null,
                    })
                  else
                    onSelectChange({
                      destinationHubId: parseInt(e.currentTarget.value),
                    })
                }}
              >
                <option value="">
                  {/* If the user is an overseas agent, hint them to
                          select a destination. */}
                  {role === "OVERSEAS_AGENT"
                    ? "Select a destination ..."
                    : // Otherwise, an empty option just means we are delivering
                      // to the receiver.
                      "Receiver Address"}
                </option>
                {destinationHubs.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.displayName}
                  </option>
                ))}
              </select>
            )}
          </>
        )}
      </div>
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
  const {
    refetch,
    status,
    data: packages,
  } = api.package.getShippable.useQuery()

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
      <div>
        {status === "loading" && (
          <article className="bg-white rounded-lg px-6 py-3 drop-shadow-md h-80 text-center flex justify-center items-center">
            Loading ...
          </article>
        )}

        {status === "error" && (
          <article className="bg-white rounded-lg px-6 py-3 drop-shadow-md h-80 text-center flex flex-col justify-center items-center">
            <p className="mb-1">An error occured :(</p>
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </article>
        )}

        {status === "success" && (
          <article className="bg-white rounded-lg px-6 py-3 drop-shadow-md h-80">
            <div className="mb-2"></div>
            <div className="text-sm">
              <div className="grid grid-cols-3 font-bold mb-1">
                <div className=" py-2 flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={packages.length === selectedPackageIds.length}
                    onChange={(e) => {
                      onSelectAll({
                        isChecked: e.currentTarget.checked,
                        packageIds: packages.map((_package) => _package.id),
                      })
                    }}
                  />
                  <span>Product ID</span>
                </div>
                <div>Sender</div>
                <div>Receiver</div>
              </div>
              {packages.length === 0 ? (
                <p className="text-center">No packages available</p>
              ) : (
                <>
                  {packages.map((_package) => (
                    <PackagesTableItem
                      key={_package.id}
                      selectedPackageIds={selectedPackageIds}
                      package={_package}
                      onCheckboxChange={onCheckboxChange}
                    />
                  ))}
                </>
              )}
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

export function ShipmentsCreateModal({
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

  useEffect(() => {
    if (isOpen) modalRef.current?.showModal()
    else {
      if (selectedDestinationHubId !== null && selectedPackageIds.length > 0) {
        setSelectedDestinationHubId(null)
        setSelectedPackageIds([])
      }
      modalRef.current?.close()
    }
  }, [isOpen, selectedDestinationHubId, selectedPackageIds])

  const utils = api.useUtils()
  const { isLoading: isLoadingCreateShipment, mutate } =
    api.shipment.create.useMutation({
      onSuccess: () => {
        utils.package.getShippable.invalidate()
        utils.shipment.getAllWithOriginAndDestination.invalidate()
        close()
      },
    })

  const { role } = useSession()
  const isDisabled =
    // If our user is an Overseas Agent, then require a destination hub.
    role === "OVERSEAS_AGENT"
      ? selectedPackageIds.length === 0 ||
        selectedDestinationHubId === null ||
        isLoadingCreateShipment
      : // Otherwise, just ask for a list of package ids.
        selectedPackageIds.length === 0 || isLoadingCreateShipment

  return (
    <dialog
      ref={modalRef}
      onClose={close}
      className={`
        bg-white w-[min(100%,_64rem)] rounded-2xl h-[calc(100vh-_6rem)]
        ${isOpen ? "grid" : ""}
      `}
    >
      <form
        className="h-full grid grid-rows-[auto_1fr_auto] overflow-auto"
        onSubmit={(e) => {
          e.preventDefault()
          if (selectedDestinationHubId === null) return
          if (selectedPackageIds.length === 0) return

          const [first, ...others] = selectedPackageIds
          mutate({
            destinationHubId: selectedDestinationHubId,
            packageIds: [first, ...others],
          })
        }}
      >
        <div className="text-white font-bold text-center items-center py-4 [background-color:_#78CFDC] text-3xl">
          Create New Shipment
        </div>
        <div className="px-12 py-4 overflow-auto grid grid-cols-[12rem_1fr] gap-4">
          <ChooseDestinationPanel
            isOpenModal={isOpen}
            selectedDestinationHubId={selectedDestinationHubId}
            onSelectChange={({ destinationHubId }) =>
              setSelectedDestinationHubId(destinationHubId)
            }
          />
          <div>
            <ChoosePackageTable
              selectedPackageIds={selectedPackageIds}
              onSelectAll={({ isChecked, packageIds }) => {
                if (isChecked) {
                  setSelectedPackageIds(packageIds)
                } else {
                  setSelectedPackageIds([])
                }
              }}
              onCheckboxChange={({ isChecked, packageId }) => {
                if (isChecked)
                  setSelectedPackageIds((currSelectedPackageIds) => [
                    ...currSelectedPackageIds,
                    packageId,
                  ])
                else
                  setSelectedPackageIds((currSelectedPackageIds) =>
                    currSelectedPackageIds.filter(
                      (selectedPackageId) => selectedPackageId !== packageId,
                    ),
                  )
              }}
            />
          </div>
        </div>
        <div className="px-4 py-3 border-t border-gray-300 flex justify-end">
          <button
            type="button"
            className="px-6 py-2 text-white bg-[#D64D4D] rounded-md mr-4"
            onClick={() => close()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDisabled}
            className="px-6 py-2 text-white disabled:bg-green-300 bg-green-500 hover:bg-green-400 transition-colors rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </dialog>
  )
}

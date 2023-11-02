import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { api } from "@/utils/api"
import { Package } from "@/server/db/entities"

function Forms() {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="grid grid-cols-2 gap-3 mt-10 ml-6">
        <div className="col-span-1">
          <label className="text-lg font-medium text-gray-700">
            Shipment ID
          </label>
          <label className="ml-40 text-lg font-medium text-gray-700">
            Include a Package
          </label>

          <input
            type="text"
            id="shipmentID"
            name="shipmentID"
            value="12345"
            className="mt-2 p-2 block border bg-slate-200 rounded-md focus:ring-indigo-500 focus-border-indigo-500 shadow-sm"
            disabled
          />

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="notifyPeople"
              name="notifyPeople"
              className="h-4 w-4 text-green-500 border border-green-500 rounded focus:ring-green-500"
            />
            <label className="ml-2 text-lg text-gray-700">Notify People</label>
          </div>
        </div>

        <div className="col-span-1">
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
      </div>
    </div>
  )
}

function PackagesTableItem({
  package: _package,
  onCheckboxChange,
}: {
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

function DataTable() {
  const {
    isLoading: isLoadingPackages,
    isError: isErrorPackages,
    data: packages,
    refetch,
  } = api.package.getCanBeAddedToShipment.useQuery()
  const { isLoading: isLoadingCreateShipment, mutate } =
    api.shipment.create.useMutation({
      onSuccess: () => refetch(),
    })

  const [selectedPackageIds, setSelectedPackageIds] = useState<number[]>([])

  return (
    <div>
      {isLoadingPackages ? (
        <article className="bg-white rounded-lg px-6 ml-80 shadow-md h-[30rem]">
          Loading ...
        </article>
      ) : (
        <>
          {isErrorPackages ? (
            <article className="bg-white rounded-lg px-6 ml-80 shadow-md h-[30rem]">
              Error :(
            </article>
          ) : (
            <article className="bg-white rounded-lg px-6 ml-80 shadow-md h-[30rem]">
              <div className="mb-2"></div>
              <div className="text-sm">
                <div className="grid grid-cols-3 font-bold mb-1">
                  <div className=" py-2 flex items-center gap-1">
                    <input type="checkbox" />
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
                        package={_package}
                        onCheckboxChange={({ isChecked, packageId }) => {
                          if (isChecked) {
                            setSelectedPackageIds((currSelectedPackageIds) => [
                              ...currSelectedPackageIds,
                              packageId,
                            ])
                          } else {
                            setSelectedPackageIds((currSelectedPackageIds) =>
                              currSelectedPackageIds.filter(
                                (selectedPackageId) =>
                                  selectedPackageId !== packageId,
                              ),
                            )
                          }
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            </article>
          )}
        </>
      )}
      <form
        className="flex justify-end mt-4"
        onSubmit={(e) => {
          e.preventDefault()
          const [first, ...others] = selectedPackageIds
          mutate({
            // FIXME: Choose from a set of main RRG hubs using a for
            // instead of hardcoding a value.
            destinationHubId: 2,
            packageIds: [first, ...others],
          })
        }}
      >
        <button
          type="button"
          className="px-6 py-2 text-white bg-[#D64D4D] rounded-md mr-4"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={selectedPackageIds.length === 0 || isLoadingCreateShipment}
          className="px-6 py-2 text-white disabled:bg-green-300 bg-green-500 hover:bg-green-400 transition-colors rounded-md"
        >
          Save
        </button>
      </form>
    </div>
  )
}

export function ShipmentsCreateManifestInformation({
  isOpenModal,
}: {
  isOpenModal: boolean
}) {
  const { reset } = useForm()

  useEffect(() => {
    if (!isOpenModal) reset()
  }, [isOpenModal, reset])

  return (
    <div className="h-full grid grid-rows-[auto_1fr] grid-cols-[100%]">
      <div className="text-white font-bold text-center items-center py-4 [background-color:_#78CFDC] text-3xl">
        Create New Shipment
      </div>
      <div className="px-12 py-4 grid grid-rows-[auto_auto_1fr]">
        <Forms />
        <DataTable />
      </div>
    </div>
  )
}

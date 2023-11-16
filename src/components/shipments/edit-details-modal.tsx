import * as Dialog from "@radix-ui/react-dialog"
import { Package, Shipment } from "@/server/db/entities"
import { api } from "@/utils/api"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { REGEX_ONE_OR_MORE_DIGITS } from "@/utils/constants"

function PackageItem({
  package: _package,
  selectedIds,
  isOnlyItem,
  isLastItem,
  onItemChecked,
}: {
  package: Package
  selectedIds: number[]
  isOnlyItem: boolean
  isLastItem: boolean
  onItemChecked: (isChecked: boolean) => void
}) {
  return (
    <div
      className={`grid grid-cols-[1.5rem_repeat(3,_1fr)] ${
        isLastItem ? "border-x border-b" : "border"
      } border-gray-300 px-4 py-2`}
    >
      <div>
        <input
          type="checkbox"
          disabled={isOnlyItem}
          title={
            isOnlyItem
              ? "Item cannot be deleted as it is the only package in the shipment."
              : undefined
          }
          checked={selectedIds.includes(_package.id)}
          onChange={(e) => onItemChecked(e.currentTarget.checked)}
        />
      </div>
      <div>{_package.id}</div>
      <div>Receiver</div>
      <div>Sender</div>
    </div>
  )
}

const addPackageFormSchema = z.object({
  packageId: z.string().min(1).regex(REGEX_ONE_OR_MORE_DIGITS),
})

type AddPackageFormType = z.infer<typeof addPackageFormSchema>

function AddPackageForm({
  shipmentId,
  addedPackageIds,
}: {
  shipmentId: number
  addedPackageIds: number[]
}) {
  const apiUtils = api.useUtils()
  const { isLoading, mutate } = api.shipment.addPackageIdById.useMutation({
    onSuccess: () => {
      apiUtils.package.getByShipmentId.invalidate()
      reset()
    },
  })
  const { register, handleSubmit, watch, reset } = useForm<AddPackageFormType>({
    resolver: zodResolver(addPackageFormSchema),
  })

  return (
    <form
      className="grid grid-cols-[1fr_auto] gap-3 mb-3"
      onSubmit={handleSubmit((formData) =>
        // TODO: Add a warning before firing mutations, because editing
        // shipment packages can lead to inconsistent database state.
        mutate({
          id: shipmentId,
          packageId: Number(formData.packageId),
        }),
      )}
    >
      <input
        type="text"
        className="px-4 py-2 rounded-md border border-gray-300 w-full"
        placeholder="Enter a package ID ..."
        {...register("packageId")}
      />
      <button
        type="submit"
        disabled={
          isLoading || addedPackageIds.includes(Number(watch("packageId")))
        }
        className="bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 transition-colors text-white px-4 py-2 rounded-md"
      >
        Add
      </button>
    </form>
  )
}

export function ShipmentsEditDetailsModal({
  shipment,
  isOpen,
  close,
}: {
  shipment: Shipment
  isOpen: boolean
  close: () => void
}) {
  const {
    status,
    data: packages,
    error,
  } = api.package.getByShipmentId.useQuery({
    shipmentId: shipment.id,
  })
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const apiUtils = api.useUtils()
  const { isLoading, mutate } = api.shipment.removePackageIdsById.useMutation({
    onSuccess: () => {
      apiUtils.package.getByShipmentId.invalidate()
      setSelectedIds([])
    },
  })

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_2rem),_36rem)] h-[24rem] rounded-lg bg-white"
        >
          <Dialog.Title className="[background-color:_#78CFDC] px-4 py-2 rounded-t-lg text-white font-semibold text-center">
            Edit Details
          </Dialog.Title>
          {status === "loading" && (
            <div className="flex justify-center items-center">Loading ...</div>
          )}
          {status === "error" && (
            <div className="flex justify-center items-center">
              An error occured: {error.message}
            </div>
          )}
          {status === "success" && (
            <div className="px-4 py-2">
              <div>
                <AddPackageForm
                  shipmentId={shipment.id}
                  addedPackageIds={packages.map((_package) => _package.id)}
                />
                {packages.map((_package, index) => (
                  <PackageItem
                    key={_package.id}
                    package={_package}
                    selectedIds={selectedIds}
                    isOnlyItem={packages.length === 1}
                    isLastItem={
                      packages.length > 1 && index === packages.length - 1
                    }
                    onItemChecked={(isChecked) => {
                      if (isChecked)
                        setSelectedIds((currSelectedIds) => [
                          ...currSelectedIds,
                          _package.id,
                        ])
                      else
                        setSelectedIds((currSelectedIds) =>
                          currSelectedIds.filter(
                            (selectedId) => selectedId !== _package.id,
                          ),
                        )
                    }}
                  />
                ))}
              </div>
              {selectedIds.length > 0 && (
                <div className="mt-3">
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-400 disabled:bg-red-300 transition-colors text-white px-4 py-2 rounded-md"
                    disabled={
                      isLoading ||
                      (packages.length > 0 &&
                        selectedIds.length === packages.length)
                    }
                    onClick={() => {
                      const [first, ...other] = selectedIds

                      mutate({
                        id: shipment.id,
                        packageIds: [first, ...other],
                      })
                    }}
                  >
                    Remove Selected
                  </button>
                </div>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

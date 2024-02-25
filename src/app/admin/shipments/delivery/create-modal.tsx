import { useState } from "react"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass"
import type { Package, Vehicle } from "@/server/db/entities"
import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import type { PackageShippingType } from "@/utils/constants"
import {
  REGEX_ONE_OR_MORE_DIGITS,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
} from "@/utils/constants"
import { supportedShippingTypeToHumanized } from "@/utils/humanize"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"

function PackagesTableItem({
  selectedPackageIds,
  package: _package,
  onCheckboxChange,
}: {
  selectedPackageIds: string[]
  package: Package
  onCheckboxChange: ({
    isChecked,
  }: {
    isChecked: boolean
    packageId: string
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

function filterBySearchTerm(items: Package[], searchTerm: string) {
  return items.filter((_package) =>
    _package.id.toString().toLowerCase().includes(searchTerm.toLowerCase()),
  )
}

function ChoosePackageTable({
  selectedPackageIds,
  onSelectAll,
  onCheckboxChange,
  onResetSelection,
}: {
  selectedPackageIds: string[]
  onSelectAll: (props: { isChecked: boolean; packageIds: string[] }) => void
  onCheckboxChange: (props: { isChecked: boolean; packageId: string }) => void
  onResetSelection: () => void
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const {
    refetch,
    status,
    data: packages,
  } = api.package.getInWarehouseAndCanBeDelivered.useQuery()

  return (
    <div>
      <div className="flex justify-between mb-3">
        <p className="font-medium text-gray-700">Packages</p>
        <div className="flex justify-end">
          <div className="flex-col grid grid-cols-[1fr_2.25rem] h-[2.375rem] ml-2">
            <input
              type="text"
              className="rounded-l-lg px-3 border-l border-y border-brand-cyan-500 py-1.5 text-sm"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.currentTarget.value)
                onResetSelection()
              }}
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
          <article className="bg-white rounded-lg px-6 py-3 drop-shadow-md h-80 overflow-auto">
            <div className="mb-2"></div>
            <div className="text-sm overflow-auto">
              <div className="grid grid-cols-3 font-bold mb-1">
                <div className=" py-2 flex items-center gap-1">
                  {filterBySearchTerm(packages, searchTerm).length === 0 ? (
                    <input type="checkbox" disabled={true} checked={false} />
                  ) : (
                    <input
                      type="checkbox"
                      checked={
                        filterBySearchTerm(packages, searchTerm).length ===
                        selectedPackageIds.length
                      }
                      onChange={(e) => {
                        onSelectAll({
                          isChecked: e.currentTarget.checked,
                          packageIds: filterBySearchTerm(
                            packages,
                            searchTerm,
                          ).map((_package) => _package.id),
                        })
                      }}
                    />
                  )}
                  <span>Product ID</span>
                </div>
                <div>Sender</div>
                <div>Receiver</div>
              </div>
              {filterBySearchTerm(packages, searchTerm).length === 0 ? (
                <p className="text-center">No packages available</p>
              ) : (
                <>
                  {filterBySearchTerm(packages, searchTerm).map((_package) => (
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

const createDeliveryFormSchema = z.object({
  deliveryType: z.custom<PackageShippingType>((val) =>
    SUPPORTED_PACKAGE_SHIPPING_TYPES.includes(val as PackageShippingType),
  ),
  vehicleId: z.string().min(1).regex(REGEX_ONE_OR_MORE_DIGITS),
  driverId: z.string().length(28),
})

type CreateDeliveryFormType = z.infer<typeof createDeliveryFormSchema>

function CreateDeliveryForm({ close }: { close: () => void }) {
  const utils = api.useUtils()
  const { isLoading, mutate } = api.shipment.delivery.create.useMutation({
    onSuccess: () => {
      utils.shipment.delivery.getAll.invalidate()
      close()
      toast.success("Delivery Created")
    },
  })
  const {
    status: statusOfAvailableVehicles,
    data: availableVehicles,
    error: errorOfAvailableVehicles,
  } = api.vehicle.getAvailable.useQuery()

  const {
    status: statusOfAvailableDrivers,
    data: availableDrivers,
    error: errorOfAvailableDrivers,
  } = api.user.getAvailableDrivers.useQuery()

  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([])

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDeliveryFormType>({
    resolver: zodResolver(createDeliveryFormSchema),
    defaultValues: {
      deliveryType: "STANDARD",
    },
  })

  function filterByVehiclesDeliveryType(
    vehicles: Vehicle[],
    deliveryType: PackageShippingType,
  ) {
    return deliveryType === "EXPRESS"
      ? vehicles.filter((vehicle) => vehicle.isExpressAllowed)
      : vehicles
  }

  return (
    <form
      className="grid grid-rows-[1fr_auto] px-4 py-2"
      onSubmit={handleSubmit((formData) =>
        mutate({
          driverId: formData.driverId,
          vehicleId: Number(formData.vehicleId),
          isExpress: formData.deliveryType === "EXPRESS",
          packageIds: [selectedPackageIds[0], ...selectedPackageIds.slice(1)],
        }),
      )}
    >
      <div className="grid grid-cols-[auto_1fr] gap-3">
        <div>
          <div>
            <label className="block">Delivery Type</label>
            <select className="w-full" {...register("deliveryType")}>
              {SUPPORTED_PACKAGE_SHIPPING_TYPES.map((shippingType) => (
                <option key={shippingType} value={shippingType}>
                  {supportedShippingTypeToHumanized(
                    shippingType as PackageShippingType,
                  )}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Vehicle</label>
            {statusOfAvailableVehicles === "loading" && <p>Loading ...</p>}
            {statusOfAvailableVehicles === "error" && (
              <p>Error: {errorOfAvailableVehicles.message}</p>
            )}
            {statusOfAvailableVehicles === "success" && (
              <>
                {filterByVehiclesDeliveryType(
                  availableVehicles,
                  watch("deliveryType"),
                ).length === 0 ? (
                  <p>No available vehicles.</p>
                ) : (
                  <select className="w-full" {...register("vehicleId")}>
                    {filterByVehiclesDeliveryType(
                      availableVehicles,
                      watch("deliveryType"),
                    ).map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.displayName}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
          </div>
          <div>
            <label>Rider</label>
            {statusOfAvailableDrivers === "loading" && <p>Loading ...</p>}
            {statusOfAvailableDrivers === "error" && (
              <p>Error: {errorOfAvailableDrivers.message}</p>
            )}
            {statusOfAvailableDrivers === "success" && (
              <>
                {availableDrivers.length === 0 ? (
                  <p>No available drivers.</p>
                ) : (
                  <select className="w-full" {...register("driverId")}>
                    {availableDrivers.map((driver) => (
                      <option key={driver.id} value={driver.id.toString()}>
                        {driver.displayName}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
          </div>
        </div>
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
            onResetSelection={() => setSelectedPackageIds([])}
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
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-300 text-white transition-colors rounded-md"
          disabled={isLoading || selectedPackageIds.length === 0}
        >
          Create
        </button>
      </div>
    </form>
  )
}

export function CreateModal({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: () => void
}) {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_56rem)] h-[32rem] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            New Delivery
          </Dialog.Title>
          <CreateDeliveryForm close={close} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

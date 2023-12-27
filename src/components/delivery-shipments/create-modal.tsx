import { useState } from "react"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { Package, Vehicle } from "@/server/db/entities"
import { useSession } from "@/utils/auth"
import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import {
  REGEX_ONE_OR_MORE_DIGITS,
  SUPPORTED_SHIPPING_TYPES,
  ShippingType,
} from "@/utils/constants"
import { supportedShippingTypeToHumanized } from "@/utils/humanize"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"

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
  const {
    refetch,
    status,
    data: packages,
  } = api.package.getInWarehouse.useQuery()

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
                  {packages.length === 0 ? (
                    <input type="checkbox" disabled />
                  ) : (
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
                  )}
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

const createDeliveryFormSchema = z.object({
  deliveryType: z.custom<ShippingType>((val) =>
    SUPPORTED_SHIPPING_TYPES.includes(val as ShippingType),
  ),
  vehicleId: z.string().min(1).regex(REGEX_ONE_OR_MORE_DIGITS),
  driverId: z.string().length(28),
})

type CreateDeliveryFormType = z.infer<typeof createDeliveryFormSchema>

function CreateDeliveryForm({ close }: { close: () => void }) {
  const utils = api.useUtils()
  const { isLoading, mutate } = api.delivery.create.useMutation({
    onSuccess: () => {
      utils.delivery.getAll.invalidate()
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

  const [selectedPackageIds, setSelectedPackageIds] = useState<number[]>([])

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
    deliveryType: ShippingType,
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
              {SUPPORTED_SHIPPING_TYPES.map((shippingType) => (
                <option key={shippingType} value={shippingType}>
                  {supportedShippingTypeToHumanized(
                    shippingType as ShippingType,
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

export function DeliveryShipmentsCreateModal({
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

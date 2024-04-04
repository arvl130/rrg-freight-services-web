import { useEffect, useState } from "react"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass"
import type { Package, Vehicle } from "@/server/db/entities"
import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import type { PackageShippingType } from "@/utils/constants"
import {
  CLIENT_TIMEZONE,
  REGEX_HTML_INPUT_DATESTR,
  REGEX_ONE_OR_MORE_DIGITS,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
} from "@/utils/constants"
import { getHumanizedOfPackageShippingType } from "@/utils/humanize"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { SortAscending } from "@phosphor-icons/react/dist/ssr/SortAscending"
import { SortDescending } from "@phosphor-icons/react/dist/ssr/SortDescending"
import { DateTime } from "luxon"

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
  initialDeliveryType,
  selectedPackageIds,
  onSelectAll,
  onCheckboxChange,
  onResetSelection,
}: {
  initialDeliveryType: PackageShippingType
  selectedPackageIds: string[]
  onSelectAll: (props: { isChecked: boolean; packageIds: string[] }) => void
  onCheckboxChange: (props: { isChecked: boolean; packageId: string }) => void
  onResetSelection: () => void
}) {
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<
    "ALL" | PackageShippingType
  >(initialDeliveryType)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC")

  useEffect(() => {
    setSelectedDeliveryType(initialDeliveryType)
  }, [initialDeliveryType])

  const {
    refetch,
    status,
    data: packages,
  } = api.package.getInWarehouseAndCanBeDelivered.useQuery({
    shippingType:
      selectedDeliveryType === "ALL" ? undefined : selectedDeliveryType,
    sortOrder,
  })

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto] items-center mb-3">
        <div className="flex justify-between font-medium text-gray-700">
          <p>
            Showing
            <select
              value={selectedDeliveryType}
              onChange={(e) => {
                setSelectedDeliveryType(
                  e.currentTarget.value as PackageShippingType,
                )
              }}
            >
              <option value="ALL">All</option>
              {SUPPORTED_PACKAGE_SHIPPING_TYPES.map((shippingType) => (
                <option key={shippingType} value={shippingType}>
                  {getHumanizedOfPackageShippingType(
                    shippingType as PackageShippingType,
                  )}
                </option>
              ))}
            </select>
            Packages
          </p>
          <button
            type="button"
            onClick={() => {
              setSortOrder((currSortOrder) =>
                currSortOrder === "DESC" ? "ASC" : "DESC",
              )
            }}
          >
            {sortOrder === "DESC" ? (
              <>
                <SortAscending size={24} />
              </>
            ) : (
              <SortDescending size={24} />
            )}
          </button>
        </div>
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
  departureAt: z.string().regex(REGEX_HTML_INPUT_DATESTR, {
    message: "Please choose a valid date.",
  }),
})

type CreateDeliveryFormType = z.infer<typeof createDeliveryFormSchema>

function filterByVehiclesDeliveryType(
  vehicles: Vehicle[],
  deliveryType: PackageShippingType,
) {
  return deliveryType === "EXPRESS"
    ? vehicles.filter((vehicle) => vehicle.isExpressAllowed)
    : vehicles
}

export function CreateDeliveryForm({ onClose }: { onClose: () => void }) {
  const utils = api.useUtils()
  const { isLoading, mutate } = api.shipment.delivery.create.useMutation({
    onSuccess: () => {
      utils.shipment.delivery.getAll.invalidate()
      onClose()
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
  const dateTimeToday = DateTime.now().setZone(CLIENT_TIMEZONE).startOf("day")
  const htmlInputDateStrToday = `${dateTimeToday.year}-${dateTimeToday.month
    .toString()
    .padStart(2, "0")}-${dateTimeToday.day.toString().padStart(2, "0")}`

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDeliveryFormType>({
    resolver: zodResolver(createDeliveryFormSchema),
    defaultValues: {
      deliveryType: "STANDARD",
      departureAt: htmlInputDateStrToday,
    },
  })

  const deliveryTypeWatched = watch("deliveryType")

  return (
    <form
      className="grid grid-rows-[1fr_auto] px-4 py-2"
      onSubmit={handleSubmit((formData) => {
        const [year, month, day] = formData.departureAt.split("-")
        const departureAt = DateTime.fromObject({
          year: Number(year),
          month: Number(month),
          day: Number(day),
        })

        if (!departureAt.isValid) {
          toast.error("Please choose a valid date.")
          return
        }

        mutate({
          driverId: formData.driverId,
          vehicleId: Number(formData.vehicleId),
          isExpress: formData.deliveryType === "EXPRESS",
          packageIds: [selectedPackageIds[0], ...selectedPackageIds.slice(1)],
          departureAt: departureAt.toISO(),
        })
      })}
    >
      <div className="grid grid-cols-[auto_1fr] gap-3">
        <div>
          <div>
            <label className="block">Delivery Type</label>
            <select className="w-full" {...register("deliveryType")}>
              {SUPPORTED_PACKAGE_SHIPPING_TYPES.map((shippingType) => (
                <option key={shippingType} value={shippingType}>
                  {getHumanizedOfPackageShippingType(
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
          <div>
            <label className="block">Departure Date</label>
            <input
              type="date"
              min={htmlInputDateStrToday}
              {...register("departureAt")}
            />
            {errors.departureAt && (
              <p className="text-red-500">{errors.departureAt.message}</p>
            )}
          </div>
        </div>
        <div>
          <ChoosePackageTable
            initialDeliveryType={deliveryTypeWatched}
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

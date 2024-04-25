import { useMemo, useState } from "react"
import type { Package, Vehicle } from "@/server/db/entities"
import { CLIENT_TIMEZONE, type PackageShippingType } from "@/utils/constants"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { DateTime } from "luxon"
import { ChooseDeliveryType } from "./choose-delivery-type"
import { ChooseDriver } from "./choose-driver"
import { ChooseVehicle } from "./choose-vehicle"
import { ChooseDepartureDate } from "./choose-departure-date"
import { ChoosePackageTable } from "./choose-packages-table"
import { ChooseDepartingWarehouse } from "./choose-departing-warehouse"
import { ChooseProvinceWithPackages } from "./choose-province"

export function CreateDeliveryForm({ onClose }: { onClose: () => void }) {
  const utils = api.useUtils()
  const { isLoading, mutate } = api.shipment.delivery.create.useMutation({
    onSuccess: () => {
      utils.shipment.delivery.getAll.invalidate()
      onClose()
      toast.success("Delivery created.")
    },
  })

  const dateTimeToday = DateTime.now().setZone(CLIENT_TIMEZONE).startOf("day")
  const htmlInputDateStrToday = `${dateTimeToday.year}-${dateTimeToday.month
    .toString()
    .padStart(2, "0")}-${dateTimeToday.day.toString().padStart(2, "0")}`

  const [selectedDepartingWarehouseId, setSelectedDepartingWarehouseId] =
    useState<null | number>(null)
  const [selectedDriverId, setSelectedDriverId] = useState("")
  const [selectedProvinceId, setSelectedProvinceId] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState<null | Vehicle>(null)
  const [selectedDeliveryType, setSelectedDeliveryType] =
    useState<PackageShippingType>("STANDARD")
  const [selectedDepartureDate, setSelectedDepartureDate] = useState(
    htmlInputDateStrToday,
  )
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([])

  const selectedPackagesTotalWeight = useMemo(() => {
    return selectedPackages.reduce((prev, curr) => {
      return prev + curr.weightInKg
    }, 0)
  }, [selectedPackages])

  const hasExceededVehicleWeightCapacity = useMemo(() => {
    if (selectedVehicle === null) return false

    return selectedPackagesTotalWeight > selectedVehicle.weightCapacityInKg
  }, [selectedVehicle, selectedPackagesTotalWeight])

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-auto gap-y-3 px-4 py-2">
      <div className="overflow-auto">
        <div className="grid grid-cols-2 gap-x-3">
          <ChooseDepartingWarehouse
            warehouseId={selectedDepartingWarehouseId}
            onChange={(warehouseId) => {
              setSelectedDepartingWarehouseId(warehouseId)
              setSelectedPackages([])
            }}
          />
          <ChooseDeliveryType
            onChange={(deliveryType) => {
              setSelectedDeliveryType(deliveryType)
              setSelectedPackages([])
              setSelectedProvinceId("")
              setSelectedDriverId("")
            }}
          />
        </div>
        {selectedDepartingWarehouseId !== null && (
          <ChooseProvinceWithPackages
            warehouseId={selectedDepartingWarehouseId}
            deliveryType={selectedDeliveryType}
            provinceId={selectedProvinceId}
            onChange={(newProvinceId) => {
              setSelectedProvinceId(newProvinceId)
              setSelectedDriverId("")
            }}
          />
        )}

        {selectedProvinceId !== "" && (
          <ChooseDriver
            provinceId={selectedProvinceId}
            driverId={selectedDriverId}
            onChange={(driverId) => {
              setSelectedDriverId(driverId)
            }}
          />
        )}

        {selectedDriverId !== "" && (
          <>
            <ChooseVehicle
              vehicle={selectedVehicle}
              deliveryType={selectedDeliveryType}
              onChange={(vehicle) => setSelectedVehicle(vehicle)}
            />
            <ChooseDepartureDate
              minDate={htmlInputDateStrToday}
              departureDate={selectedDepartureDate}
              onChange={(departureDate) =>
                setSelectedDepartureDate(departureDate)
              }
            />
            <ChoosePackageTable
              selectedDepartingWarehouseId={selectedDepartingWarehouseId}
              selectedDeliveryType={selectedDeliveryType}
              selectedProvinceId={selectedProvinceId}
              selectedPackageIds={selectedPackages.map(({ id }) => id)}
              selectedVehicle={selectedVehicle}
              onAutoSelect={(packages) => {
                if (packages.length === 0) {
                  toast.error("No packages to choose from.")
                  return
                }

                if (selectedVehicle === null) {
                  toast.error("No vehicle selected.")
                  return
                }

                const sortedPackages = packages.toSorted((a, b) => {
                  if (
                    a.expectedHasDeliveryAt === null ||
                    b.expectedHasDeliveryAt === null
                  )
                    return 0

                  const firstExpectedHasDeliveryAt = DateTime.fromISO(
                    a.expectedHasDeliveryAt,
                  )
                  const secondExpectedHasDeliveryAt = DateTime.fromISO(
                    b.expectedHasDeliveryAt,
                  )

                  if (
                    !firstExpectedHasDeliveryAt.isValid ||
                    !secondExpectedHasDeliveryAt.isValid
                  )
                    return 0

                  if (
                    firstExpectedHasDeliveryAt.toMillis() >
                    secondExpectedHasDeliveryAt.toMillis()
                  )
                    return 1

                  return -1
                })

                const { packages: autoSelectedPackages } =
                  sortedPackages.reduce(
                    (prev, curr) => {
                      if (
                        curr.weightInKg + prev.totalWeight >
                        selectedVehicle.weightCapacityInKg
                      )
                        return prev

                      return {
                        totalWeight: prev.totalWeight + curr.weightInKg,
                        packages: [...prev.packages, curr],
                      }
                    },
                    {
                      totalWeight: 0,
                      packages: [] as Package[],
                    },
                  )

                if (autoSelectedPackages.length === 0) {
                  toast.error(
                    "No packages could be auto-selected. Please try choosing another vehicle.",
                  )
                  return
                }

                setSelectedPackages(autoSelectedPackages)
                toast.success(
                  "Packages were auto-selected based on Needs Schedule By date.",
                )
              }}
              onResetSelection={() => setSelectedPackages([])}
              onCheckboxChange={({ isChecked, package: _package }) => {
                if (isChecked)
                  setSelectedPackages((currSelectedPackages) => [
                    ...currSelectedPackages,
                    _package,
                  ])
                else
                  setSelectedPackages((currSelectedPackages) =>
                    currSelectedPackages.filter(
                      (selectedPackage) => selectedPackage.id !== _package.id,
                    ),
                  )
              }}
              hasExceededWeightLimit={hasExceededVehicleWeightCapacity}
              totalWeightOfSelectedPackages={selectedPackagesTotalWeight}
            />
          </>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="font-medium px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-300 text-white transition-colors rounded-md"
          disabled={
            isLoading ||
            selectedPackages.length === 0 ||
            hasExceededVehicleWeightCapacity
          }
          onClick={() => {
            if (selectedDepartingWarehouseId === null) {
              toast.error("Please choose a departing warehouse.")
              return
            }

            if (selectedDriverId === null) {
              toast.error("Please choose a driver.")
              return
            }

            if (selectedVehicle === null) {
              toast.error("Please choose a vehicle.")
              return
            }

            if (selectedDepartureDate === "") {
              toast.error("Please choose a departure date.")
              return
            }

            const [year, month, day] = selectedDepartureDate.split("-")
            const departureAt = DateTime.fromObject({
              year: Number(year),
              month: Number(month),
              day: Number(day),
            })

            if (!departureAt.isValid) {
              toast.error("Please choose a valid date.")
              return
            }

            const selectedPackageIds = [
              ...new Set(selectedPackages.map(({ id }) => id)),
            ]

            mutate({
              departingWarehouseId: selectedDepartingWarehouseId,
              driverId: selectedDriverId,
              vehicleId: Number(selectedVehicle.id),
              isExpress: selectedDeliveryType === "EXPRESS",
              packageIds: [
                selectedPackageIds[0],
                ...selectedPackageIds.slice(1),
              ],
              departureAt: departureAt.toISO(),
            })
          }}
        >
          Schedule
        </button>
      </div>
    </div>
  )
}

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

export function CreateDeliveryForm({ onClose }: { onClose: () => void }) {
  const utils = api.useUtils()
  const { isLoading, mutate } = api.shipment.delivery.create.useMutation({
    onSuccess: () => {
      utils.shipment.delivery.getAll.invalidate()
      onClose()
      toast.success("Delivery Created")
    },
  })

  const dateTimeToday = DateTime.now().setZone(CLIENT_TIMEZONE).startOf("day")
  const htmlInputDateStrToday = `${dateTimeToday.year}-${dateTimeToday.month
    .toString()
    .padStart(2, "0")}-${dateTimeToday.day.toString().padStart(2, "0")}`

  const [selectedDriverId, setSelectedDriverId] = useState("")
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
      <div className="grid grid-cols-[auto_1fr] gap-3">
        <div>
          <ChooseDriver
            driverId={selectedDriverId}
            onChange={(driverId) => {
              setSelectedDriverId(driverId)
            }}
          />
          <ChooseVehicle
            vehicle={selectedVehicle}
            deliveryType={selectedDeliveryType}
            onChange={(vehicle) => setSelectedVehicle(vehicle)}
          />
          <ChooseDeliveryType
            onChange={(deliveryType) => setSelectedDeliveryType(deliveryType)}
          />
          <ChooseDepartureDate
            minDate={htmlInputDateStrToday}
            departureDate={selectedDepartureDate}
            onChange={(departureDate) =>
              setSelectedDepartureDate(departureDate)
            }
          />
        </div>
        <ChoosePackageTable
          initialDeliveryType={selectedDeliveryType}
          selectedPackageIds={selectedPackages.map(({ id }) => id)}
          selectedVehicle={selectedVehicle}
          onSelectAll={({ isChecked, packages }) => {
            if (isChecked) {
              setSelectedPackages(packages)
            } else {
              setSelectedPackages([])
            }
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
            if (selectedDriverId === null) {
              toast.error("Please choose a driver")
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

            mutate({
              driverId: selectedDriverId,
              vehicleId: Number(selectedVehicle.id),
              isExpress: selectedDeliveryType === "EXPRESS",
              packageIds: [
                selectedPackages[0].id,
                ...selectedPackages.slice(1).map(({ id }) => id),
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

import { useMemo, useState } from "react"
import type { Package, Vehicle } from "@/server/db/entities"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { DateTime } from "luxon"
import { ChooseDriver } from "./choose-driver"
import { ChooseVehicle } from "./choose-vehicle"
import { ChoosePackageTable } from "./choose-packages-table"
import { ChooseAgent } from "./choose-agent"

export function CreateTransferForm({ onClose }: { onClose: () => void }) {
  const utils = api.useUtils()
  const { isLoading, mutate } =
    api.shipment.forwarderTransfer.create.useMutation({
      onSuccess: () => {
        utils.shipment.forwarderTransfer.getAll.invalidate()
        utils.package.getInWarehouse.invalidate()
        utils.package.getAll.invalidate()
        onClose()
        toast.success("Shipment Created")
      },
    })

  const [selectedAgentId, setSelectedAgentId] = useState("")
  const [selectedDriverId, setSelectedDriverId] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState<null | Vehicle>(null)
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
      <div className="grid grid-cols-[auto_1fr] gap-3 overflow-auto">
        <div>
          <ChooseAgent
            agentId={selectedAgentId}
            onChange={(agentId) => {
              setSelectedAgentId(agentId)
            }}
          />
          <ChooseDriver
            driverId={selectedDriverId}
            onChange={(driverId) => {
              setSelectedDriverId(driverId)
            }}
          />
          <ChooseVehicle
            vehicle={selectedVehicle}
            onChange={(vehicle) => setSelectedVehicle(vehicle)}
          />
        </div>
        <ChoosePackageTable
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

            const { packages: autoSelectedPackages } = packages.reduce(
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
            toast.success("Packages were auto-selected based on weight.")
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
              toast.error("Please choose a driver.")
              return
            }

            if (selectedVehicle === null) {
              toast.error("Please choose a vehicle.")
              return
            }

            const selectedPackageIds = [
              ...new Set(selectedPackages.map(({ id }) => id)),
            ]

            mutate({
              sentToAgentId: selectedAgentId,
              driverId: selectedDriverId,
              vehicleId: Number(selectedVehicle.id),
              packageIds: [
                selectedPackageIds[0],
                ...selectedPackageIds.slice(1),
              ],
            })
          }}
        >
          Schedule
        </button>
      </div>
    </div>
  )
}

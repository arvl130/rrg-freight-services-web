import type { Vehicle } from "@/server/db/entities"
import { api } from "@/utils/api"
import type { PackageShippingType } from "@/utils/constants"
import { useEffect } from "react"

function filterByVehiclesDeliveryType(
  vehicles: Vehicle[],
  deliveryType: PackageShippingType,
) {
  return deliveryType === "EXPRESS"
    ? vehicles.filter((vehicle) => vehicle.isExpressAllowed)
    : vehicles
}

export function ChooseVehicle({
  vehicle,
  deliveryType,
  onChange,
}: {
  vehicle: null | Vehicle
  deliveryType: PackageShippingType
  onChange: (vehicle: Vehicle) => void
}) {
  const {
    status,
    data: availableVehicles,
    error,
  } = api.vehicle.getAvailable.useQuery()

  useEffect(() => {
    if (vehicle === null && availableVehicles && availableVehicles.length > 0) {
      onChange(availableVehicles[0])
    }
  }, [availableVehicles, vehicle, onChange])

  return (
    <div className="mt-3">
      <label className="font-medium block">Vehicle</label>
      {status === "loading" && <p>Loading ...</p>}
      {status === "error" && <p>Error: {error.message}</p>}
      {status === "success" && (
        <>
          {filterByVehiclesDeliveryType(availableVehicles, deliveryType)
            .length === 0 ? (
            <p>No available vehicles.</p>
          ) : (
            <select
              className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md"
              value={vehicle === null ? "" : vehicle.id.toString()}
              onChange={(e) => {
                const selectedVehicle = availableVehicles.find(
                  (vehicle) => vehicle.id === Number(e.currentTarget.value),
                )

                if (selectedVehicle) onChange(selectedVehicle)
              }}
            >
              {filterByVehiclesDeliveryType(
                availableVehicles,
                deliveryType,
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
  )
}

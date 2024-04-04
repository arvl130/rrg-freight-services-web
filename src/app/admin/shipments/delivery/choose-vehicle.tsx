import type { Vehicle } from "@/server/db/entities"
import { api } from "@/utils/api"
import type { PackageShippingType } from "@/utils/constants"
import { useEffect, useState } from "react"

function filterByVehiclesDeliveryType(
  vehicles: Vehicle[],
  deliveryType: PackageShippingType,
) {
  return deliveryType === "EXPRESS"
    ? vehicles.filter((vehicle) => vehicle.isExpressAllowed)
    : vehicles
}

export function ChooseVehicle(props: {
  vehicle: null | Vehicle
  deliveryType: PackageShippingType
  onChange: (vehicle: Vehicle) => void
}) {
  const [hasLoadedPreselection, setHasLoadedPreselection] = useState(false)
  const {
    status,
    data: availableVehicles,
    error,
  } = api.vehicle.getAvailable.useQuery()

  useEffect(() => {
    if (
      !hasLoadedPreselection &&
      availableVehicles &&
      availableVehicles.length > 0
    ) {
      props.onChange(availableVehicles[0])
      setHasLoadedPreselection(true)
    }
  }, [hasLoadedPreselection, availableVehicles, props])

  return (
    <div className="mt-3">
      <label className="font-medium block">Vehicle</label>
      {status === "loading" && <p>Loading ...</p>}
      {status === "error" && <p>Error: {error.message}</p>}
      {status === "success" && (
        <>
          {filterByVehiclesDeliveryType(availableVehicles, props.deliveryType)
            .length === 0 ? (
            <p>No available vehicles.</p>
          ) : (
            <select
              className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md"
              value={props.vehicle === null ? "" : props.vehicle.id.toString()}
              onChange={(e) => {
                const selectedVehicle = availableVehicles.find(
                  (vehicle) => vehicle.id === Number(e.currentTarget.value),
                )

                if (selectedVehicle) props.onChange(selectedVehicle)
              }}
            >
              {filterByVehiclesDeliveryType(
                availableVehicles,
                props.deliveryType,
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

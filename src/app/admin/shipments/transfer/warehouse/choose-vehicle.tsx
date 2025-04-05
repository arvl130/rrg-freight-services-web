import type { Vehicle } from "@/server/db/entities"
import { api } from "@/utils/api"
import { useEffect } from "react"

export function ChooseVehicle({
  vehicle,
  onChange,
}: {
  vehicle: null | Vehicle
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
  }, [vehicle, availableVehicles, onChange])

  return (
    <div className="mt-3">
      <label className="font-medium block">Vehicle</label>
      {status === "pending" && <p>Loading ...</p>}
      {status === "error" && <p>Error: {error.message}</p>}
      {status === "success" && (
        <>
          {availableVehicles.length === 0 ? (
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
              {availableVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id.toString()}>
                  {vehicle.displayName} ({vehicle.plateNumber})
                </option>
              ))}
            </select>
          )}
        </>
      )}
    </div>
  )
}

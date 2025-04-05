import { api } from "@/utils/api"
import { useEffect } from "react"

export function ChooseDepartingWarehouse({
  warehouseId,
  onChange,
}: {
  warehouseId: null | number
  onChange: (warehouseId: number) => void
}) {
  const { status, data, error } = api.warehouse.getAll.useQuery()

  useEffect(() => {
    if (warehouseId === null && data && data.length > 0) {
      onChange(data[0].id)
    }
  }, [warehouseId, data, onChange])

  return (
    <div className="text-gray-700">
      <label className="block font-medium">Departing Warehouse</label>
      {status === "pending" && <p>Loading ...</p>}
      {status === "error" && <p>Error: {error.message}</p>}
      {status === "success" && (
        <>
          {data.length === 0 ? (
            <p>No available warehouses.</p>
          ) : (
            <select
              className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md"
              value={warehouseId === null ? "" : warehouseId.toString()}
              onChange={(e) => {
                onChange(Number(e.currentTarget.value))
              }}
            >
              {data.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id.toString()}>
                  {warehouse.displayName}
                </option>
              ))}
            </select>
          )}
        </>
      )}
    </div>
  )
}

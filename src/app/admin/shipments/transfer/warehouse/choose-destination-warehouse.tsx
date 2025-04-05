import type { Warehouse } from "@/server/db/entities"
import { api } from "@/utils/api"

function removeOriginWarehouseIdFromList(
  warehouses: Warehouse[],
  originWarehouseId: null | number,
) {
  if (originWarehouseId === null) return warehouses

  return warehouses.filter((warehouse) => warehouse.id !== originWarehouseId)
}

export function ChooseDestinationWarehouse({
  originWarehouseId,
  warehouseId,
  onChange,
}: {
  originWarehouseId: null | number
  warehouseId: null | number
  onChange: (warehouseId: number) => void
}) {
  const { status, data, error } = api.warehouse.getAll.useQuery()

  return (
    <div className="text-gray-700 mt-3">
      <label className="block font-medium">Destination Warehouse</label>
      {status === "pending" && <p>Loading ...</p>}
      {status === "error" && <p>Error: {error.message}</p>}
      {status === "success" && (
        <>
          {removeOriginWarehouseIdFromList(data, originWarehouseId).length ===
          0 ? (
            <p>No available warehouses.</p>
          ) : (
            <select
              className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md"
              value={warehouseId === null ? "" : warehouseId.toString()}
              onChange={(e) => {
                onChange(Number(e.currentTarget.value))
              }}
            >
              <option value="">Choose ...</option>
              {removeOriginWarehouseIdFromList(data, originWarehouseId).map(
                (warehouse) => (
                  <option key={warehouse.id} value={warehouse.id.toString()}>
                    {warehouse.displayName}
                  </option>
                ),
              )}
            </select>
          )}
        </>
      )}
    </div>
  )
}

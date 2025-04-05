import { api } from "@/utils/api"

export function ChooseOriginWarehouse({
  warehouseId,
  onChange,
}: {
  warehouseId: null | number
  onChange: (warehouseId: number) => void
}) {
  const { status, data, error } = api.warehouse.getAll.useQuery()

  return (
    <div className="text-gray-700">
      <label className="block font-medium">Origin Warehouse</label>
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
              <option value="">Choose ...</option>
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

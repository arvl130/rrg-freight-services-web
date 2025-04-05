import { api } from "@/utils/api"
import { useEffect } from "react"

export function ChooseDriver({
  driverId,
  onChange,
}: {
  driverId: string
  onChange: (driverId: string) => void
}) {
  const { status, data, error } = api.user.getAvailableDrivers.useQuery()

  useEffect(() => {
    if (driverId === "" && data && data.length > 0) {
      onChange(data[0].id)
    }
  }, [driverId, data, onChange])

  return (
    <div className="text-gray-700 mt-3">
      <label className="font-medium">Driver</label>
      {status === "pending" && <p>Loading ...</p>}
      {status === "error" && <p>Error: {error.message}</p>}
      {status === "success" && (
        <>
          {data.length === 0 ? (
            <p>No available drivers.</p>
          ) : (
            <select
              className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md"
              value={driverId}
              onChange={(e) => {
                onChange(e.currentTarget.value)
              }}
            >
              {data.map((driver) => (
                <option key={driver.id} value={driver.id.toString()}>
                  {driver.displayName}
                </option>
              ))}
            </select>
          )}
        </>
      )}
    </div>
  )
}

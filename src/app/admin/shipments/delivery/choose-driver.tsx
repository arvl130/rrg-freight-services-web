import { api } from "@/utils/api"
import Link from "next/link"
import { useEffect } from "react"

export function ChooseDriver({
  cityId,
  driverId,
  onChange,
}: {
  cityId: string
  driverId: string
  onChange: (driverId: string) => void
}) {
  const { status, data, error } =
    api.user.getAvailableDriverInProvinceId.useQuery({
      cityId,
    })

  useEffect(() => {
    if (driverId === "" && data && data.length > 0) {
      onChange(data[0].id)
    }
  }, [data, onChange, driverId])

  return (
    <div className="text-gray-700 mt-3">
      <label className="font-medium">Driver</label>
      {status === "pending" && <p>Loading ...</p>}
      {status === "error" && <p>Error: {error.message}</p>}
      {status === "success" && (
        <>
          {data.length === 0 ? (
            <div className="max-w-lg">
              <p className="text-red-500">
                There are no available drivers assigned for this area at the
                moment.
              </p>
              <ul className="mt-1 text-sm">
                <li>
                  * Try assigning an existing driver to this area, or create a
                  new driver assigned to this area. You can accomplish this on
                  the{" "}
                  <Link
                    href="/admin/users"
                    className="font-semibold hover:underline"
                  >
                    Users
                  </Link>{" "}
                  page.
                </li>
              </ul>
            </div>
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

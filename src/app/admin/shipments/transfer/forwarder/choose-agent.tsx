import { api } from "@/utils/api"
import { useEffect } from "react"

export function ChooseAgent({
  agentId,
  onChange,
}: {
  agentId: string
  onChange: (driverId: string) => void
}) {
  const { status, data, error } = api.user.getDomesticAgents.useQuery()

  useEffect(() => {
    if (agentId === "" && data && data.length > 0) {
      onChange(data[0].id)
    }
  }, [agentId, data, onChange])

  return (
    <div className="text-gray-700 mt-3">
      <label className="font-medium">Agent</label>
      {status === "loading" && <p>Loading ...</p>}
      {status === "error" && <p>Error: {error.message}</p>}
      {status === "success" && (
        <>
          {data.length === 0 ? (
            <p>No available drivers.</p>
          ) : (
            <select
              className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md"
              value={agentId}
              onChange={(e) => {
                onChange(e.currentTarget.value)
              }}
            >
              {data.map((agent) => (
                <option key={agent.id} value={agent.id.toString()}>
                  {agent.displayName}
                </option>
              ))}
            </select>
          )}
        </>
      )}
    </div>
  )
}

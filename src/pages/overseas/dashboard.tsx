import { useSession } from "@/utils/auth"
import { getAuth, signOut } from "firebase/auth"

export default function DashboardPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "OVERSEAS_AGENT",
    },
  })

  if (isLoading || role !== "OVERSEAS_AGENT") return <>...</>

  return (
    <>
      <p>This is the Dashboard page for Overseas Agents.</p>
      <button
        type="button"
        onClick={() => {
          const auth = getAuth()
          signOut(auth)
        }}
      >
        logout
      </button>
    </>
  )
}

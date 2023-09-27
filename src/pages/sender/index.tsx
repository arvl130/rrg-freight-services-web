import { useSession } from "@/utils/auth"
import { getAuth, signOut } from "firebase/auth"

export default function DashboardPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "SENDER",
    },
  })

  if (isLoading || role !== "SENDER") return <>...</>

  return (
    <>
      <p>This is the Dashboard page for Sending Agents.</p>
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

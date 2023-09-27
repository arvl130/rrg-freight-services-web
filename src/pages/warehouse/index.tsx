import { useSession } from "@/utils/auth"
import { getAuth, signOut } from "firebase/auth"

export default function DashboardPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "WAREHOUSE",
    },
  })

  if (isLoading || role !== "WAREHOUSE") return <>...</>

  return (
    <>
      <p>This is the Dashboard page for Warehouse Staff.</p>
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

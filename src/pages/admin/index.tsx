import { AdminLayout } from "@/layouts/AdminLayout"
import { useSession } from "@/utils/auth"
import { getAuth, signOut } from "firebase/auth"

export default function DashboardPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "ADMIN",
    },
  })

  if (isLoading || role !== "ADMIN") return <>...</>

  return (
    <AdminLayout title="Admin Dashboard">
      <p>This is the Dashboard page for Admins.</p>
      <button
        type="button"
        onClick={() => {
          const auth = getAuth()
          signOut(auth)
        }}
      >
        logout
      </button>
    </AdminLayout>
  )
}

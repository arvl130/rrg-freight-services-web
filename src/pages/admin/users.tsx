import { AdminLayout } from "@/layouts/AdminLayout"
import { useSession } from "@/utils/auth"

export default function UsersPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "ADMIN",
    },
  })

  if (isLoading || role !== "ADMIN") return <>...</>

  return (
    <AdminLayout title="Admin Dashboard">
      This is the Users page for the Admins.
    </AdminLayout>
  )
}

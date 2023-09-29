import { AdminLayout } from "@/layouts/AdminLayout"
import { useSession } from "@/utils/auth"

export default function PackagesPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "ADMIN",
    },
  })

  if (isLoading || role !== "ADMIN") return <>...</>

  return (
    <AdminLayout title="Admin Dashboard">
      This is the Packages page for the Admins.
    </AdminLayout>
  )
}

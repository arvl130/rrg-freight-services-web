import { AdminLayout } from "@/layouts/admin"
import { useSession } from "@/utils/auth"

export default function PackagesPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "ADMIN",
    },
  })

  if (isLoading || role !== "ADMIN") return <>...</>

  return (
    <AdminLayout title="Packages">
      This is the Packages page for the Admins.
    </AdminLayout>
  )
}

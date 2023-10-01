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
    <AdminLayout title="Manifests">
      This is the Manifests page for the Admins.
    </AdminLayout>
  )
}

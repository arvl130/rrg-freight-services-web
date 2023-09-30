import { AdminLayout } from "@/layouts/admin"
import { useSession } from "@/utils/auth"

export default function ActivityLogsPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "ADMIN",
    },
  })

  if (isLoading || role !== "ADMIN") return <>...</>

  return (
    <AdminLayout title="Admin Dashboard">
      This is the Activity Logs page for the Admins.
    </AdminLayout>
  )
}

import { AdminLayout } from "@/app/admin/auth"
import * as Page from "@/components/page"
import { MainSection } from "./main-section"
import { validateSessionWithCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUserRoleRedirectPath } from "@/utils/redirects"

export default async function ActivitiesPage() {
  const { user } = await validateSessionWithCookies()
  if (!user) {
    return redirect("/login")
  }

  if (user.role !== "ADMIN") {
    const redirectPath = getUserRoleRedirectPath(user.role)
    return redirect(redirectPath)
  }

  return (
    <AdminLayout title="Activity Logs" user={user}>
      <Page.Header>
        <h1 className="text-2xl font-black [color:_#00203F] mb-2">
          Activity Logs
        </h1>
      </Page.Header>
      <MainSection />
    </AdminLayout>
  )
}

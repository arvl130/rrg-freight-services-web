import { AdminLayout } from "@/app/admin/auth"
import * as Page from "@/components/page"
import { validateSessionWithCookies } from "@/server/auth"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import { redirect } from "next/navigation"
import { MainSection } from "./main-section"

export default async function PackagesPage() {
  const { user } = await validateSessionWithCookies()
  if (!user) {
    return redirect("/login")
  }

  if (user.role !== "ADMIN") {
    const redirectPath = getUserRoleRedirectPath(user.role)
    return redirect(redirectPath)
  }

  return (
    <AdminLayout title="Packages" user={user}>
      <Page.Header>
        <h1 className="text-2xl font-black [color:_#00203F] mb-2">Packages</h1>
      </Page.Header>
      <MainSection />
    </AdminLayout>
  )
}

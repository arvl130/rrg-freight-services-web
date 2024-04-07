import { AdminLayout } from "@/app/admin/auth"
import * as Page from "@/components/page"
import { HeaderSection, MainSection } from "./main-section"
import { validateSessionWithCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUserRoleRedirectPath } from "@/utils/redirects"

export default async function DeliverableProvincesPage() {
  const { user } = await validateSessionWithCookies()
  if (!user) {
    redirect("/login")
  }

  if (user.role !== "ADMIN") {
    const redirectPath = getUserRoleRedirectPath(user.role)
    redirect(redirectPath)
  }

  return (
    <AdminLayout title="Deliverable Provinces" user={user}>
      <Page.Header>
        <HeaderSection />
      </Page.Header>
      <MainSection />
    </AdminLayout>
  )
}

import { AdminLayout } from "@/app/admin/auth"
import * as Page from "@/components/page"
import { HeaderSection, MainSection } from "./main-section"
import { validateSessionFromCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUserRoleRedirectPath } from "@/utils/redirects"

export default async function TransferForwarderShipmentsPage() {
  const sessionResult = await validateSessionFromCookies()
  if (!sessionResult) {
    return redirect("/login")
  }

  const { user } = sessionResult
  if (user.role !== "ADMIN") {
    const redirectPath = getUserRoleRedirectPath(user.role)
    return redirect(redirectPath)
  }

  return (
    <AdminLayout title="Shipments" user={user}>
      <Page.Header>
        <HeaderSection />
      </Page.Header>
      <MainSection />
    </AdminLayout>
  )
}

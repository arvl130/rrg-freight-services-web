import { AdminLayout } from "@/app/admin/auth"
import { Plus } from "@phosphor-icons/react/dist/ssr/Plus"
import * as Page from "@/components/page"
import { CreateModal } from "./create-modal"
import { validateSessionFromCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import { HeaderSection, MainSection } from "./main-section"

export default async function PackageCategories() {
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
    <AdminLayout title="Package Categories" user={user}>
      <Page.Header>
        <HeaderSection />
      </Page.Header>
      <MainSection />
    </AdminLayout>
  )
}

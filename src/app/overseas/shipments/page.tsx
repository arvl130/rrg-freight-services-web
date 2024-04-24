import { AdminLayout } from "@/app/admin/auth"
import * as Page from "@/components/page"
import { HeaderSection, MainSection } from "./main-section"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import { validateSessionWithCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { OverseasLayout } from "../auth"

export default async function IncomingShipmentsPage() {
  const { user } = await validateSessionWithCookies()
  if (!user) {
    return redirect("/login")
  }

  if (user.role !== "OVERSEAS_AGENT") {
    const redirectPath = getUserRoleRedirectPath(user.role)
    return redirect(redirectPath)
  }

  return (
    <OverseasLayout title={["Shipments", "Incoming"]} user={user}>
      <Page.Header>
        <HeaderSection />
      </Page.Header>
      <MainSection userId={user.id} />
    </OverseasLayout>
  )
}

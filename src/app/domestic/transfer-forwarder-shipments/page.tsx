import { DomesticLayout } from "@/app/domestic/auth"
import { MainSection, PageHeader } from "./main-section"
import { validateSessionWithCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUserRoleRedirectPath } from "@/utils/redirects"

export default async function TransferShipmentsPage() {
  const { user } = await validateSessionWithCookies()
  if (!user) {
    return redirect("/login")
  }

  if (user.role !== "DOMESTIC_AGENT") {
    const redirectPath = getUserRoleRedirectPath(user.role)
    return redirect(redirectPath)
  }

  return (
    <DomesticLayout title="Transfer Shipments" user={user}>
      <PageHeader />
      <MainSection />
    </DomesticLayout>
  )
}

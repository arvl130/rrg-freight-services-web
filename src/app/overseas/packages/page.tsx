import { OverseasLayout } from "@/app/overseas/auth"
import * as Page from "@/components/page"
import { MainSection } from "./main-section"
import { validateSessionWithCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import { userAgentFromString } from "next/server"

export default async function PackagesPage() {
  const { user } = await validateSessionWithCookies()
  if (!user) {
    return redirect("/login")
  }

  if (user.role !== "OVERSEAS_AGENT") {
    const redirectPath = getUserRoleRedirectPath(user.role)
    return redirect(redirectPath)
  }

  return (
    <OverseasLayout title="Packages" user={user}>
      <Page.Header>
        <h1 className="text-2xl font-black [color:_#00203F] mb-2">Packages</h1>
      </Page.Header>
      <MainSection />
    </OverseasLayout>
  )
}

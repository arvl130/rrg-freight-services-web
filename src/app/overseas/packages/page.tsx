import { OverseasLayout } from "@/app/overseas/auth"
import * as Page from "@/components/page"
import { MainSection } from "./main-section"
import { validateSessionFromCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUserRoleRedirectPath } from "@/utils/redirects"

export default async function PackagesPage() {
  const sessionResult = await validateSessionFromCookies()
  if (!sessionResult) {
    return redirect("/login")
  }

  const { user } = sessionResult
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

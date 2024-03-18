import { WarehouseLayout } from "@/app/warehouse/auth"
import { validateSessionFromCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import { MainSection } from "./main-section"

export default async function DashboardPage() {
  const sessionResult = await validateSessionFromCookies()
  if (!sessionResult) {
    return redirect("/login")
  }

  const { user } = sessionResult
  if (user.role !== "WAREHOUSE") {
    const redirectPath = getUserRoleRedirectPath(user.role)
    return redirect(redirectPath)
  }

  return (
    <WarehouseLayout title="Dashboard" user={sessionResult.user}>
      <MainSection />
    </WarehouseLayout>
  )
}

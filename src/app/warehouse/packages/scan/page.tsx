import { WarehouseLayout } from "@/app/warehouse/auth"
import { validateSessionFromCookies } from "@/server/auth"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import { redirect } from "next/navigation"
import { Tabs } from "./tabs"

export default async function ScanPackagePage() {
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
    <WarehouseLayout title="Scan Package" user={user}>
      <div className="flex	justify-between	my-4">
        <h1 className="text-3xl font-black [color:_#00203F] mb-4">
          Scan Package
        </h1>
      </div>
      <Tabs userId={user.id} />
    </WarehouseLayout>
  )
}

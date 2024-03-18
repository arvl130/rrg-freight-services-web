import { WarehouseLayout } from "@/app/warehouse/auth"
import { useSession } from "@/hooks/session"
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree"
import type { Package } from "@/server/db/entities"
import { api } from "@/utils/api"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Table from "@/components/table"
import * as Page from "@/components/page"
import { ViewWaybillModal } from "@/components/packages/view-waybill-modal"
import { ViewDetailsModal } from "@/components/packages/view-details-modal"
import type { PackageShippingType } from "@/utils/constants"
import { usePaginatedItems } from "@/hooks/paginated-items"
import { getColorFromPackageStatus } from "@/utils/colors"
import { supportedPackageStatusToHumanized } from "@/utils/humanize"
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
  if (user.role !== "WAREHOUSE") {
    const redirectPath = getUserRoleRedirectPath(user.role)
    return redirect(redirectPath)
  }

  return (
    <WarehouseLayout title="Packages" user={user}>
      <Page.Header>
        <h1 className="text-2xl font-black [color:_#00203F] mb-2">Packages</h1>
      </Page.Header>
      <MainSection />
    </WarehouseLayout>
  )
}

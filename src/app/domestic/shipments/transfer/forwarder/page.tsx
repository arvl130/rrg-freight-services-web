import * as Page from "@/components/page"
import { DomesticLayout } from "@/app/domestic/auth"
import { MainSection } from "./main-section"
import { validateSessionWithCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"

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
    <DomesticLayout title="Shipments" user={user}>
      <Page.Header>
        <h1 className="text-2xl font-black mb-2 [color:_#00203F] flex items-center gap-1">
          <span>Shipments</span> <CaretRight size={20} />
          <span>Forwarder Transfer</span>
        </h1>
      </Page.Header>
      <MainSection />
    </DomesticLayout>
  )
}

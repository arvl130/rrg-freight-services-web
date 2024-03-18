import { DomesticLayout } from "@/app/domestic/auth"
import { validateSessionFromCookies } from "@/server/auth"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import { redirect } from "next/navigation"
import { TotalArrivingShipmentTile, TotalPackageTile } from "./top-tiles"

function ManifestSummaryTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Manifest Summary</h2>
          <p className="flex items-center">
            See more <CaretRight size={16} />
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="text-sm">
        {/* Header */}
        <div className="grid grid-cols-5 text-gray-400 mb-1">
          <div>ID</div>
          <div>Date Issued</div>
          <div>Date Issued</div>
          <div>Date Issued</div>
          <div>Items</div>
        </div>
      </div>
    </article>
  )
}

function ManifestHistoryTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Manifest History</h2>
          <p className="flex items-center">
            See more <CaretRight size={16} />
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="text-sm">
        {/* Header */}
        <div className="grid grid-cols-5 text-gray-400 mb-1">
          <div>ID</div>
          <div>Date Issued</div>
          <div>Date Issued</div>
          <div>Date Issued</div>
          <div>Items</div>
        </div>
      </div>
    </article>
  )
}

interface CalendarWidgetProps {
  year: number
  month: string
}

function CalendarWidgetTile({ year, month }: CalendarWidgetProps) {
  function generateCalendarContent() {
    const daysInMonth = 31
    const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)

    return days
  }

  const calendarDays = generateCalendarContent()

  return (
    <div className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <h2 className="font-semibold flex items-center text-md  mb-2  ">
        {`${month} ${year}  `}
        <CaretRight size={16} />
      </h2>
      <div className="grid grid-cols-7 gap-6">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => (
          <div key={index} className="text-center">
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentNotificationTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Notifications</h2>
        </div>
      </div>
    </article>
  )
}

export default async function DashboardPage() {
  const sessionResult = await validateSessionFromCookies()
  if (!sessionResult) {
    return redirect("/login")
  }

  const { user } = sessionResult
  if (user.role !== "DOMESTIC_AGENT") {
    const redirectPath = getUserRoleRedirectPath(user.role)
    return redirect(redirectPath)
  }

  return (
    <DomesticLayout title="Dashboard" user={user}>
      <>
        <h1 className="text-3xl font-black [color:_#00203F] mb-8">Dashboard</h1>
        <section className="mb-6">
          <div className="grid grid-cols-[repeat(3,_minmax(0,_24rem))] gap-x-8">
            <TotalPackageTile />
            <TotalArrivingShipmentTile />
          </div>
        </section>
        <section className="grid grid-cols-[1fr_20rem] gap-x-6 [color:_#404040] mb-6">
          <ManifestSummaryTile />
          <CalendarWidgetTile year={2023} month="October" />
        </section>
        <section className="grid grid-cols-[1fr_20rem] gap-x-6 [color:_#404040] mb-6">
          <ManifestHistoryTile />
          <RecentNotificationTile />
        </section>
      </>
    </DomesticLayout>
  )
}

"use client"

import { DomesticLayout } from "@/app/domestic/auth"
import { useSession } from "@/hooks/session"

import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import { api } from "@/utils/api"
import { Package } from "@phosphor-icons/react/dist/icons/Package"
import { Article } from "@phosphor-icons/react/dist/icons/Article"
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

function TotalPackageTile() {
  const { status, data } = api.package.getTotalPackagesSentToAgentId.useQuery()

  return (
    <article
      className="
        text-[#C61717]
        grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#ED5959CC] to-[#ED595900]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">
          {status === "loading" && <>...</>}
          {status === "error" && <>error</>}
          {status === "success" && <>{data.count}</>}
        </p>
        <p>Total Package</p>
      </div>
      <div>
        <Package size={96} />
      </div>
    </article>
  )
}

function TotalArrivingShipmentTile() {
  const { status, data } =
    api.shipment.forwarderTransfer.getTotalInTransitSentToAgentId.useQuery()

  return (
    <article
      className=" text-[#AC873C]
      grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
      bg-gradient-to-b from-[#EDAD3E80] to-[#EDAD3E00]"
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold"></p>
        <p className="text-4xl font-semibold">
          {status === "loading" && <>...</>}
          {status === "error" && <>error</>}
          {status === "success" && <>{data.count}</>}
        </p>
        <p>Total Arriving Shipment</p>
      </div>
      <div>
        <Article size={96} />
      </div>
    </article>
  )
}

interface CalendarWidgetProps {
  year: number
  month: string
}

function TotalArrivingShipmentTile() {
  const { status, data } =
    api.shipment.package.getTotalArrivingShipment.useQuery()
  return (
    <article
      className=" text-[#AC873C]
      grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
      bg-gradient-to-b from-[#EDAD3E80] to-[#EDAD3E00]"
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold"></p>
        <p className="text-4xl font-semibold">
          {status === "loading" && <>...</>}
          {status === "error" && <>error</>}
          {status === "success" && <>{data.count}</>}
        </p>
        <p>Total Arriving Shipment</p>
      </div>
      <div>
        <Article size={96} />
      </div>
    </article>
  )
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

export default function DashboardPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "DOMESTIC_AGENT",
    },
  })

  if (isLoading || role !== "DOMESTIC_AGENT") return <>...</>

  return (
    <DomesticLayout title="Dashboard">
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

"use client"

import { Article } from "@phosphor-icons/react/Article"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { File } from "@phosphor-icons/react/File"
import { Package } from "@phosphor-icons/react/Package"
import { UserCircle } from "@phosphor-icons/react/UserCircle"
import { api } from "@/utils/api"
import { DriverLayout } from "../auth"

const shipments = [
  {
    clusterId: 1000000,
    sender: "John Doe",
    receiver: "John Dela Cruz",
    date: "Oct 12,2023",
  },
  {
    clusterId: 1000001,
    sender: "John Doe",
    receiver: "John Dela Cruz",
    date: "Oct 13,2023",
  },
  {
    clusterId: 1000002,
    sender: "John Doe",
    receiver: "John Dela Cruz",
    date: "Oct 14,2023",
  },
  {
    clusterId: 1000003,
    sender: "John Doe",
    receiver: "John Dela Cruz",
    date: "Oct 15,2023",
  },
  {
    clusterId: 1000004,
    sender: "John Doe",
    receiver: "John Dela Cruz",
    date: "Oct 16,2023",
  },
  {
    clusterId: 1000005,
    sender: "John Doe",
    receiver: "John Dela Cruz",
    date: "Oct 17,2023",
  },
  {
    clusterId: 1000006,
    sender: "John Doe",
    receiver: "John Dela Cruz",
    date: "Oct 18,2023",
  },
]

function PendingShipmentsTile() {
  const { status, data } =
    api.shipment.delivery.getTotalPreparingAssignedToDriverId.useQuery()

  return (
    <article className="text-[#29727C] grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg bg-gradient-to-b from-[#79CFDCCC] to-[#79CFDC00]">
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">
          {status === "loading" && <>...</>}
          {status === "error" && <>error</>}
          {status === "success" && <>{data.count}</>}
        </p>
        <p>Pending Shipments</p>
      </div>
      <div>
        <Package size={96} />
      </div>
    </article>
  )
}

function InTransitShipmentsTile() {
  const { status, data } =
    api.shipment.delivery.getTotalInTransitAssignedToDriverId.useQuery()

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

function CompletedShipmentsTile() {
  const { status, data } =
    api.shipment.delivery.getTotalCompletedAssignedToDriverId.useQuery()

  return (
    <article
      className="
        text-[#AC873C]
        grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#EDAD3E80] to-[#EDAD3E00]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">
          {status === "loading" && <>...</>}
          {status === "error" && <>error</>}
          {status === "success" && <>{data.count}</>}
        </p>
        <p>Total Unsend Shipment</p>
      </div>
      <div>
        <Article size={96} />
      </div>
    </article>
  )
}

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
          <div>CItems</div>
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

function RecentClusterTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Recent Cluster</h2>
          <p className="flex items-center">
            View all <CaretRight size={16} />
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="text-sm">
        {/* Header */}
        <div className="grid grid-cols-4 text-gray-400 mb-1">
          <div>Cluster ID</div>
          <div>Sender</div>
          <div>Receiver</div>
          <div>Date Issued</div>
        </div>
        <div>
          {shipments.map((_shipment) => (
            <div
              key={_shipment.clusterId}
              className="grid grid-cols-4 border-b border-gray-300 text-sm"
            >
              <div className=" py-2 flex items-center gap-1">
                <input type="checkbox" name="" id="" />
                <span>{_shipment.clusterId}</span>
              </div>
              <div className="py-2">
                <div>{_shipment.sender}</div>
              </div>
              <div className="py-2">
                <div>{_shipment.receiver}</div>
              </div>
              <div className="py-2">
                <div>{_shipment.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function RecentAddedManifestTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Recent Cluster</h2>
          <p className="flex items-center">
            View all <CaretRight size={16} />
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="text-sm">
        {/* Header */}
        <div className="grid grid-cols-3 text-gray-400 mb-1">
          <div>Cluster ID</div>
          <div>Sender</div>
          <div>Date Issued</div>
        </div>
        <div>
          {shipments.map((_shipment) => (
            <div
              key={_shipment.clusterId}
              className="grid grid-cols-3 border-b border-gray-300 text-sm"
            >
              <div className=" py-2 flex items-center gap-1">
                <input type="checkbox" name="" id="" />
                <span>{_shipment.clusterId}</span>
              </div>
              <div className="py-2">
                <div>{_shipment.sender}</div>
              </div>
              <div className="py-2">
                <div>{_shipment.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function RecentNotificationTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Recent Notification</h2>
        </div>
      </div>
      <div className="text-sm">
        {/* Header */}
        <div className="px-4 grid grid-cols-[1fr_1fr_6rem] text-gray-400 mb-3">
          <div>TODAY</div>
        </div>
        {/* Body */}
        <div>
          <div className="mb-4">
            <div className="px-4 grid grid-cols-[2rem_1fr] gap-2 ">
              <div className=" flex justify-center items-center h-6">
                <File size={32} />
              </div>
              <div className="flex items-center font-semibold">
                Added Successfully!
              </div>
            </div>
            <div className="flex items-center px-14 text-gray-400">
              max.cluster was uploaded successfully.
            </div>
          </div>

          <div className="mb-4">
            <div className="px-4 grid grid-cols-[2rem_1fr] gap-2 ">
              <div className=" flex justify-center items-center h-6">
                <UserCircle size={32} />
              </div>
              <div className="flex items-center font-semibold">
                Profile Update
              </div>
            </div>
            <div className="flex items-center px-14 text-gray-400">
              your profile was updated successfully.
            </div>
          </div>

          <div className="px-4 grid grid-cols-[1fr_1fr_6rem] text-gray-400 mb-3">
            <div>YESTERDAY</div>
          </div>

          <div className="mb-4">
            <div className="px-4 grid grid-cols-[2rem_1fr] gap-2 ">
              <div className=" flex justify-center items-center h-6">
                <File size={32} />
              </div>
              <div className="flex items-center font-semibold">
                Added Successfully!
              </div>
            </div>
            <div className="flex items-center px-14 text-gray-400">
              max.cluster was uploaded successfully.
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function DashboardPage() {
  return (
    <DriverLayout title="Dashboard">
      <h1 className="text-3xl font-black [color:_#00203F] mb-8">Dashboard</h1>
      <section className="mb-6">
        <div className="grid grid-cols-[repeat(3,_minmax(0,_24rem))] gap-x-8">
          <PendingShipmentsTile />
          <InTransitShipmentsTile />
          <CompletedShipmentsTile />
        </div>
      </section>
      <section className="grid grid-cols-[1fr_20rem] gap-x-6 [color:_#404040] mb-6">
        <ManifestSummaryTile />
        <CalendarWidgetTile year={2023} month="October" />
      </section>
      <section className="grid grid-cols-[1fr_38rem] gap-x-6 [color:_#404040] mb-6">
        <RecentClusterTile />
        <RecentAddedManifestTile />
      </section>
      <section className="grid grid-cols-[1fr_55rem] gap-x-6 [color:_#404040]">
        <RecentNotificationTile />
        <ManifestHistoryTile />
      </section>
    </DriverLayout>
  )
}

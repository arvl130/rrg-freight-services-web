"use client"

import { WarehouseLayout } from "@/layouts/warehouse"
import { useSession } from "@/utils/auth"
import { ArrowClockwise } from "@phosphor-icons/react/ArrowClockwise"
import { ArrowsOutLineHorizontal } from "@phosphor-icons/react/ArrowsOutLineHorizontal"
import { CalendarBlank } from "@phosphor-icons/react/CalendarBlank"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { FunnelSimple } from "@phosphor-icons/react/FunnelSimple"
import { ArrowsInLineHorizontal } from "@phosphor-icons/react/ArrowsInLineHorizontal"
import { Package } from "@phosphor-icons/react/Package"

function WarehousePackagesTile() {
  return (
    <article
      className="
        text-[#29727C]
        grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
        bg-gradient-to-b from-[#79CFDCCC] to-[#79CFDC00]
      "
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">120</p>
        <p>Warehouse Packages</p>
      </div>
      <div>
        <Package size={96} />
      </div>
    </article>
  )
}

function IncomingPackageTile() {
  return (
    <article
      className="
  text-[#C61717]
  grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
  bg-gradient-to-b from-[#ED5959CC] to-[#ED595900]
"
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">120</p>
        <p>Incoming Packages</p>
      </div>
      <div>
        <ArrowsInLineHorizontal size={96} />
      </div>
    </article>
  )
}

function OutgoingPackageTile() {
  return (
    <article
      className="
  text-[#AC873C]
  grid grid-cols-[1fr_6rem] shadow-md px-8 py-6 rounded-lg
  bg-gradient-to-b from-[#EDAD3E80] to-[#EDAD3E00]
"
    >
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-semibold">120</p>
        <p>Shipments shipped</p>
      </div>
      <div>
        <ArrowsOutLineHorizontal size={96} />
      </div>
    </article>
  )
}

function RecentActivityTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem] col-span-2 ">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Recent Activity</h2>
          <p className="flex items-center">
            See more <CaretRight size={16} />
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="text-sm">
        <table className="min-w-full	">
          <thead className="text-gray-400">
            <tr>
              <th className="font-light	">ID</th>
              <th className="font-light	">Sender</th>
              <th className="font-light	">Date Issued</th>
              <th className="font-light	">Status</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "13px" }} className="text-center	">
            <tr style={{ height: "50px" }} className="">
              <td>12345562</td>
              <td>John Doe</td>
              <td>Oct 12, 2023</td>
              <td>
                <div
                  style={{ backgroundColor: "#F17834", borderRadius: "10px" }}
                  className="min-w-min py-1 text-white	"
                >
                  Out for Delivery
                </div>
              </td>
            </tr>
            <tr style={{ height: "50px" }} className="">
              <td>12345562</td>
              <td>John Doe</td>
              <td>Oct 12, 2023</td>
              <td>
                <div
                  style={{ backgroundColor: "#F17834", borderRadius: "10px" }}
                  className="min-w-min py-1 text-white	"
                >
                  Out for Delivery
                </div>
              </td>
            </tr>
            <tr style={{ height: "50px" }} className="">
              <td>12345562</td>
              <td>John Doe</td>
              <td>Oct 12, 2023</td>
              <td>
                <div
                  style={{ backgroundColor: "#F17834", borderRadius: "10px" }}
                  className="min-w-min py-1 text-white	"
                >
                  Out for Delivery
                </div>
              </td>
            </tr>
            <tr style={{ height: "50px" }} className="">
              <td>12345562</td>
              <td>John Doe</td>
              <td>Oct 12, 2023</td>
              <td>
                <div
                  style={{ backgroundColor: "#F17834", borderRadius: "10px" }}
                  className="min-w-min py-1 text-white	"
                >
                  Out for Delivery
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  )
}

function IncomingPackageSummaryTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Incoming Package Summary</h2>
          <p className="flex items-center">
            See more <CaretRight size={16} />
          </p>
        </div>
      </div>
      <table className="min-w-full text-left	">
        <thead>
          <tr>
            <th className="font-light text-sm text-gray-400	">Origin Country</th>
            <th className="font-light text-sm text-gray-400	">Completed Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hong Kong</td>
            <td>October 1, 2023 19:01</td>
          </tr>
          <tr>
            <td>Hong Kong</td>
            <td>October 1, 2023 19:01</td>
          </tr>
          <tr>
            <td>Hong Kong</td>
            <td>October 1, 2023 19:01</td>
          </tr>
        </tbody>
      </table>
    </article>
  )
}

function BarGraphTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Bar Graph</h2>
        </div>
      </div>
    </article>
  )
}

function RecentNotifTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Recent Notification</h2>
        </div>
      </div>
    </article>
  )
}

function CalendarTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Calendar</h2>
        </div>
      </div>
    </article>
  )
}

export default function DashboardPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "WAREHOUSE",
    },
  })

  if (isLoading || role !== "WAREHOUSE") return <>...</>

  return (
    <WarehouseLayout title="Dashboard">
      <h1 className="text-3xl font-black [color:_#00203F] mb-4">Dashboard</h1>
      <section className="mb-6">
        <div className="mb-4 flex justify-end gap-3">
          <div className="flex text-sm">
            <input
              type="date"
              className="rounded-l-md border-y border-l border-gray-300 pl-2"
            />
            <span className="bg-brand-cyan-500 text-white h-10 aspect-square flex justify-center items-center rounded-r-md">
              <CalendarBlank size={24} />
            </span>
          </div>

          <button
            type="button"
            className="bg-brand-cyan-500 text-white h-10 aspect-square flex justify-center items-center rounded-md"
          >
            <span className="sr-only">Refresh</span>
            <ArrowClockwise size={24} />
          </button>

          <button
            type="button"
            className="bg-brand-cyan-500 text-white h-10 aspect-square flex justify-center items-center rounded-md"
          >
            <span className="sr-only">Filter</span>
            <FunnelSimple size={24} />
          </button>
        </div>

        <div className="grid grid-cols-[repeat(3,_minmax(0,_24rem))] gap-x-11">
          <WarehousePackagesTile />
          <IncomingPackageTile />
          <OutgoingPackageTile />
        </div>
      </section>

      <section className="grid grid-cols-3 gap-x-11 [color:_#404040] mb-6">
        <RecentActivityTile />
        <IncomingPackageSummaryTile />
      </section>

      <section className="grid grid-cols-3 gap-x-11 [color:_#404040]">
        <BarGraphTile />
        <RecentNotifTile />
        <CalendarTile />
      </section>
    </WarehouseLayout>
  )
}

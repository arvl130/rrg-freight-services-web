import { AdminLayout } from "@/layouts/admin"
import { ArrowClockwise } from "@phosphor-icons/react/ArrowClockwise"
import { Article } from "@phosphor-icons/react/Article"
import { CalendarBlank } from "@phosphor-icons/react/CalendarBlank"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { FunnelSimple } from "@phosphor-icons/react/FunnelSimple"
import { User } from "@phosphor-icons/react/User"
import { UsersThree } from "@phosphor-icons/react/UsersThree"
import { Package } from "@phosphor-icons/react/Package"
import { Pie, Bar } from "react-chartjs-2"

function PackagesInWarehouseTile() {
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
        <p>Packages in-warehouse</p>
      </div>
      <div>
        <Package size={96} />
      </div>
    </article>
  )
}

function ActiveUsersTile() {
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
        <p>Active users</p>
      </div>
      <div>
        <UsersThree size={96} />
      </div>
    </article>
  )
}

function ManifestsShippedTile() {
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
        <p>Manifests shipped</p>
      </div>
      <div>
        <Article size={96} />
      </div>
    </article>
  )
}

function RecentActivityTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem]">
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
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_6rem] text-gray-400 mb-1">
          <div>User</div>
          <div>Role</div>
          <div>Action</div>
        </div>
        {/* Body */}
        <div>
          <div className="grid grid-cols-[1fr_1fr_6rem]">
            <div className="grid grid-cols-[2rem_1fr] gap-2">
              <div className="bg-gray-200 flex justify-center items-center h-8 rounded-md">
                <User size={16} />
              </div>
              <div className="flex items-center">John Doe</div>
            </div>
            <div className="flex items-center text-gray-400">
              Warehouse Staff
            </div>
            <div className="flex justify-center items-center uppercase bg-yellow-600 text-white rounded-md">
              Updated
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function DeliverySummaryTile() {
  const labels = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ]

  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem]">
      <h2 className="font-semibold mb-2">Delivery Summary</h2>
      <Bar
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
          scales: {
            y: {
              suggestedMax: 400,
              ticks: {
                // forces step size to be 100 units
                stepSize: 100,
              },
            },
          },
        }}
        data={{
          labels,
          datasets: [
            {
              label: "Dataset 1",
              data: [10, 200, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        }}
      />
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
          <div>Col 3</div>
          <div>Col 4</div>
          <div>Col 5</div>
        </div>
      </div>
    </article>
  )
}

function UserStatusTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <h2 className="font-semibold mb-2">User Status</h2>
      <Pie
        options={{
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        }}
        data={{
          labels: ["Active", "Inactive"],
          datasets: [
            {
              label: "# of Users",
              data: [50, 50],
              backgroundColor: [
                "rgba(112, 48, 160, 1.0)",
                "rgba(192, 0, 0, 1.0)",
              ],
            },
          ],
        }}
      />
    </article>
  )
}

export default function DashboardPage() {
  return (
    <AdminLayout title="Dashboard">
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

        <div className="grid grid-cols-[repeat(3,_minmax(0,_24rem))] gap-x-8">
          <PackagesInWarehouseTile />
          <ActiveUsersTile />
          <ManifestsShippedTile />
        </div>
      </section>

      <section className="grid grid-cols-[24rem_1fr] gap-x-6 [color:_#404040] mb-6">
        <RecentActivityTile />
        <DeliverySummaryTile />
      </section>

      <section className="grid grid-cols-[1fr_20rem] gap-x-6 [color:_#404040]">
        <ManifestSummaryTile />
        <UserStatusTile />
      </section>
    </AdminLayout>
  )
}

import { AdminLayout } from "@/layouts/admin"
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import { Export } from "@phosphor-icons/react/Export"
import { UserCircle } from "@phosphor-icons/react/UserCircle"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"

function PageHeader() {
  return (
    <div className="flex justify-between mb-6">
      <h1 className="text-2xl font-black [color:_#00203F]">Activity Logs</h1>
    </div>
  )
}

const activities = [
  {
    id: 1,
    displayName: "John Doe",
    ipAddress: "192.168.16.32",
    role: "WAREHOUSE",
    timestamp: "9/25/2023 10:42:01",
    action: "UPDATED",
    description: "Update package",
  },
]

export default function ActivityLogsPage() {
  return (
    <AdminLayout title="Activity Logs">
      <PageHeader />
      <div className="flex justify-between gap-3 bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 mb-6">
        <div className="grid grid-cols-[1fr_2.25rem] h-[2.375rem]">
          <input
            type="text"
            className="rounded-l-lg px-3 border-l border-y border-brand-cyan-500 py-1.5 text-sm"
            placeholder="Quick search"
          />
          <button
            type="button"
            className="text-white bg-brand-cyan-500 flex justify-center items-center rounded-r-lg border-r border-y border-brand-cyan-500"
          >
            <span className="sr-only">Search</span>
            <MagnifyingGlass size={16} />
          </button>
        </div>
        <div className="flex gap-3 text-sm">
          <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
            <option value="">Filter by role ...</option>
          </select>
          <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
            <option value="">All actions</option>
          </select>
          <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
            <option value="">Any date</option>
          </select>
          <button
            type="button"
            className="bg-white border border-gray-300 px-3 py-1.5 rounded-md text-gray-400 font-medium"
          >
            Clear Filter
          </button>
        </div>
        <div className="flex gap-3 text-sm">
          <button
            type="button"
            className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium"
          >
            <DownloadSimple size={16} />
            <span>Import</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium"
          >
            <Export size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      <div className="bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 min-h-[36rem]">
        <div className="flex justify-between mb-3">
          <h2 className="text-lg font-semibold">Action Summary</h2>
          <div className="flex gap-8">
            <div>
              Showing{" "}
              <select className="bg-white border border-gray-300 px-2 py-1 w-16">
                <option>All</option>
              </select>{" "}
              entries
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CaretLeft size={16} />
              <CaretDoubleLeft size={16} />
              <button
                type="button"
                className="bg-brand-cyan-500 text-white w-6 h-6 rounded-md"
              >
                1
              </button>
              <button type="button" className="text-gray-400">
                2
              </button>
              <button type="button" className="text-gray-400">
                3
              </button>
              <button type="button" className="text-gray-400">
                4
              </button>
              <span className="text-gray-400">...</span>
              <button type="button" className="text-gray-400">
                10
              </button>
              <CaretRight size={16} />
              <CaretDoubleRight size={16} />
            </div>
          </div>
        </div>
        {/* Table */}
        <div>
          {/* Header */}
          <div className="grid grid-cols-6 border-y border-gray-300 font-medium">
            <div className="uppercase px-4 py-2">Name</div>
            <div className="uppercase px-4 py-2">IP Address</div>
            <div className="uppercase px-4 py-2">Role</div>
            <div className="uppercase px-4 py-2">Date & Time</div>
            <div className="uppercase px-4 py-2">Action</div>
            <div className="uppercase px-4 py-2">Description</div>
          </div>
          {/* Body */}
          <div>
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="grid grid-cols-6 border-b border-gray-300 text-sm"
              >
                <div className="px-4 py-2 flex items-center gap-1">
                  <UserCircle size={24} />
                  <span>{activity.displayName}</span>
                </div>
                <div className="px-4 py-2 flex items-center">
                  {activity.ipAddress}
                </div>
                <div className="px-4 py-2 flex items-center">
                  {activity.role}
                </div>
                <div className="px-4 py-2 flex items-center">
                  {activity.timestamp}
                </div>
                <div className="px-4 py-2 flex items-center">
                  <div className="px-2 py-1 bg-yellow-500 text-white rounded-md">
                    {activity.action}
                  </div>
                </div>
                <div className="px-4 py-2 flex items-center gap-2">
                  <div>Updated package</div>
                  <button type="button">
                    <span className="sr-only">Actions</span>
                    <DotsThree size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

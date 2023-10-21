import { AdminLayout } from "@/layouts/admin"
import { useSession } from "@/utils/auth"
import { Plus } from "@phosphor-icons/react/Plus"
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
    <div className="flex justify-between mb-4">
      <h1 className="text-3xl font-black [color:_#00203F] mb-4">Users</h1>
      <div className="grid">
        <button
          type="button"
          className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium mt-auto"
        >
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </div>
    </div>
  )
}

const users = [
  {
    id: 1,
    displayName: "John Doe",
    emailAddress: "johndoe@gmail.com",
    role: "ADMIN",
    isEnabled: true,
  },
  {
    id: 2,
    displayName: "John Doe",
    emailAddress: "johndoe@gmail.com",
    role: "SENDER",
    isEnabled: true,
  },
  {
    id: 3,
    displayName: "John Doe",
    emailAddress: "johndoe@gmail.com",
    role: "RECEIVER",
    isEnabled: true,
  },
  {
    id: 4,
    displayName: "John Doe",
    emailAddress: "johndoe@gmail.com",
    role: "WAREHOUSE",
    isEnabled: true,
  },
  {
    id: 5,
    displayName: "John Doe",
    emailAddress: "johndoe@gmail.com",
    role: "WAREHOUSE",
    isEnabled: false,
  },
  {
    id: 6,
    displayName: "John Doe",
    emailAddress: "johndoe@gmail.com",
    role: "SENDER",
    isEnabled: true,
  },
]

export default function UsersPage() {
  return (
    <AdminLayout title="Users">
      {() => (
        <>
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
                <option value="">Role</option>
              </select>
              <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
                <option value="">Permission</option>
              </select>
              <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
                <option value="">Status</option>
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
              <h2 className="text-2xl font-semibold">User Summary</h2>
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
              <div className="grid grid-cols-4 border-y border-gray-300 font-medium">
                <div className="uppercase px-4 py-2">Name</div>
                <div className="uppercase px-4 py-2">Email</div>
                <div className="uppercase px-4 py-2">Role</div>
                <div className="uppercase px-4 py-2">Status</div>
              </div>
              {/* Body */}
              <div>
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-4 border-b border-gray-300 text-sm"
                  >
                    <div className="px-4 py-2 flex items-center gap-1">
                      <UserCircle size={24} />
                      <span>{user.displayName}</span>
                    </div>
                    <div className="px-4 py-2 flex items-center">
                      {user.emailAddress}
                    </div>
                    <div className="px-4 py-2 flex items-center">
                      {user.role}
                    </div>
                    <div className="px-4 py-2 flex items-center gap-2">
                      <div
                        className={`
                      text-white rounded-md px-4 py-1 w-24 text-center
                      ${user.isEnabled ? "bg-green-500" : "bg-red-500"}
                    `}
                      >
                        {user.isEnabled ? "ACTIVE" : "INACTIVE"}
                      </div>
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
        </>
      )}
    </AdminLayout>
  )
}

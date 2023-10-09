import { OverseasLayout } from "@/layouts/overseas"
import { useSession } from "@/utils/auth"
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
      <h1 className="text-3xl font-black [color:_#00203F]">Cluster List</h1>
    </div>
  )
}

const shipments = [
  {
    id: 1000000,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },
    receiver: {
      name: "John Dela Cruz",
      address: "25 Brgy. Gulod Novaliches Quezon City",
    },
    date: "2023-10-01 10:15",
    shipped: "Ship Freight",
  },
  {
    id: 1000001,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },
    receiver: {
      name: "John Dela Cruz",
      address: "25 Brgy. Gulod Novaliches Quezon City",
    },
    date: "2023-10-01 10:15",
    shipped: "Ship Freight",
    action: {
      view: "View",
      edit: "Edit",
      archieve: "Archieve",
    },
  },
  {
    id: 1000002,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },
    receiver: {
      name: "John Dela Cruz",
      address: "25 Brgy. Gulod Novaliches Quezon City",
    },
    date: "2023-10-01 10:15",
    shipped: "Ship Freight",
    action: {
      view: "View",
      edit: "Edit",
      archieve: "Archieve",
    },
  },
  {
    id: 1000003,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },
    receiver: {
      name: "John Dela Cruz",
      address: "25 Brgy. Gulod Novaliches Quezon City",
    },
    date: "2023-10-01 10:15",
    shipped: "Ship Freight",
    action: {
      view: "View",
      edit: "Edit",
      archieve: "Archieve",
    },
  },
  {
    id: 1000004,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },
    receiver: {
      name: "John Dela Cruz",
      address: "25 Brgy. Gulod Novaliches Quezon City",
    },
    date: "2023-10-01 10:15",
    shipped: "Ship Freight",
    action: {
      view: "View",
      edit: "Edit",
      archieve: "Archieve",
    },
  },
  {
    id: 1000005,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },
    receiver: {
      name: "John Dela Cruz",
      address: "25 Brgy. Gulod Novaliches Quezon City",
    },
    date: "2023-10-01 10:15",
    shipped: "Ship Freight",
    action: {
      view: "View",
      edit: "Edit",
      archieve: "Archieve",
    },
  },
  {
    id: 1000006,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },
    receiver: {
      name: "John Dela Cruz",
      address: "25 Brgy. Gulod Novaliches Quezon City",
    },
    date: "2023-10-01 10:15",
    shipped: "Ship Freight",
    action: {
      view: "View",
      edit: "Edit",
      archieve: "Archieve",
    },
  },
  {
    id: 1000007,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },
    receiver: {
      name: "John Dela Cruz",
      address: "25 Brgy. Gulod Novaliches Quezon City",
    },
    date: "2023-10-01 10:15",
    shipped: "Ship Freight",
  },
]

export default function UsersPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "OVERSEAS_AGENT",
    },
  })

  if (isLoading || role !== "OVERSEAS_AGENT") return <>...</>

  return (
    <OverseasLayout title="Shipments">
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
          <button
            type="button"
            className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium"
          >
            <span>Create New</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium"
          >
            <span>Archived Cluster</span>
          </button>
        </div>
      </div>
      <div className="bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 min-h-[36rem]">
        <div className="flex justify-between mb-3">
          <div className="flex gap-6">
            <h2 className="text-2xl font-semibold text-brand-cyan-500 pb-1 border-b-2 border-brand-cyan-500">
              All Clusters
            </h2>
          </div>
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
            <div className="uppercase px-4  py-2 flex gap-2">
              <input type="checkbox" name="" id="" />
              <span>Cluster ID</span>
            </div>
            <div className="uppercase px-4  py-2">Sender Agent </div>
            <div className="uppercase px-4  py-2">Receiver Agent</div>
            <div className="uppercase px-4  py-2">Date Added</div>
            <div className="uppercase px-4  py-2">Shipped Via</div>
            <div className="uppercase px-12  py-2">Action</div>
          </div>
          {/* Body */}
          <div>
            {shipments.map((_shipment) => (
              <div
                key={_shipment.id}
                className="grid grid-cols-6 border-b border-gray-300 text-sm"
              >
                <div className="px-4 py-2 flex items-center gap-2  ">
                  <input type="checkbox" name="" id="" />
                  <span>{_shipment.id}</span>
                </div>
                <div className="px-4 py-2">
                  <div>{_shipment.sender.name}</div>
                  <div className="text-gray-400">
                    {_shipment.sender.address}
                  </div>
                </div>
                <div className=" px-4 py-2">
                  <div>{_shipment.receiver.name}</div>
                  <div className="text-gray-400">
                    {_shipment.receiver.address}
                  </div>
                </div>
                <div className="px-4 py-2">
                  <div>{_shipment.date}</div>
                </div>
                <div className="px-4 py-2">
                  <div>{_shipment.shipped}</div>
                </div>
                <div className="flex gap-2">
                  <div className="  py-2">
                    <button className="bg-[#4B61D7] text-white text-md rounded-md text-center p-2">
                      View
                    </button>
                  </div>
                  <div className=" py-2">
                    <button className="bg-[#65DB7F] text-white text-md rounded-md text-center p-2">
                      Edit
                    </button>
                  </div>
                  <div className="  py-2">
                    <button className="bg-[#D64D4D] text-white text-md rounded-md text-center p-2">
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OverseasLayout>
  )
}

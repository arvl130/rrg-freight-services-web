import { DomesticLayout } from "@/layouts/domestic"
import { useSession } from "@/utils/auth"
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import { Export } from "@phosphor-icons/react/Export"
import { UserCircle } from "@phosphor-icons/react/UserCircle"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"
import { Package } from "@phosphor-icons/react/Package"
import { Printer } from "@phosphor-icons/react/Printer"
import { useState } from "react"

function PageHeader() {
  return (
    <div className="flex justify-between mb-6">
      <h1 className="text-3xl font-black [color:_#00203F]">Packages</h1>
    </div>
  )
}

const packages = [
  {
    id: 1230495,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },

    status: "Delivered",
  },
  {
    id: 1230495,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },

    status: "Delivered",
  },
  {
    id: 1230495,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },

    status: "Delivered",
  },
  {
    id: 1230495,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },

    status: "Delivered",
  },
  {
    id: 1230495,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },

    status: "Delivered",
  },
  {
    id: 1230495,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },

    status: "Delivered",
  },
  {
    id: 1230495,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },

    status: "Delivered",
  },
  {
    id: 1230495,
    sender: {
      name: "John Doe",
      address: "48 Howard Dr. Ocoee, FL 34761",
    },
    status: "Delivered",
  },
]

export default function UsersPage() {
  const { isLoading, role } = useSession({
    required: {
      role: "DOMESTIC_AGENT",
    },
  })

  const [selectedTab, setSelectedTab] = useState<"ALL" | "ARCHIVED">("ALL")

  if (isLoading || role !== "DOMESTIC_AGENT") return <>...</>

  return (
    <DomesticLayout title="Packages">
      <div className="flex justify-between mb-6">
        {selectedTab === "ALL" ? (
          <>
            <h1 className="text-3xl font-black [color:_#00203F]">
              Package & Manifest List
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-black [color:_#00203F]">
              Archived Manifest
            </h1>
          </>
        )}
      </div>
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
            <option value="">Status</option>
          </select>
          <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
            <option value="">Warehouse</option>
          </select>
          <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
            <option value="">City</option>
          </select>
          <button
            type="button"
            className="bg-white border border-gray-300 px-3 py-1.5 rounded-md text-gray-400 font-medium"
          >
            Clear Filter
          </button>
        </div>
        <div className="flex gap-3 text-sm">
          {selectedTab === "ALL" ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
      <div className="bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 min-h-[36rem]">
        <div className="flex justify-between mb-3">
          <div className="flex gap-6">
            {selectedTab === "ALL" ? (
              <>
                <button
                  className="text-2xl font-semibold  text-brand-cyan-500 pb-1 border-b-2  border-brand-cyan-500"
                  onClick={() => setSelectedTab("ALL")}
                >
                  All Manifest
                </button>
                <button
                  className="text-2xl text-gray-400 pb-1"
                  type="button"
                  onClick={() => setSelectedTab("ARCHIVED")}
                >
                  Archived Manifests
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="text-2xl text-gray-400 pb-1"
                  onClick={() => setSelectedTab("ALL")}
                >
                  All Manifest
                </button>
                <button className="text-2xl font-semibold border-b-2  text-brand-cyan-500 border-brand-cyan-500 pb-1">
                  Archived Manifests
                </button>
              </>
            )}
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
          <div className="grid grid-cols-4 border-y border-gray-300 font-medium">
            <div className="uppercase px-4 py-2 flex gap-1">
              <input type="checkbox" name="" id="" />
              <span>Manifest ID</span>
            </div>
            <div className="uppercase px-4 py-2">Sender</div>
            <div className="px-4 py-2"></div>
            <div className="uppercase px-4 py-2">Status</div>
          </div>
          {/* Body */}
          {selectedTab === "ALL" ? (
            <div>
              {packages.map((_package) => (
                <div
                  key={_package.id}
                  className="grid grid-cols-4 border-b border-gray-300 text-sm"
                >
                  <div className="px-4 py-2 flex items-center gap-1">
                    <input type="checkbox" name="" id="" />
                    <span>{_package.id}</span>
                  </div>
                  <div className="px-4 py-2">
                    <div>{_package.sender.name}</div>
                    <div className="text-gray-400">
                      {_package.sender.address}
                    </div>
                  </div>
                  <div className="px-4 py-2"></div>
                  <div className="px-4 py-2 flex items-center gap-2">
                    <div
                      className={`
                      w-36 py-0.5 text-white text-center rounded-md
                      ${_package.status === "Preparing" ? "bg-gray-400" : ""}
                      ${_package.status === "Shipped Out" ? "bg-blue-500" : ""}
                      ${_package.status === "In Warehouse" ? "bg-pink-500" : ""}
                      ${
                        _package.status === "Prepared by Agent"
                          ? "bg-pink-500"
                          : ""
                      }
                      ${_package.status === "Delivered" ? "bg-green-500" : ""}
                      ${
                        _package.status === "Out for Delivery"
                          ? "bg-orange-500"
                          : ""
                      }
                  `}
                    >
                      {_package.status}
                    </div>
                    <button type="button">
                      <span className="sr-only">Actions</span>
                      <DotsThree size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div>
                {packages.map((_package) => (
                  <div
                    key={_package.id}
                    className="grid grid-cols-4 border-b border-gray-300 text-sm"
                  >
                    <div className="px-4 py-2 flex items-center gap-1">
                      <div>{_package.id}</div>
                    </div>
                    <div className="px-4 py-2">
                      <div>{_package.sender.name}</div>
                      <div className="text-gray-400">
                        {_package.sender.address}
                      </div>
                    </div>
                    <div className="px-4 py-2"></div>
                    <div className="px-4 py-2 flex items-center gap-2">
                      <div
                        className={`
                      w-36 py-0.5 text-white text-center rounded-md
                      ${_package.status === "Preparing" ? "bg-gray-400" : ""}
                      ${_package.status === "Shipped Out" ? "bg-blue-500" : ""}
                      ${_package.status === "In Warehouse" ? "bg-pink-500" : ""}
                      ${
                        _package.status === "Prepared by Agent"
                          ? "bg-pink-500"
                          : ""
                      }
                      ${_package.status === "Delivered" ? "bg-green-500" : ""}
                      ${
                        _package.status === "Out for Delivery"
                          ? "bg-orange-500"
                          : ""
                      }
                  `}
                      >
                        {_package.status}
                      </div>
                      <button type="button">
                        <span className="sr-only">Actions</span>
                        <DotsThree size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DomesticLayout>
  )
}

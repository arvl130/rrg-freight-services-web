import { AdminLayout } from "@/layouts/admin"
import { useSession } from "@/utils/auth"
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import { Export } from "@phosphor-icons/react/Export"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"
import { Vehicle } from "@/server/db/entities"
import { getColorFromPackageStatus } from "@/utils/colors"
import { api } from "@/utils/api"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

function PageHeader() {
  return (
    <div className="flex justify-between mb-4">
      <h1 className="text-2xl font-black [color:_#00203F] mb-2">Vehicles</h1>
    </div>
  )
}

function VehicleTableItem({ vehicle }: { vehicle: Vehicle }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "EDIT_DETAILS" | "EDIT_STATUS" | "VIEW_WAYBILL"
  >(null)

  return (
    <>
      <div className="grid grid-cols-5 border-b border-gray-300 text-sm">
        <div className="px-4 py-2 flex items-center gap-1">
          <input type="checkbox" name="" id="" />
          <span>{vehicle.id}</span>
        </div>
        <div className="px-4 py-2">{vehicle.displayName}</div>
        <div className="px-4 py-2">{vehicle.type}</div>
        <div className="px-4 py-2">N/A</div>
        <div className="px-4 py-2 flex items-center gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button type="button">
                <span className="sr-only">Actions</span>
                <DotsThree size={16} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white rounded-lg drop-shadow-lg text-sm">
                <DropdownMenu.Item
                  className="transition-colors hover:bg-sky-50 px-3 py-2"
                  onClick={() => setVisibleModal("VIEW_DETAILS")}
                >
                  View Details
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="transition-colors hover:bg-sky-50 px-3 py-2"
                  onClick={() => setVisibleModal("EDIT_DETAILS")}
                >
                  Edit Details
                </DropdownMenu.Item>
                <DropdownMenu.Arrow className="fill-white" />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </>
  )
}

function VehiclesTable({
  vehicles,
  isArchived,
}: {
  vehicles: Vehicle[]
  isArchived: boolean
}) {
  return (
    <div className="bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 min-h-[36rem]">
      <div className="flex justify-between mb-3">
        <div className="flex gap-3"></div>
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
        <div className="grid grid-cols-5 border-y border-gray-300 font-medium">
          <div className="uppercase px-4 py-2 flex gap-1">
            <input type="checkbox" name="" id="" />
            <span>Vehicle ID</span>
          </div>
          <div className="uppercase px-4 py-2">Display Name</div>
          <div className="uppercase px-4 py-2">Type</div>
          <div className="uppercase px-4 py-2">Assigned To</div>
          <div className="uppercase px-4 py-2"></div>
        </div>
        {/* Body */}
        {vehicles.length === 0 ? (
          <div className="text-center pt-4">No packages found.</div>
        ) : (
          <div>
            {vehicles.map((vehicle) => (
              <VehicleTableItem key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function VehiclesPage() {
  const { user, role } = useSession()
  const {
    isLoading,
    isError,
    data: vehicles,
  } = api.vehicle.getAll.useQuery(undefined, {
    enabled: user !== null && role === "ADMIN",
  })
  const [isOpenImportModal, setIsOpenImportModal] = useState(false)
  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

  return (
    <AdminLayout title="Packages">
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
            <option value="">Status</option>
          </select>
          <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
            <option value="">Warehouse</option>
          </select>
          <select
            className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium"
            value={visibleArchiveStatus}
            onChange={(e) => {
              if (e.currentTarget.value === "ARCHIVED")
                setVisibleArchiveStatus("ARCHIVED")
              else setVisibleArchiveStatus("NOT_ARCHIVED")
            }}
          >
            <option value="NOT_ARCHIVED">Not Archived</option>
            <option value="ARCHIVED">Archived</option>
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
            className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium invisible"
            onClick={() => setIsOpenImportModal(true)}
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
      {isLoading ? (
        <div className="flex justify-center pt-4">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {isError ? (
            <>Error :{"("}</>
          ) : (
            <VehiclesTable
              vehicles={vehicles}
              isArchived={visibleArchiveStatus === "ARCHIVED"}
            />
          )}
        </>
      )}
    </AdminLayout>
  )
}

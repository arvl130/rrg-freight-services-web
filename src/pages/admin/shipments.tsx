import { AdminLayout } from "@/layouts/admin"
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import { Export } from "@phosphor-icons/react/Export"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { Shipment, ShipmentHub } from "@/server/db/entities"
import { getColorFromShipmentStatus } from "@/utils/colors"
import { useState } from "react"
import { DateTime } from "luxon"
import { useSession } from "@/utils/auth"
import { Plus } from "@phosphor-icons/react/Plus"
import { ShipmentsCreateModal } from "@/components/shipments/create-modal"

function PageHeader() {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)

  return (
    <div className="flex justify-between mb-4">
      <h1 className="text-3xl font-black [color:_#00203F]">Shipments</h1>
      <div className="grid">
        <button
          type="button"
          className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium mt-auto"
          onClick={() => setIsOpenCreateModal(true)}
        >
          <Plus size={16} />
          <span>Create Shipment</span>
        </button>
      </div>
      <ShipmentsCreateModal
        isOpen={isOpenCreateModal}
        close={() => setIsOpenCreateModal(false)}
      />
    </div>
  )
}

function ShipmentArrivedDate({ shipmentId }: { shipmentId: number }) {
  const {
    isLoading,
    isError,
    data: shipmentStatusLog,
  } = api.shipment.getLatestArrivedStatus.useQuery({
    id: shipmentId,
  })

  if (isLoading)
    return (
      <div className="w-36 py-0.5 text-white text-center rounded-md">...</div>
    )

  if (isError)
    return (
      <div className="w-36 py-0.5 text-white text-center rounded-md">error</div>
    )

  if (shipmentStatusLog === null)
    return <div className="w-36 py-0.5 rounded-md">N/A</div>

  return (
    <div className="w-36 py-0.5 rounded-md">
      {DateTime.fromJSDate(shipmentStatusLog.createdAt).toLocaleString(
        DateTime.DATETIME_FULL,
      )}
    </div>
  )
}

function ShipmentStatus({ shipmentId }: { shipmentId: number }) {
  const {
    isLoading,
    isError,
    data: shipmentStatusLog,
  } = api.shipment.getLatestStatus.useQuery({
    id: shipmentId,
  })

  if (isLoading)
    return (
      <div className="w-36 py-0.5 text-white text-center rounded-md">...</div>
    )

  if (isError)
    return (
      <div className="w-36 py-0.5 text-white text-center rounded-md">error</div>
    )

  if (shipmentStatusLog === null)
    return (
      <div className="w-36 py-0.5 text-white text-center rounded-md">n/a</div>
    )

  return (
    <div
      className={`
        w-36 py-0.5 text-white text-center rounded-md
        ${getColorFromShipmentStatus(shipmentStatusLog.status)}
      `}
    >
      {shipmentStatusLog.status.replaceAll("_", " ")}
    </div>
  )
}

function ShipmentTableItem({
  shipment,
}: {
  shipment: Shipment & {
    originHub: ShipmentHub
    destinationHub: ShipmentHub | null
  }
}) {
  return (
    <div className="grid grid-cols-5 border-b border-gray-300 text-sm">
      <div className="px-4 py-2 flex items-center gap-1">
        <input type="checkbox" name="" id="" />
        <span>{shipment.id}</span>
      </div>
      <div className="px-4 py-2">
        <div>{shipment.originHub.displayName}</div>
        <div className="text-gray-400">
          <p>{shipment.originHub.city}</p>
          <p>{shipment.originHub.stateOrProvince}</p>
          <p>
            {shipment.originHub.countryCode} {shipment.originHub.postalCode}
          </p>
        </div>
      </div>
      {shipment.destinationHub ? (
        <div className="px-4 py-2">
          <div>{shipment.destinationHub.displayName}</div>
          <div className="text-gray-400">
            <p>{shipment.destinationHub.city}</p>
            <p>{shipment.destinationHub.stateOrProvince}</p>
            <p>
              {shipment.destinationHub.countryCode}{" "}
              {shipment.destinationHub.postalCode}
            </p>
          </div>
        </div>
      ) : (
        <div className="px-4 py-2">Receiver Address</div>
      )}
      <div className="px-4 py-2 flex items-center gap-2">
        <ShipmentArrivedDate shipmentId={shipment.id} />
      </div>
      <div className="px-4 py-2 flex items-center gap-2">
        <ShipmentStatus shipmentId={shipment.id} />
        <button type="button">
          <span className="sr-only">Actions</span>
          <DotsThree size={16} />
        </button>
      </div>
    </div>
  )
}

function ShipmentsTable({
  shipments,
}: {
  shipments: (Shipment & {
    originHub: ShipmentHub
    destinationHub: ShipmentHub | null
  })[]
}) {
  const [selectedTab, setSelectedTab] = useState<"ALL" | "ARCHIVED">("ALL")
  const allShipments = shipments.filter((shipment) => shipment.isArchived === 0)
  const archivedShipments = shipments.filter(
    (shipment) => shipment.isArchived === 1,
  )

  return (
    <div className="bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 min-h-[36rem]">
      <div className="flex justify-between mb-3">
        <div className="flex gap-6">
          <button
            type="button"
            className={`
              text-lg pb-1 font-semibold border-b-2
              ${
                selectedTab === "ALL"
                  ? "text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
            onClick={() => setSelectedTab("ALL")}
          >
            All Shipments
          </button>
          <button
            type="button"
            className={`
              text-lg pb-1 font-semibold border-b-2
              ${
                selectedTab === "ARCHIVED"
                  ? "text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
            onClick={() => setSelectedTab("ARCHIVED")}
          >
            Archived Shipments
          </button>
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
        <div className="grid grid-cols-5 border-y border-gray-300 font-medium">
          <div className="uppercase px-4 py-2 flex gap-1">
            <input type="checkbox" name="" id="" />
            <span>Shipment ID</span>
          </div>
          <div className="uppercase px-4 py-2">Origin</div>
          <div className="uppercase px-4 py-2">Destination</div>
          <div className="uppercase px-4 py-2">Arrived Date</div>
          <div className="uppercase px-4 py-2">Status</div>
        </div>
        {/* Body */}
        {selectedTab === "ALL" ? (
          <>
            {allShipments.length === 0 ? (
              <div className="text-center pt-4">No shipments found.</div>
            ) : (
              <div>
                {allShipments.map((shipment) => (
                  <ShipmentTableItem key={shipment.id} shipment={shipment} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {archivedShipments.length === 0 ? (
              <div className="text-center pt-4">No shipments found.</div>
            ) : (
              <div>
                {archivedShipments.map((shipment) => (
                  <ShipmentTableItem key={shipment.id} shipment={shipment} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function ShipmentsPage() {
  const { user, role } = useSession()
  const {
    isLoading,
    isError,
    data: shipments,
  } = api.shipment.getAllWithOriginAndDestination.useQuery(undefined, {
    enabled: user !== null && role === "ADMIN",
  })

  return (
    <AdminLayout title="Shipments">
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
          <button
            type="button"
            className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium invisible"
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
            <ShipmentsTable shipments={shipments} />
          )}
        </>
      )}
    </AdminLayout>
  )
}

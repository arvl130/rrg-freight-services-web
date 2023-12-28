import { AdminLayout } from "@/layouts/admin"
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple"
import { Export } from "@phosphor-icons/react/Export"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { useState } from "react"
import { useSession } from "@/utils/auth"
import { Plus } from "@phosphor-icons/react/Plus"
import { DeliveryShipmentsCreateModal } from "@/components/delivery-shipments/create-modal"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"
import { DeliveryShipment, Shipment } from "@/server/db/entities"
import { DateTime } from "luxon"
import { getColorFromShipmentStatus } from "@/utils/colors"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import { ShipmentStatus } from "@/utils/constants"
import { DeliveryShipmentsViewLocationsModal } from "@/components/delivery-shipments/view-locations-modal"

function PageHeader() {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)

  return (
    <div className="flex justify-between mb-4">
      <h1 className="text-3xl font-black mb-2 [color:_#00203F]">Deliveries</h1>
      <div className="grid">
        <button
          type="button"
          className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium mt-auto"
          onClick={() => setIsOpenCreateModal(true)}
        >
          <Plus size={16} />
          <span>Create Delivery</span>
        </button>
      </div>
      <DeliveryShipmentsCreateModal
        isOpen={isOpenCreateModal}
        close={() => setIsOpenCreateModal(false)}
      />
    </div>
  )
}

function UserDisplayName({ userId }: { userId: string }) {
  const { status, data, error } = api.user.getById.useQuery({
    id: userId,
  })

  if (status === "loading") return <>...</>
  if (status === "error") return <>error: {error.message}</>

  return <>{data?.displayName}</>
}

function DeliveriesTableItem({
  delivery,
}: {
  delivery: Shipment & DeliveryShipment
}) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "VIEW_LOCATIONS"
  >(null)

  return (
    <div className="grid grid-cols-4 border-b border-gray-300 text-sm">
      <div className="px-4 py-2 flex items-center gap-1">
        <input type="checkbox" />
        <span>{delivery.id}</span>
      </div>
      <div className="px-4 py-2">
        <UserDisplayName userId={delivery.driverId} />
      </div>
      <div className="px-4 py-2">
        {DateTime.fromJSDate(delivery.createdAt).toLocaleString(
          DateTime.DATETIME_FULL,
        )}
      </div>
      <div className="px-4 py-2 flex items-center gap-2">
        <div
          className={`
        w-36 py-0.5 text-white text-center rounded-md
        ${getColorFromShipmentStatus(delivery.status as ShipmentStatus)}
      `}
        >
          {delivery.status.replaceAll("_", " ")}
        </div>

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
                onClick={() => setVisibleModal("VIEW_LOCATIONS")}
              >
                View Locations
              </DropdownMenu.Item>

              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <DeliveryShipmentsViewLocationsModal
          isOpen={visibleModal === "VIEW_LOCATIONS"}
          close={() => setVisibleModal(null)}
          delivery={delivery}
        />
      </div>
    </div>
  )
}

function DeliveriesTable({
  deliveries,
  isArchived,
}: {
  deliveries: (Shipment & DeliveryShipment)[]
  isArchived: boolean
}) {
  const [selectedTab, setSelectedTab] = useState<
    "EXPRESS" | "STANDARD" | "ALL"
  >("EXPRESS")

  const allDeliveries = isArchived
    ? deliveries.filter(({ isArchived }) => isArchived)
    : deliveries.filter(({ isArchived }) => !isArchived)

  const standardDeliveries = allDeliveries.filter(
    (delivery) => !delivery.isExpress,
  )

  const expressDeliveries = allDeliveries.filter(
    (delivery) => delivery.isExpress,
  )

  return (
    <div className="bg-white px-6 py-4 rounded-lg shadow-md shadow-brand-cyan-500 min-h-[36rem]">
      <div className="flex justify-between mb-3">
        <div className="flex gap-3">
          <button
            type="button"
            className={`
              text-lg pb-1 font-semibold border-b-2
              ${
                selectedTab === "EXPRESS"
                  ? "text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
            onClick={() => setSelectedTab("EXPRESS")}
          >
            Express
          </button>
          <button
            type="button"
            className={`
              text-lg pb-1 font-semibold border-b-2
              ${
                selectedTab === "STANDARD"
                  ? "text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
            onClick={() => setSelectedTab("STANDARD")}
          >
            Standard
          </button>
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
            All
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
        <div className="grid grid-cols-4 border-y border-gray-300 font-medium">
          <div className="uppercase px-4 py-2 flex gap-1">
            <input type="checkbox" name="" id="" />
            <span>Delivery ID</span>
          </div>
          <div className="uppercase px-4 py-2">Assigned To</div>
          <div className="uppercase px-4 py-2">Created At</div>
          <div className="uppercase px-4 py-2">Status</div>
        </div>
        {/* Body */}
        {selectedTab === "EXPRESS" && (
          <>
            {expressDeliveries.length === 0 ? (
              <div className="text-center pt-4">No deliveries found.</div>
            ) : (
              <div>
                {expressDeliveries.map((delivery) => (
                  <DeliveriesTableItem key={delivery.id} delivery={delivery} />
                ))}
              </div>
            )}
          </>
        )}
        {selectedTab === "STANDARD" && (
          <>
            {standardDeliveries.length === 0 ? (
              <div className="text-center pt-4">No deliveries found.</div>
            ) : (
              <div>
                {standardDeliveries.map((delivery) => (
                  <DeliveriesTableItem key={delivery.id} delivery={delivery} />
                ))}
              </div>
            )}
          </>
        )}
        {selectedTab === "ALL" && (
          <>
            {allDeliveries.length === 0 ? (
              <div className="text-center pt-4">No deliveries found.</div>
            ) : (
              <div>
                {allDeliveries.map((delivery) => (
                  <DeliveriesTableItem key={delivery.id} delivery={delivery} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function DeliveriesPage() {
  const { user, role } = useSession()
  const {
    status,
    data: deliveries,
    error,
  } = api.shipment.delivery.getAll.useQuery()
  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

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
      {status === "loading" && (
        <div className="flex justify-center pt-4">
          <LoadingSpinner />
        </div>
      )}
      {status === "error" && (
        <div className="flex justify-center pt-4">
          An error occured: {error.message}
        </div>
      )}
      {status === "success" && (
        <DeliveriesTable
          deliveries={deliveries}
          isArchived={visibleArchiveStatus === "ARCHIVED"}
        />
      )}
    </AdminLayout>
  )
}

import { WarehouseLayout } from "@/layouts/warehouse"
import { useSession } from "@/utils/auth"
import { Plus } from "@phosphor-icons/react/Plus"
import { Package } from "@phosphor-icons/react/Package"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple"
import { Export } from "@phosphor-icons/react/Export"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { ArrowsDownUp } from "@phosphor-icons/react/ArrowsDownUp"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import { Shipment, ShipmentHub } from "@/server/db/entities"
import { getColorFromShipmentStatus } from "@/utils/colors"
import { useState } from "react"
import { DateTime } from "luxon"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { ShipmentsViewQrCodeModal } from "@/components/shipments/view-qrcode-modal"
import { ShipmentsViewDetailsModal } from "@/components/shipments/view-details-modal"

function SearchBar() {
  return (
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
function ShipmentTableItem({
  shipment,
}: {
  shipment: Shipment & {
    originHub: ShipmentHub
    destinationHub: ShipmentHub | null
  }
}) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "VIEW_QRCODE"
  >(null)

  return (
    <tbody>
      <tr
        className=""
        style={{ height: "50px", borderBottom: "1px solid #C9C1C1" }}
      >
        <td className="	">
          <p>
            <input type="checkbox"></input> &nbsp; <span>{shipment.id}</span>
          </p>
        </td>
        <td>
          <h2 className="font-bold	">{shipment.originHub.displayName}</h2>
          <div style={{ fontSize: "11px" }} className="">
            <p>{shipment.originHub.city}</p>
            <p>{shipment.originHub.stateOrProvince}</p>
            <p>
              {shipment.originHub.countryCode} {shipment.originHub.postalCode}
            </p>
          </div>
        </td>

        {shipment.destinationHub ? (
          <td>
            <h2 className="font-bold	">{shipment.destinationHub.displayName}</h2>
            <div style={{ fontSize: "11px" }} className="">
              <p>{shipment.destinationHub.city}</p>
              <p>{shipment.destinationHub.stateOrProvince}</p>
              <p>
                {shipment.destinationHub.countryCode}{" "}
                {shipment.destinationHub.postalCode}
              </p>
            </div>
          </td>
        ) : (
          <td>Receiver Address</td>
        )}
        <td>
          <h2 className="font-bold	">
            <ShipmentArrivedDate shipmentId={shipment.id} />
          </h2>
        </td>

        <td>
          <ShipmentStatus shipmentId={shipment.id} />
        </td>
        <td>
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
                  onClick={() => setVisibleModal("VIEW_QRCODE")}
                >
                  View QR Code
                </DropdownMenu.Item>

                <DropdownMenu.Arrow className="fill-white" />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <ShipmentsViewDetailsModal
            shipment={shipment}
            isOpen={visibleModal === "VIEW_DETAILS"}
            close={() => setVisibleModal(null)}
          />
          <ShipmentsViewQrCodeModal
            shipment={shipment}
            isOpen={visibleModal === "VIEW_QRCODE"}
            close={() => setVisibleModal(null)}
          />
        </td>
      </tr>
    </tbody>
  )
}

function RecentActivityTile({
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
      <table className="min-w-full	text-left">
        {/* Header */}
        <thead
          className="uppercase"
          style={{ fontSize: "15px", borderBottom: "1px solid #C9C1C1" }}
        >
          <tr>
            <th>
              <input type="checkbox"></input>&nbsp; Shipment Id{" "}
              <button>
                <ArrowsDownUp size={15} />
              </button>
            </th>
            <th>Origin</th>
            <th>Destination</th>
            <th>
              Arrived Date{" "}
              <button>
                <ArrowsDownUp size={15} />
              </button>
            </th>
            <th>Status</th>
          </tr>
        </thead>
        {/* Body */}
        {selectedTab === "ALL" ? (
          <>
            {allShipments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-3">
                  No Package Found
                </td>
              </tr>
            ) : (
              <>
                {allShipments.map((shipment) => (
                  <ShipmentTableItem key={shipment.id} shipment={shipment} />
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {archivedShipments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-3">
                  No Package Found
                </td>
              </tr>
            ) : (
              <>
                {archivedShipments.map((shipment) => (
                  <ShipmentTableItem key={shipment.id} shipment={shipment} />
                ))}
              </>
            )}
          </>
        )}
      </table>
    </div>
  )
}

export default function DashboardPage() {
  const { user, role } = useSession()
  const {
    isLoading,
    isError,
    data: shipments,
  } = api.shipment.getAllWithOriginAndDestination.useQuery(undefined, {
    enabled: user !== null && role === "WAREHOUSE",
  })

  return (
    <WarehouseLayout title="Dashboard">
      <div className="flex	justify-between	my-4">
        <h1 className="text-3xl font-black [color:_#00203F] mb-4">Shipments</h1>
      </div>
      <SearchBar />

      <section className="mb-6"></section>

      <section className="grid grid-cols-1 gap-x-11 [color:_#404040] mb-6">
        {isLoading ? (
          <div className="flex justify-center pt-4">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {isError ? (
              <>Error :{"("}</>
            ) : (
              <>
                <RecentActivityTile shipments={shipments} />
              </>
            )}
          </>
        )}
      </section>
    </WarehouseLayout>
  )
}

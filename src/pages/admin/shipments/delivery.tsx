import { AdminLayout } from "@/layouts/admin"
import { useState } from "react"
import { useSession } from "@/utils/auth"
import { Plus } from "@phosphor-icons/react/Plus"
import { CreateModal } from "@/components/shipments/delivery/create-modal"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { NormalizedDeliveryShipment } from "@/server/db/entities"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { getColorFromShipmentStatus } from "@/utils/colors"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Page from "@/components/page"
import * as Table from "@/components/table"
import { DateTime } from "luxon"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import { PackageShippingType, ShipmentStatus } from "@/utils/constants"
import { ViewLocationsModal } from "@/components/shipments/delivery/view-locations-modal"
import { usePaginatedItems } from "@/hooks/paginated-items"
import { DisplayName } from "@/components/users/display-name"
import { ViewDetailsModal } from "@/components/shipments/view-details"

function TableItem({ item }: { item: NormalizedDeliveryShipment }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "VIEW_LOCATIONS"
  >(null)

  return (
    <div className="grid grid-cols-4 border-b border-gray-300 text-sm">
      <div className="px-4 py-2 flex items-center gap-1">
        <input type="checkbox" />
        <span>{item.id}</span>
      </div>
      <div className="px-4 py-2">
        <DisplayName userId={item.driverId} />
      </div>
      <div className="px-4 py-2">
        {DateTime.fromJSDate(item.createdAt).toLocaleString(
          DateTime.DATETIME_FULL,
        )}
      </div>
      <div className="px-4 py-2 flex items-center gap-2">
        <div
          className={`
        w-36 py-0.5 text-white text-center rounded-md
        ${getColorFromShipmentStatus(item.status as ShipmentStatus)}
      `}
        >
          {item.status.replaceAll("_", " ")}
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

        <ViewDetailsModal
          shipmentId={item.id}
          isOpen={visibleModal === "VIEW_DETAILS"}
          close={() => setVisibleModal(null)}
        />
        <ViewLocationsModal
          isOpen={visibleModal === "VIEW_LOCATIONS"}
          close={() => setVisibleModal(null)}
          delivery={item}
        />
      </div>
    </div>
  )
}

function filterBySearchTerm(
  items: NormalizedDeliveryShipment[],
  searchTerm: string,
) {
  return items.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm),
  )
}

function filterBySelectedTab(
  items: NormalizedDeliveryShipment[],
  selectedTab: PackageShippingType | "ALL",
) {
  if (selectedTab === "ALL") return items
  if (selectedTab === "EXPRESS") return items.filter((item) => item.isExpress)

  return items.filter((item) => !item.isExpress)
}

function filterByArchiveStatus(
  items: NormalizedDeliveryShipment[],
  isArchived: boolean,
) {
  if (isArchived) return items.filter((item) => item.isArchived === 1)

  return items.filter((item) => item.isArchived === 0)
}

function ShipmentsTable({ items }: { items: NormalizedDeliveryShipment[] }) {
  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

  const [selectedTab, setSelectedTab] = useState<
    "EXPRESS" | "STANDARD" | "ALL"
  >("EXPRESS")

  const [searchTerm, setSearchTerm] = useState("")
  const visibleItems = filterBySearchTerm(
    filterBySelectedTab(
      filterByArchiveStatus(items, visibleArchiveStatus === "ARCHIVED"),
      selectedTab,
    ),
    searchTerm,
  )

  const {
    pageNumber,
    pageSize,
    pageCount,
    isOnFirstPage,
    isOnLastPage,
    paginatedItems,
    updatePageSize,
    resetPageNumber,
    gotoFirstPage,
    gotoLastPage,
    gotoPage,
    gotoNextPage,
    gotoPreviousPage,
  } = usePaginatedItems<NormalizedDeliveryShipment>({
    items: visibleItems,
  })

  return (
    <>
      <Table.Filters>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3">
          <div>
            <Table.SearchForm
              updateSearchTerm={(searchTerm) => setSearchTerm(searchTerm)}
              resetPageNumber={resetPageNumber}
            />
          </div>
          <div className="flex gap-3 text-sm">
            <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
              <option>Status</option>
            </select>
            <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
              <option>Warehouse</option>
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
          <div className="flex justify-end">
            <Table.ExportButton />
          </div>
        </div>
      </Table.Filters>
      <Table.Content>
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
          <Table.Pagination
            pageNumber={pageNumber}
            pageSize={pageSize}
            pageCount={pageCount}
            isOnFirstPage={isOnFirstPage}
            isOnLastPage={isOnLastPage}
            updatePageSize={updatePageSize}
            gotoFirstPage={gotoFirstPage}
            gotoLastPage={gotoLastPage}
            gotoPage={gotoPage}
            gotoNextPage={gotoNextPage}
            gotoPreviousPage={gotoPreviousPage}
          />
        </div>
        <div>
          <Table.Header>
            <div className="grid grid-cols-4">
              <div className="uppercase px-4 py-2 flex gap-1">
                <input type="checkbox" />
                <span>Shipment ID</span>
              </div>
              <div className="uppercase px-4 py-2">Assigned To</div>
              <div className="uppercase px-4 py-2">Created At</div>
              <div className="uppercase px-4 py-2">Status</div>
            </div>
          </Table.Header>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4">No packages found.</div>
          ) : (
            <div>
              {paginatedItems.map((item) => (
                <TableItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </Table.Content>
    </>
  )
}

export default function DeliveriesPage() {
  const { user, role } = useSession()
  const {
    status,
    data: deliveries,
    error,
  } = api.shipment.delivery.getAll.useQuery(undefined, {
    enabled: user !== null && role === "ADMIN",
  })

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)

  return (
    <AdminLayout title="Shipments">
      <Page.Header>
        <h1 className="text-2xl font-black mb-2 [color:_#00203F] flex items-center gap-1">
          <span>Shipments</span> <CaretRight size={20} />
          <span>Delivery</span>
        </h1>
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
        <CreateModal
          isOpen={isOpenCreateModal}
          close={() => setIsOpenCreateModal(false)}
        />
      </Page.Header>
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
      {status === "success" && <ShipmentsTable items={deliveries} />}
    </AdminLayout>
  )
}

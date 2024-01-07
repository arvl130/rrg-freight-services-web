import { AdminLayout } from "@/layouts/admin"
import { useState } from "react"
import { useSession } from "@/utils/auth"
import { Plus } from "@phosphor-icons/react/Plus"
import { CreateModal } from "@/components/shipments/incoming/create-modal"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { NormalizedIncomingShipment } from "@/server/db/entities"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Page from "@/components/page"
import * as Table from "@/components/table"
import { getColorFromShipmentStatus } from "@/utils/colors"
import { DateTime } from "luxon"
import { ShipmentStatus } from "@/utils/constants"
import { usePaginatedItems } from "@/hooks/paginated-items"
import { DisplayName } from "@/components/users/display-name"
import { ViewDetailsModal } from "@/components/shipments/view-details-modal"

function TableItem({ item }: { item: NormalizedIncomingShipment }) {
  const [visibleModal, setVisibleModal] = useState<null | "VIEW_DETAILS">(null)

  return (
    <div className="grid grid-cols-4 border-b border-gray-300 text-sm">
      <div className="px-4 py-2 flex items-center gap-1">
        <input type="checkbox" name="" id="" />
        <span>{item.id}</span>
      </div>
      <div className="px-4 py-2">
        <DisplayName userId={item.sentByAgentId} />
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

              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <ViewDetailsModal
          shipmentId={item.id}
          isOpen={visibleModal === "VIEW_DETAILS"}
          close={() => setVisibleModal(null)}
        />
      </div>
    </div>
  )
}

function filterBySearchTerm(
  items: NormalizedIncomingShipment[],
  searchTerm: string,
) {
  return items.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm),
  )
}

function filterByArchiveStatus(
  items: NormalizedIncomingShipment[],
  isArchived: boolean,
) {
  if (isArchived) return items.filter((item) => item.isArchived === 1)

  return items.filter((item) => item.isArchived === 0)
}

function ShipmentsTable({ items }: { items: NormalizedIncomingShipment[] }) {
  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

  const [searchTerm, setSearchTerm] = useState("")
  const visibleItems = filterBySearchTerm(
    filterByArchiveStatus(items, visibleArchiveStatus === "ARCHIVED"),
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
  } = usePaginatedItems<NormalizedIncomingShipment>({
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
            <Table.ExportButton records={paginatedItems} />
          </div>
        </div>
      </Table.Filters>
      <Table.Content>
        <div className="flex justify-end mb-3">
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
              <div className="uppercase px-4 py-2">Sender</div>
              <div className="uppercase px-4 py-2">Receiver</div>
              <div className="uppercase px-4 py-2">Status</div>
            </div>
          </Table.Header>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4">No packages found.</div>
          ) : (
            <div>
              {paginatedItems.map((incomingShipment) => (
                <TableItem key={incomingShipment.id} item={incomingShipment} />
              ))}
            </div>
          )}
        </div>
      </Table.Content>
    </>
  )
}

export default function IncomingShipmentsPage() {
  const { user, role } = useSession()
  const {
    status,
    data: items,
    error,
  } = api.shipment.incoming.getAll.useQuery(undefined, {
    enabled: user !== null && role === "ADMIN",
  })

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)

  return (
    <AdminLayout title="Shipments">
      <Page.Header>
        <h1 className="text-2xl font-black mb-2 [color:_#00203F] flex items-center gap-1">
          <span>Shipments</span> <CaretRight size={20} />
          <span>Incoming</span>
        </h1>
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
      {status === "success" && <ShipmentsTable items={items} />}
    </AdminLayout>
  )
}

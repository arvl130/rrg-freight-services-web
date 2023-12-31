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
import { Plus } from "@phosphor-icons/react/Plus"
import { api } from "@/utils/api"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Page from "@/components/page"
import * as Table from "@/components/table"
import { CreateModal } from "@/components/vehicles/create-modal"
import { EditModal } from "@/components/vehicles/edit-modal"
import { DeleteModal } from "@/components/vehicles/delete-modal"
import { usePaginatedItems } from "@/hooks/paginated-items"

function TableItem({ item }: { item: Vehicle }) {
  const [visibleModal, setVisibleModal] = useState<null | "EDIT" | "DELETE">(
    null,
  )

  return (
    <>
      <div className="grid grid-cols-5 border-b border-gray-300 text-sm">
        <div className="px-4 py-2 flex items-center gap-1">
          <input type="checkbox" name="" id="" />
          <span>{item.id}</span>
        </div>
        <div className="px-4 py-2">{item.displayName}</div>
        <div className="px-4 py-2">{item.type}</div>
        <div className="px-4 py-2">
          {item.isExpressAllowed === 1 ? "Yes" : "No"}
        </div>
        <div className="px-4 py-2 flex items-center gap-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button type="button">
                <span className="sr-only">Actions</span>
                <DotsThree size={16} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white rounded-lg drop-shadow-lg text-sm font-medium">
                <DropdownMenu.Item
                  className="transition-colors hover:bg-sky-50 px-3 py-2"
                  onClick={() => setVisibleModal("EDIT")}
                >
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="transition-colors hover:bg-sky-50 px-3 py-2"
                  onClick={() => setVisibleModal("DELETE")}
                >
                  Delete
                </DropdownMenu.Item>
                <DropdownMenu.Arrow className="fill-white" />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <EditModal
            id={item.id}
            close={() => setVisibleModal(null)}
            isOpen={visibleModal === "EDIT"}
          />
          <DeleteModal
            id={item.id}
            close={() => setVisibleModal(null)}
            isOpen={visibleModal === "DELETE"}
          />
        </div>
      </div>
    </>
  )
}

function filterBySearchTerm(items: Vehicle[], searchTerm: string) {
  return items.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm),
  )
}

function filterByArchiveStatus(items: Vehicle[], isArchived: boolean) {
  if (isArchived) return items.filter((item) => item.isArchived === 1)

  return items.filter((item) => item.isArchived === 0)
}

function VehiclesTable({ items }: { items: Vehicle[] }) {
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
  } = usePaginatedItems<Vehicle>({
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
            <div className="grid grid-cols-5 ">
              <div className="uppercase px-4 py-2 flex gap-1">
                <input type="checkbox" name="" id="" />
                <span>Vehicle ID</span>
              </div>
              <div className="uppercase px-4 py-2">Display Name</div>
              <div className="uppercase px-4 py-2">Type</div>
              <div className="uppercase px-4 py-2">Express Allowed</div>
              <div className="uppercase px-4 py-2"></div>
            </div>
          </Table.Header>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4">No vehicle found.</div>
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

export default function VehiclesPage() {
  const { user, role } = useSession()
  const {
    status,
    data: vehicles,
    error,
  } = api.vehicle.getAll.useQuery(undefined, {
    enabled: user !== null && role === "ADMIN",
  })
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)

  return (
    <AdminLayout title="Packages">
      <Page.Header>
        <h1 className="text-2xl font-black [color:_#00203F] mb-2">Vehicles</h1>
        <button
          type="button"
          className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium mt-auto"
          onClick={() => setIsOpenCreateModal(true)}
        >
          <Plus size={16} />
          <span>New Vehicle</span>
        </button>
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
      {status === "success" && <VehiclesTable items={vehicles} />}
    </AdminLayout>
  )
}

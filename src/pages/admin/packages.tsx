import { AdminLayout } from "@/layouts/admin"
import { useSession } from "@/utils/auth"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"
import { Package } from "@/server/db/entities"
import { api } from "@/utils/api"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import * as Table from "@/components/table"
import * as Page from "@/components/page"
import { PackagesViewWaybillModal } from "@/components/packages/view-waybill-modal"
import { PackagesViewDetailsModal } from "@/components/packages/view-details-modal"
import { PackagesEditDetailsModal } from "@/components/packages/edit-details-modal"
import { PackagesEditStatusModal } from "@/components/packages/edit-status-modal"
import { PackageShippingType } from "@/utils/constants"
import { PackageStatus } from "@/components/packages/status"

function TableItem({ package: _package }: { package: Package }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "EDIT_DETAILS" | "EDIT_STATUS" | "VIEW_WAYBILL"
  >(null)

  return (
    <div className="grid grid-cols-4 border-b border-gray-300 text-sm">
      <div className="px-4 py-2 flex items-center gap-1">
        <input type="checkbox" name="" id="" />
        <span>{_package.id.toString().padStart(4, "0")}</span>
      </div>
      <div className="px-4 py-2">
        <div>{_package.senderFullName}</div>
        <div className="text-gray-400">
          <p>{_package.senderStreetAddress}</p>
          <p>{_package.senderCity}</p>
          <p>
            {_package.senderStateOrProvince} {_package.senderPostalCode}{" "}
            {_package.senderCountryCode}
          </p>
        </div>
      </div>
      <div className="px-4 py-2">
        <div>{_package.receiverFullName}</div>
        <div className="text-gray-400">
          <p>{_package.receiverStreetAddress}</p>
          <p>
            Brgy. {_package.receiverBarangay}, {_package.receiverCity}
          </p>
          <p>
            {_package.receiverStateOrProvince} {_package.receiverPostalCode}{" "}
            {_package.receiverCountryCode}
          </p>
        </div>
      </div>
      <div className="px-4 py-2 flex items-center gap-2">
        <PackageStatus packageId={_package.id} />

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
              <DropdownMenu.Item
                className="transition-colors hover:bg-sky-50 px-3 py-2"
                onClick={() => setVisibleModal("EDIT_STATUS")}
              >
                Edit Status
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="transition-colors hover:bg-sky-50 px-3 py-2"
                onClick={() => setVisibleModal("VIEW_WAYBILL")}
              >
                View Waybill
              </DropdownMenu.Item>

              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <PackagesViewDetailsModal
          package={_package}
          isOpen={visibleModal === "VIEW_DETAILS"}
          close={() => setVisibleModal(null)}
        />
        <PackagesEditDetailsModal
          package={_package}
          isOpen={visibleModal === "EDIT_DETAILS"}
          close={() => setVisibleModal(null)}
        />
        <PackagesEditStatusModal
          package={_package}
          isOpen={visibleModal === "EDIT_STATUS"}
          close={() => setVisibleModal(null)}
        />
        <PackagesViewWaybillModal
          package={_package}
          isOpen={visibleModal === "VIEW_WAYBILL"}
          close={() => setVisibleModal(null)}
        />
      </div>
    </div>
  )
}

function filterByCurrentPage(
  items: Package[],
  pageNumber: number,
  pageSize: number,
) {
  return items.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
}

function filterBySearchTerm(items: Package[], searchTerm: string) {
  return items.filter((_package) =>
    _package.id.toString().toLowerCase().includes(searchTerm),
  )
}

function filterBySelectedTab(
  items: Package[],
  selectedTab: PackageShippingType | "ALL",
) {
  if (selectedTab === "ALL") return items

  return items.filter((_package) => _package.shippingType === selectedTab)
}

function filterByArchiveStatus(items: Package[], isArchived: boolean) {
  if (isArchived) return items.filter((_package) => _package.isArchived === 1)

  return items.filter((_package) => _package.isArchived === 0)
}

function PackagesTable({ packages }: { packages: Package[] }) {
  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

  const [selectedTab, setSelectedTab] = useState<
    "EXPRESS" | "STANDARD" | "ALL"
  >("EXPRESS")

  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const pageCount = Math.ceil(packages.length / pageSize)
  const visiblePackages = filterByCurrentPage(
    filterBySearchTerm(
      filterBySelectedTab(
        filterByArchiveStatus(packages, visibleArchiveStatus === "ARCHIVED"),
        selectedTab,
      ),
      searchTerm,
    ),
    pageNumber,
    pageSize,
  )

  return (
    <>
      <Table.Filters>
        <div>
          <Table.SearchForm
            updateSearchTerm={(searchTerm) => setSearchTerm(searchTerm)}
            resetPageNumber={() => setPageNumber(1)}
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
        <div className="flex justify-end items-start">
          <Table.ExportButton />
        </div>
      </Table.Filters>
      <Table.Main>
        <Table.Pagination>
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
              <select
                className="bg-white border border-gray-300 px-2 py-1 w-16"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.currentTarget.value as unknown as number)
                  setPageNumber(1)
                }}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">50</option>
              </select>{" "}
              entries
            </div>
            <div className="flex items-center gap-1 text-sm">
              <button
                type="button"
                className="disabled:text-gray-400"
                disabled={pageNumber === 1}
                onClick={() => setPageNumber(1)}
              >
                <CaretDoubleLeft size={16} />
              </button>
              <button
                type="button"
                className="disabled:text-gray-400"
                disabled={pageNumber === 1}
                onClick={() =>
                  setPageNumber((currPageNumber) => currPageNumber - 1)
                }
              >
                <CaretLeft size={16} />
              </button>

              {[...Array(pageCount)].map((_, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={index + 1 === pageNumber}
                  onClick={() => setPageNumber(index + 1)}
                  className={
                    "w-6 h-6 disabled:bg-brand-cyan-500 disabled:text-white rounded-md"
                  }
                >
                  {index + 1}
                </button>
              ))}
              <button
                type="button"
                className="disabled:text-gray-400"
                disabled={pageNumber === pageCount}
                onClick={() =>
                  setPageNumber((currPageNumber) => currPageNumber + 1)
                }
              >
                <CaretRight size={16} />
              </button>
              <button
                type="button"
                className="disabled:text-gray-400"
                disabled={pageNumber === pageCount}
                onClick={() => setPageNumber(pageCount)}
              >
                <CaretDoubleRight size={16} />
              </button>
            </div>
          </div>
        </Table.Pagination>
        <Table.Content>
          <Table.Header>
            <div className="uppercase px-4 py-2 flex gap-1">
              <input type="checkbox" />
              <span>Package ID</span>
            </div>
            <div className="uppercase px-4 py-2">Sender</div>
            <div className="uppercase px-4 py-2">Receiver</div>
            <div className="uppercase px-4 py-2">Status</div>
          </Table.Header>
          {visiblePackages.length === 0 ? (
            <div className="text-center pt-4">No packages found.</div>
          ) : (
            <div>
              {visiblePackages.map((_package) => (
                <TableItem key={_package.id} package={_package} />
              ))}
            </div>
          )}
        </Table.Content>
      </Table.Main>
    </>
  )
}

export default function PackagesPage() {
  const { user, role } = useSession()
  const {
    status,
    data: packages,
    error,
  } = api.package.getAll.useQuery(undefined, {
    enabled: user !== null && role === "ADMIN",
  })

  return (
    <AdminLayout title="Packages">
      <Page.Header>Packages</Page.Header>
      {status === "loading" && (
        <div className="flex justify-center pt-4">
          <LoadingSpinner />
        </div>
      )}
      {status === "error" && <>An error occured: {error.message}</>}
      {status === "success" && <PackagesTable packages={packages} />}
    </AdminLayout>
  )
}

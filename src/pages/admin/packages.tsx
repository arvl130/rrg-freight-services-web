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
import { Package } from "@/server/db/entities"
import { getColorFromPackageStatus } from "@/utils/colors"
import { api } from "@/utils/api"
import { useState } from "react"
import { LoadingSpinner } from "@/components/spinner"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { PackagesViewWaybillModal } from "@/components/packages/view-waybill-modal"
import { PackagesViewDetailsModal } from "@/components/packages/view-details-modal"
import { PackagesEditDetailsModal } from "@/components/packages/edit-details-modal"
import { PackagesEditStatusModal } from "@/components/packages/edit-status-modal"

function PageHeader() {
  return (
    <div className="flex justify-between mb-4">
      <h1 className="text-3xl font-black [color:_#00203F] mb-2">Packages</h1>
    </div>
  )
}

function PackageStatus({ packageId }: { packageId: number }) {
  const {
    isLoading,
    isError,
    data: packageStatusLog,
  } = api.package.getLatestStatus.useQuery({
    id: packageId,
  })

  if (isLoading)
    return (
      <div className="w-36 py-0.5 text-white text-center rounded-md">...</div>
    )

  if (isError)
    return (
      <div className="w-36 py-0.5 text-white text-center rounded-md">error</div>
    )

  if (packageStatusLog === null)
    return (
      <div className="w-36 py-0.5 text-white text-center rounded-md">n/a</div>
    )

  return (
    <div
      className={`
        w-36 py-0.5 text-white text-center rounded-md
        ${getColorFromPackageStatus(packageStatusLog.status)}
      `}
    >
      {packageStatusLog.status.replaceAll("_", " ")}
    </div>
  )
}

function PackageTableItem({ package: _package }: { package: Package }) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "EDIT_DETAILS" | "EDIT_STATUS" | "VIEW_WAYBILL"
  >(null)

  return (
    <>
      <div className="grid grid-cols-4 border-b border-gray-300 text-sm">
        <div className="px-4 py-2 flex items-center gap-1">
          <input type="checkbox" name="" id="" />
          <span>{_package.id}</span>
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
    </>
  )
}

function PackagesTable({
  packages,
  isArchived,
}: {
  packages: Package[]
  isArchived: boolean
}) {
  const [selectedTab, setSelectedTab] = useState<
    "EXPRESS" | "STANDARD" | "ALL"
  >("EXPRESS")

  const allPackages = isArchived
    ? packages.filter((_package) => _package.isArchived === 1)
    : packages.filter((_package) => _package.isArchived === 0)

  const standardPackages = allPackages.filter(
    (_package) => _package.shippingType === "STANDARD",
  )

  const expressPackages = allPackages.filter(
    (_package) => _package.shippingType === "EXPRESS",
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
            <span>Product ID</span>
          </div>
          <div className="uppercase px-4 py-2">Sender</div>
          <div className="uppercase px-4 py-2">Receiver</div>
          <div className="uppercase px-4 py-2">Status</div>
        </div>
        {/* Body */}
        {selectedTab === "EXPRESS" && (
          <>
            {expressPackages.length === 0 ? (
              <div className="text-center pt-4">No packages found.</div>
            ) : (
              <div>
                {expressPackages.map((_package) => (
                  <PackageTableItem key={_package.id} package={_package} />
                ))}
              </div>
            )}
          </>
        )}
        {selectedTab === "STANDARD" && (
          <>
            {standardPackages.length === 0 ? (
              <div className="text-center pt-4">No packages found.</div>
            ) : (
              <div>
                {standardPackages.map((_package) => (
                  <PackageTableItem key={_package.id} package={_package} />
                ))}
              </div>
            )}
          </>
        )}
        {selectedTab === "ALL" && (
          <>
            {allPackages.length === 0 ? (
              <div className="text-center pt-4">No packages found.</div>
            ) : (
              <div>
                {allPackages.map((_package) => (
                  <PackageTableItem key={_package.id} package={_package} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function PackagesPage() {
  const { user, role } = useSession()
  const {
    isLoading,
    isError,
    data: packages,
  } = api.package.getAll.useQuery(undefined, {
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
            <PackagesTable
              packages={packages}
              isArchived={visibleArchiveStatus === "ARCHIVED"}
            />
          )}
        </>
      )}
    </AdminLayout>
  )
}

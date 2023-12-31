import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple"
import { Export } from "@phosphor-icons/react/Export"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { useState } from "react"
import { useSession } from "@/utils/auth"
import { Plus } from "@phosphor-icons/react/Plus"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"
import { DotsThree } from "@phosphor-icons/react/DotsThree"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { getColorFromShipmentStatus } from "@/utils/colors"
import { DateTime } from "luxon"
import { NormalizedForwarderTransferShipment } from "@/server/db/entities"
import { ShipmentStatus } from "@/utils/constants"
import { DomesticLayout } from "@/layouts/domestic"
import { CreateModal } from "@/components/shipments/transfer/forwarder/create-modal"
import { ConfirmTransferModal } from "@/components/shipments/transfer/forwarder/confirm-transfer-modal"

function PageHeader() {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)

  return (
    <div className="flex justify-between mb-4">
      <h1 className="text-3xl font-black mb-2 [color:_#00203F]">
        Transfer Shipments
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

function TransferShipmentsTableItem({
  transferShipment,
}: {
  transferShipment: NormalizedForwarderTransferShipment
}) {
  const [visibleModal, setVisibleModal] = useState<
    null | "VIEW_DETAILS" | "CONFIRM_TRANSFER"
  >(null)

  return (
    <div className="grid grid-cols-4 border-b border-gray-300 text-sm">
      <div className="px-4 py-2 flex items-center gap-1">
        <input type="checkbox" name="" id="" />
        <span>{transferShipment.id}</span>
      </div>
      <div className="px-4 py-2">
        <UserDisplayName userId={transferShipment.sentToAgentId} />
      </div>
      <div className="px-4 py-2">
        {DateTime.fromJSDate(transferShipment.createdAt).toLocaleString(
          DateTime.DATETIME_FULL,
        )}
      </div>
      <div className="px-4 py-2 flex items-center gap-2">
        <div
          className={`
        w-36 py-0.5 text-white text-center rounded-md
        ${getColorFromShipmentStatus(transferShipment.status as ShipmentStatus)}
      `}
        >
          {transferShipment.status.replaceAll("_", " ")}
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

              {transferShipment.proofOfTransferImgUrl !== null &&
                transferShipment.isTransferConfirmed === 0 && (
                  <DropdownMenu.Item
                    className="transition-colors hover:bg-sky-50 px-3 py-2"
                    onClick={() => setVisibleModal("CONFIRM_TRANSFER")}
                  >
                    Confirm Transfer
                  </DropdownMenu.Item>
                )}

              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <ConfirmTransferModal
          isOpen={visibleModal === "CONFIRM_TRANSFER"}
          close={() => setVisibleModal(null)}
          transferShipmentId={transferShipment.id}
        />
      </div>
    </div>
  )
}

function TransferShipmentsTable({
  transferShipments,
  isArchived,
}: {
  transferShipments: NormalizedForwarderTransferShipment[]
  isArchived: boolean
}) {
  const allTransferShipments = isArchived
    ? transferShipments.filter(({ isArchived }) => isArchived)
    : transferShipments.filter(({ isArchived }) => !isArchived)

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
        <div className="grid grid-cols-4 border-y border-gray-300 font-medium">
          <div className="uppercase px-4 py-2 flex gap-1">
            <input type="checkbox" name="" id="" />
            <span>Transfer Shipment ID</span>
          </div>
          <div className="uppercase px-4 py-2">Sent By</div>
          <div className="uppercase px-4 py-2">Created At</div>
          <div className="uppercase px-4 py-2">Status</div>
        </div>
        {/* Body */}
        {allTransferShipments.length === 0 ? (
          <div className="text-center pt-4">No transfer shipments found.</div>
        ) : (
          <div>
            {allTransferShipments.map((transferShipment) => (
              <TransferShipmentsTableItem
                key={transferShipment.id}
                transferShipment={transferShipment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TransferShipmentsPage() {
  const { user, role } = useSession()
  const {
    status,
    data: transferShipments,
    error,
  } = api.shipment.forwarderTransfer.getAll.useQuery(undefined, {
    enabled: user !== null && role === "DOMESTIC_AGENT",
  })

  const [visibleArchiveStatus, setVisibleArchiveStatus] = useState<
    "ARCHIVED" | "NOT_ARCHIVED"
  >("NOT_ARCHIVED")

  return (
    <DomesticLayout title="Transfer Shipments">
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
        <>
          {
            <TransferShipmentsTable
              transferShipments={transferShipments}
              isArchived={visibleArchiveStatus === "ARCHIVED"}
            />
          }
        </>
      )}
    </DomesticLayout>
  )
}

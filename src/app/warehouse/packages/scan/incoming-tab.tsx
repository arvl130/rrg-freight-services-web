import { api } from "@/utils/api"
import { getColorFromPackageStatus } from "@/utils/colors"
import { getHumanizedOfPackageStatus } from "@/utils/humanize"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight"
import type { Package } from "@/server/db/entities"
import type { SelectedTab } from "./tab-selector"
import { TabSelector } from "./tab-selector"
import { DateTime } from "luxon"
import { DELIVERABLE_PROVINCES_IN_PH } from "@/utils/region-code"
import { ViewWaybillsModal } from "@/components/shipments/incoming/view-waybills-modal"

const scanPackageSchemaFormSchema = z.object({
  packageId: z.string().min(1, {
    message: "Please enter a tracking number.",
  }),
})

type ScanPackageSchemaFormType = z.infer<typeof scanPackageSchemaFormSchema>

function ScanPackageForm({
  packageIds,
  scannedPackageIds,
  updatedPackageIds,
  onSubmitValidPackageId,
}: {
  packageIds: string[]
  scannedPackageIds: string[]
  updatedPackageIds: string[]
  onSubmitValidPackageId: (packageId: string) => void
}) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ScanPackageSchemaFormType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(scanPackageSchemaFormSchema),
  })

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        packageId: "",
      })
    }
  }, [isSubmitSuccessful, reset])

  return (
    <form
      className="mb-3"
      onSubmit={handleSubmit((formData) => {
        if (updatedPackageIds.includes(formData.packageId)) {
          toast("Package was updated already.", {
            icon: "⚠️",
          })
          return
        }

        if (scannedPackageIds.includes(formData.packageId)) {
          toast("Package was already scanned.", {
            icon: "⚠️",
          })
          return
        }

        if (!packageIds.includes(formData.packageId)) {
          toast.error("Unrecognized Package")
          return
        }

        onSubmitValidPackageId(formData.packageId)
      })}
    >
      <div className="grid sm:grid-cols-[1fr_auto] gap-3">
        <input
          type="text"
          placeholder="Enter a tracking number ..."
          className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          {...register("packageId")}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Submit
        </button>
      </div>
      {errors.packageId && (
        <p className="mt-1 text-red-500">{errors.packageId.message}</p>
      )}
    </form>
  )
}

function TableItem(props: {
  item: Package
  isScanned: boolean
  isUpdatingStatus: boolean
  undoScan: () => void
}) {
  return (
    <>
      <div className="whitespace-nowrap">{props.item.preassignedId}</div>
      <div className="whitespace-nowrap">{props.item.id}</div>
      <div>
        <div>{props.item.receiverFullName}</div>
      </div>
      {props.isScanned ? (
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`inline-block px-2 py-1 text-white rounded-full ${getColorFromPackageStatus(
              props.item.status,
            )}`}
          >
            {getHumanizedOfPackageStatus(props.item.status)}
          </span>
          <ArrowRight size={24} />
          <span
            className={`inline-block px-2 py-1 text-white rounded-full whitespace-nowrap ${getColorFromPackageStatus(
              "IN_WAREHOUSE",
            )}`}
          >
            {getHumanizedOfPackageStatus("IN_WAREHOUSE")}
          </span>
        </div>
      ) : (
        <div className="text-sm">
          <span
            className={`inline-block px-2 py-1 text-white rounded-full ${getColorFromPackageStatus(
              props.item.status,
            )}`}
          >
            {getHumanizedOfPackageStatus(props.item.status)}
          </span>
        </div>
      )}
      <div>
        {props.isScanned && (
          <button
            type="button"
            className="font-medium bg-red-500 hover:bg-red-400 disabled:bg-red-300 text-white transition-colors px-2 py-1 rounded-md whitespace-nowrap"
            disabled={props.isUpdatingStatus}
            onClick={props.undoScan}
          >
            Undo Scan
          </button>
        )}
      </div>
    </>
  )
}

function PackagesTableTabs(props: {
  scannedPackageIds: string[]
  isUpdatingStatus: boolean
  packages: Package[]
  onUndoScan: (packageId: string) => void
}) {
  const [visibleView, setVisibleView] = useState<"SORTED" | "ALL">("SORTED")
  const luzonPackages = props.packages.filter((_package) =>
    DELIVERABLE_PROVINCES_IN_PH.includes(
      _package.receiverStateOrProvince.toUpperCase(),
    ),
  )
  const nonLuzonPackages = props.packages.filter(
    (_package) =>
      !DELIVERABLE_PROVINCES_IN_PH.includes(
        _package.receiverStateOrProvince.toUpperCase(),
      ),
  )

  return (
    <>
      <div className="flex justify-end gap-x-3">
        <button
          type="button"
          onClick={() => {
            setVisibleView("SORTED")
          }}
          className={`uppercase font-semibold transition-colors border-b-2 border-green-500 ${
            visibleView === "SORTED"
              ? "bg-green-500 hover:bg-green-400 text-white"
              : "text-green-500 hover:bg-green-100"
          } px-2 py-1`}
        >
          Sorted
        </button>
        <button
          type="button"
          onClick={() => {
            setVisibleView("ALL")
          }}
          className={`uppercase font-semibold transition-colors border-b-2 border-green-500 ${
            visibleView === "ALL"
              ? "bg-green-500 hover:bg-green-400 text-white"
              : "text-green-500 hover:bg-green-100"
          } px-2 py-1`}
        >
          All
        </button>
      </div>

      {visibleView === "ALL" && (
        <div className="grid grid-cols-[repeat(4,_auto)_1fr] gap-3 overflow-auto">
          <div className="font-medium whitespace-nowrap">Received Number</div>
          <div className="font-medium whitespace-nowrap">Tracking Number</div>
          <div className="font-medium">Receiver</div>
          <div className="font-medium">Status</div>
          <div className="font-medium">Actions</div>
          {props.packages.map((_package) => (
            <TableItem
              key={_package.id}
              item={_package}
              isScanned={props.scannedPackageIds.includes(_package.id)}
              isUpdatingStatus={props.isUpdatingStatus}
              undoScan={() => {
                props.onUndoScan(_package.id)
              }}
            />
          ))}
        </div>
      )}

      {visibleView === "SORTED" && (
        <div className="grid grid-cols-2">
          <div className="font-medium pr-3">Going to Luzon</div>
          <div className="font-medium border-l border-gray-300 pl-3">
            Going to Visayas/Mindanao
          </div>
          <div className="grid grid-cols-[repeat(4,_auto)_1fr] gap-3 overflow-auto pr-3">
            <div className="font-medium whitespace-nowrap">Received Number</div>
            <div className="font-medium whitespace-nowrap">Tracking Number</div>
            <div className="font-medium">Receiver</div>
            <div className="font-medium">Status</div>
            <div className="font-medium">Actions</div>
            {luzonPackages.length === 9 ? (
              <p className="text-center text-gray-500 col-span-5">
                No packages in this category.
              </p>
            ) : (
              <>
                {luzonPackages.map((_package) => (
                  <TableItem
                    key={_package.id}
                    item={_package}
                    isScanned={props.scannedPackageIds.includes(_package.id)}
                    isUpdatingStatus={props.isUpdatingStatus}
                    undoScan={() => {
                      props.onUndoScan(_package.id)
                    }}
                  />
                ))}
              </>
            )}
          </div>
          <div className="grid grid-cols-[repeat(4,_auto)_1fr] auto-rows-min gap-3 overflow-auto border-l border-gray-300 pl-3">
            <div className="font-medium whitespace-nowrap">Received Number</div>
            <div className="font-medium whitespace-nowrap">Tracking Number</div>
            <div className="font-medium">Receiver</div>
            <div className="font-medium">Status</div>
            <div className="font-medium">Actions</div>
            {nonLuzonPackages.length === 0 ? (
              <p className="text-center text-gray-500 col-span-5">
                No packages in this category.
              </p>
            ) : (
              <>
                {nonLuzonPackages.map((_package) => (
                  <TableItem
                    key={_package.id}
                    item={_package}
                    isScanned={props.scannedPackageIds.includes(_package.id)}
                    isUpdatingStatus={props.isUpdatingStatus}
                    undoScan={() => {
                      props.onUndoScan(_package.id)
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function PackagesTable({
  shipmentId,
  userId,
}: {
  shipmentId: number
  userId: string
}) {
  const packagesQuery = api.package.getWithLatestStatusByShipmentId.useQuery({
    shipmentId,
  })
  const [scannedPackageIds, setScannedPackageIds] = useState<string[]>([])

  const utils = api.useUtils()
  const { isLoading, mutate } =
    api.shipment.package.updateManyToCompletedStatus.useMutation({
      onSuccess: () => {
        utils.package.getWithLatestStatusByShipmentId.invalidate({
          shipmentId,
        })
        utils.package.getAll.invalidate()
        setScannedPackageIds([])
      },
    })

  if (packagesQuery.status === "loading") return <div>Loading ...</div>
  if (packagesQuery.status === "error")
    return <div>Error: {packagesQuery.error.message}</div>

  return (
    <div>
      <ScanPackageForm
        packageIds={packagesQuery.data.map((_package) => _package.id)}
        scannedPackageIds={scannedPackageIds}
        updatedPackageIds={packagesQuery.data
          .filter((_package) => _package.status === "IN_WAREHOUSE")
          .map((_package) => _package.id)}
        onSubmitValidPackageId={(props) =>
          setScannedPackageIds((currScannedPackages) => [
            ...currScannedPackages,
            props,
          ])
        }
      />

      <PackagesTableTabs
        packages={packagesQuery.data}
        scannedPackageIds={scannedPackageIds}
        isUpdatingStatus={isLoading}
        onUndoScan={(packageId) => {
          setScannedPackageIds((currScannedPackages) =>
            currScannedPackages.filter((id) => id !== packageId),
          )
        }}
      />

      <div className="flex justify-end">
        <button
          type="button"
          className="font-medium bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 text-white transition-colors px-4 py-2 rounded-md"
          disabled={isLoading || scannedPackageIds.length === 0}
          onClick={() => {
            const createdAt = DateTime.now().toISO()
            mutate({
              shipmentId,
              shipmentPackageStatus: "COMPLETED" as const,
              packageIds: [scannedPackageIds[0], ...scannedPackageIds.slice(1)],
              packageStatus: "IN_WAREHOUSE" as const,
              createdAt,
              createdById: userId,
            })
          }}
        >
          Save All
        </button>
      </div>
    </div>
  )
}

function ShipmentSelector({
  onSelectShipmentId,
}: {
  onSelectShipmentId: (id: number) => void
}) {
  const {
    status,
    data: shipments,
    error,
    isRefetching,
    refetch,
  } = api.shipment.incoming.getInTransit.useQuery()

  return (
    <>
      {status === "loading" && (
        <div>
          <p className="px-4 py-2 text-center">Loading ...</p>
        </div>
      )}
      {status === "error" && (
        <div>
          <p>An error occured: {error.message}</p>
        </div>
      )}
      {status === "success" && (
        <>
          {shipments.length === 0 ? (
            <div className="py-2 text-center">
              <p className="mb-3">No incoming shipments found.</p>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 hover:border-gray-100 text-gray-600 disabled:text-gray-400 disabled:bg-gray-100 disabled:border-gray-100 transition-colors font-medium"
                disabled={isRefetching}
                onClick={() => {
                  refetch()
                }}
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="py-2">
              <p>Please choose a shipment.</p>
              <div className="grid grid-cols-[auto_auto_auto_1fr] overflow-auto">
                <div className="font-medium px-2 py-1">Shipment ID</div>
                <div className="font-medium px-2 py-1">Status</div>
                <div className="font-medium px-2 py-1">Sent by</div>
                <div></div>
                {shipments.map((shipment) => (
                  <button
                    key={shipment.id}
                    className="group grid grid-cols-subgrid col-span-4 hover:bg-gray-100 hover:border-gray-100 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      onSelectShipmentId(shipment.id)
                    }}
                  >
                    <p className="border-y border-l rounded-l-lg border-gray-300 px-2 py-2 text-right">
                      {shipment.id}
                    </p>
                    <p className="border-y border-gray-300 px-2 py-2">
                      {shipment.type}
                    </p>
                    <p className="border-y border-gray-300 px-2 py-2">
                      {shipment.agentDisplayName} ({shipment.agentCompanyName})
                    </p>
                    <p className="border-y border-r rounded-r-lg border-gray-300 text-left text-gray-500 px-2 py-2">
                      <span className="invisible group-hover:visible">
                        Choose this shipment.
                      </span>
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

function MarkAsCompleted({
  shipmentId,
  resetSelectedShipmentId,
}: {
  shipmentId: number
  resetSelectedShipmentId: () => void
}) {
  const {
    status,
    data: packages,
    error,
  } = api.package.getWithLatestStatusByShipmentId.useQuery({
    shipmentId,
  })

  const utils = api.useUtils()
  const { isLoading, mutate } =
    api.shipment.incoming.updateStatusToCompletedById.useMutation({
      onSuccess: () => {
        utils.shipment.incoming.getInTransit.invalidate()
        resetSelectedShipmentId()
      },
    })

  if (status === "loading") return <p>Loading ...</p>
  if (status === "error") return <p>Error {error.message}</p>
  if (packages.length === 0) return <p>No packages.</p>

  const hasPendingPackages = packages.some(
    (_package) => _package.status !== "IN_WAREHOUSE",
  )

  return (
    <button
      type="button"
      disabled={isLoading || hasPendingPackages}
      className="bg-green-500 hover:bg-green-400 disabled:bg-green-300 text-white px-4 py-2 rounded-lg transition-colors font-medium"
      onClick={() => {
        mutate({
          id: shipmentId,
        })
      }}
    >
      Mark as Completed
    </button>
  )
}

export function IncomingTab({
  selectedTab,
  setSelectedTab,
  userId,
}: {
  selectedTab: SelectedTab
  setSelectedTab: (tab: SelectedTab) => void
  userId: string
}) {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [selectedShipmentId, setSelectedShipmentId] = useState<null | number>(
    null,
  )

  return (
    <div className="bg-white rounded-lg shadow-lg px-4 py-2">
      <TabSelector selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      {selectedShipmentId === null ? (
        <ShipmentSelector onSelectShipmentId={setSelectedShipmentId} />
      ) : (
        <div className="sm:flex justify-between items-center mb-3">
          <div className="font-semibold mb-3 sm:mb-0">
            Shipment ID {selectedShipmentId}
          </div>
          <div>
            <button
              type="button"
              className="px-4 py-2 mb-3 sm:mb-0 bg-purple-700 text-white hover:bg-purple-600 rounded-md font-medium transition-colors mr-3"
              onClick={() => {
                setIsPrintModalOpen(true)
              }}
            >
              Print Waybills
            </button>

            <button
              type="button"
              className="px-4 py-2 mb-3 sm:mb-0 bg-gray-700 text-white hover:bg-gray-600 rounded-md font-medium transition-colors mr-3"
              onClick={() => {
                setSelectedShipmentId(null)
              }}
            >
              Change Shipment
            </button>
            {selectedShipmentId && (
              <MarkAsCompleted
                shipmentId={selectedShipmentId}
                resetSelectedShipmentId={() => setSelectedShipmentId(null)}
              />
            )}
          </div>

          <ViewWaybillsModal
            isOpen={isPrintModalOpen}
            onClose={() => {
              setIsPrintModalOpen(false)
            }}
            shipmentId={selectedShipmentId}
          />
        </div>
      )}

      {selectedShipmentId && (
        <PackagesTable shipmentId={selectedShipmentId} userId={userId} />
      )}
    </div>
  )
}

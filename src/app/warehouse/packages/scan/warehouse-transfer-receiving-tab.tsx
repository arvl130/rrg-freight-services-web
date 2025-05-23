import { api } from "@/utils/api"
import { getColorFromPackageStatus } from "@/utils/colors"
import { getHumanizedOfPackageStatus } from "@/utils/humanize"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight"
import type { Package, PackageCategory } from "@/server/db/entities"
import type { SelectedTab } from "./tab-selector"
import { TabSelector } from "./tab-selector"
import { DateTime } from "luxon"

const scanPackageSchemaFormSchema = z.object({
  packageId: z.string().min(1, {
    message: "Please enter a package ID.",
  }),
})

type ScanPackageSchemaFormType = z.infer<typeof scanPackageSchemaFormSchema>

function ScanPackageForm({
  packageIds,
  scannedPackageIds,
  updatedPackageIds,
  onSubmitValidPackageId: onSubmitValidPackageId,
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
          placeholder="Enter a package ID ..."
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
  packageCategories: PackageCategory[]
  undoScan: () => void
}) {
  return (
    <>
      <div>{props.item.id}</div>
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
            className={`inline-block px-2 py-1 text-white rounded-full ${getColorFromPackageStatus(
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
            className="font-medium bg-red-500 hover:bg-red-400 disabled:bg-red-300 text-white transition-colors px-2 py-1 rounded-md"
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
  const packageCategoriesQuery = api.packageCategory.getAll.useQuery()
  const [scannedPackageIds, setScannedPackageIds] = useState<string[]>([])

  const utils = api.useUtils()
  const { isPending, mutate } =
    api.shipment.package.updateManyToCompletedStatus.useMutation({
      onSuccess: () => {
        utils.package.getWithLatestStatusByShipmentId.invalidate({
          shipmentId,
        })
        utils.package.getAll.invalidate()
        setScannedPackageIds([])
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  if (packagesQuery.status === "pending") return <div>Loading ...</div>
  if (packagesQuery.status === "error")
    return <div>Error: {packagesQuery.error.message}</div>

  if (packageCategoriesQuery.status === "pending") return <div>Loading ...</div>
  if (packageCategoriesQuery.status === "error")
    return <div>Error: {packageCategoriesQuery.error.message}</div>

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
      <div className="grid grid-cols-[repeat(3,_auto)_1fr] gap-3 overflow-auto">
        <div className="font-medium">Package ID</div>
        <div className="font-medium">Receiver</div>
        <div className="font-medium">Status</div>
        <div className="font-medium">Actions</div>
        {packagesQuery.data.map((_package) => (
          <TableItem
            key={_package.id}
            item={_package}
            isScanned={scannedPackageIds.includes(_package.id)}
            isUpdatingStatus={isPending}
            packageCategories={packageCategoriesQuery.data}
            undoScan={() => {
              setScannedPackageIds((currScannedPackages) =>
                currScannedPackages.filter((id) => id !== _package.id),
              )
            }}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="font-medium bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 text-white transition-colors px-4 py-2 rounded-md"
          disabled={isPending || scannedPackageIds.length === 0}
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

type ShipmentSelectorSearchCriteria =
  | "SHIPMENT_ID"
  | "PACKAGE_ID"
  | "PACKAGE_PRE_ID"

function ShipmentSelector({
  onSelectShipmentId,
}: {
  onSelectShipmentId: (id: number) => void
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchWith, setSearchWith] =
    useState<ShipmentSelectorSearchCriteria>("SHIPMENT_ID")

  const {
    status,
    data: shipments,
    error,
    isRefetching,
    refetch,
  } = api.shipment.warehouseTransfer.getInTransit.useQuery({
    searchWith,
    searchTerm,
  })

  return (
    <div>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 items-center">
        <p>
          Search with
          <select
            className="px-3 py-1 ml-1 bg-white border border-gray-300 rounded-md"
            value={searchWith}
            onChange={(e) =>
              setSearchWith(
                e.currentTarget.value as ShipmentSelectorSearchCriteria,
              )
            }
          >
            <option value="SHIPMENT_ID">Shipment ID</option>
            <option value="PACKAGE_ID">Tracking Number (from RRG)</option>
            <option value="PACKAGE_PRE_ID">Tracking Number (from Agent)</option>
          </select>
          :
        </p>
        <input
          type="text"
          placeholder={
            searchWith === "SHIPMENT_ID"
              ? "Enter a shipment ID ..."
              : "Enter an tracking number ..."
          }
          className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.currentTarget.value)
          }}
        />
      </div>
      {status === "pending" && (
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
              <p className="mb-3">No warehouse transfer shipments found.</p>
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
              <div className="grid grid-cols-[repeat(3,_auto)_1fr] overflow-auto">
                <div className="font-medium px-2 py-1">Shipment ID</div>
                <div className="font-medium px-2 py-1">Status</div>
                <div className="font-medium px-2 py-1">Sent to Warehouse</div>
                <div></div>
                {shipments.map((shipment, index) => (
                  <button
                    key={shipment.id}
                    className={`${
                      index === 0 ? "" : "mt-3"
                    } group grid grid-cols-subgrid col-span-4 hover:bg-gray-100 hover:border-gray-100 rounded-lg transition-colors duration-200`}
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
                    <p className="border-y border-gray-300 px-2 py-2 text-left">
                      {shipment.warehouseDisplayName}
                    </p>
                    <p className="border-y border-r rounded-r-lg border-gray-300 text-gray-500 px-2 py-2 text-left">
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
    </div>
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
  const { isPending, mutate } =
    api.shipment.warehouseTransfer.updateStatusToCompletedById.useMutation({
      onSuccess: () => {
        utils.shipment.warehouseTransfer.getInTransit.invalidate()
        resetSelectedShipmentId()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  if (status === "pending") return <p>Loading ...</p>
  if (status === "error") return <p>Error {error.message}</p>
  if (packages.length === 0) return <p>No packages.</p>

  const hasPendingPackages = packages.some(
    (_package) => _package.status !== "IN_WAREHOUSE",
  )

  return (
    <button
      type="button"
      disabled={isPending || hasPendingPackages}
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

export function WarehouseTransferReceivingTab({
  selectedTab,
  setSelectedTab,
  userId,
}: {
  selectedTab: SelectedTab
  setSelectedTab: (tab: SelectedTab) => void
  userId: string
}) {
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
              className="px-4 py-2 mb-3 sm:mb-0 bg-gray-700 text-white hover:bg-gray-600 rounded-md transition-colors mr-3"
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
        </div>
      )}

      {selectedShipmentId && (
        <PackagesTable shipmentId={selectedShipmentId} userId={userId} />
      )}
    </div>
  )
}

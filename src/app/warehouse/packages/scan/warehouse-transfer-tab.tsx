import { api } from "@/utils/api"
import { getColorFromPackageStatus } from "@/utils/colors"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { supportedPackageStatusToHumanized } from "@/utils/humanize"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { ArrowRight } from "@phosphor-icons/react/ArrowRight"
import { getAuth } from "firebase/auth"
import type { ShipmentType } from "@/utils/constants"
import { TabSelector } from "./tab-selector"

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
      <div className="grid grid-cols-[1fr_auto] gap-3">
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

function PackagesTable({ shipmentId }: { shipmentId: number }) {
  const {
    status,
    data: packages,
    error,
  } = api.package.getWithLatestStatusByShipmentId.useQuery({
    shipmentId: shipmentId,
  })

  const [scannedPackageIds, setScannedPackageIds] = useState<string[]>([])

  const utils = api.useUtils()
  const { isLoading, mutate } =
    api.shipment.package.updateManyToCompletedStatus.useMutation({
      onSuccess: () => {
        utils.package.getWithLatestStatusByShipmentId.invalidate({
          shipmentId: shipmentId,
        })
        utils.package.getAll.invalidate()
        setScannedPackageIds([])
      },
    })

  if (status === "loading") return <div>Loading ...</div>
  if (status === "error") return <div>Error: {error.message}</div>

  return (
    <div>
      <ScanPackageForm
        packageIds={packages.map((_package) => _package.id)}
        scannedPackageIds={scannedPackageIds}
        updatedPackageIds={packages
          .filter((_package) => _package.status === "TRANSFERRING_WAREHOUSE")
          .map((_package) => _package.id)}
        onSubmitValidPackageId={(packageId) =>
          setScannedPackageIds((currScannedPackageIds) => [
            ...currScannedPackageIds,
            packageId,
          ])
        }
      />
      <div className="grid grid-cols-4 font-medium">
        <div>Package ID</div>
        <div>Receiver</div>
        <div>Status</div>
        <div>Actions</div>
      </div>
      {packages.map((_package) => (
        <div key={_package.id} className="grid grid-cols-4 mb-1">
          <div>{_package.id}</div>
          <div>
            <div>{_package.receiverFullName}</div>
          </div>
          {scannedPackageIds.includes(_package.id) ? (
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`inline-block px-2 py-1 text-white rounded-full ${getColorFromPackageStatus(
                  _package.status,
                )}`}
              >
                {supportedPackageStatusToHumanized(_package.status)}
              </span>
              <ArrowRight size={24} />
              <span
                className={`inline-block px-2 py-1 text-white rounded-full ${getColorFromPackageStatus(
                  "TRANSFERRING_WAREHOUSE",
                )}`}
              >
                {supportedPackageStatusToHumanized("TRANSFERRING_WAREHOUSE")}
              </span>
            </div>
          ) : (
            <div className="text-sm">
              <span
                className={`inline-block px-2 py-1 text-white rounded-full ${getColorFromPackageStatus(
                  _package.status,
                )}`}
              >
                {supportedPackageStatusToHumanized(_package.status)}
              </span>
            </div>
          )}
          <div>
            {scannedPackageIds.includes(_package.id) && (
              <button
                type="button"
                className="font-medium bg-red-500 hover:bg-red-400 disabled:bg-red-300 text-white transition-colors px-2 py-1 rounded-md"
                disabled={isLoading}
                onClick={() => {
                  setScannedPackageIds((currScannedPackageIds) =>
                    currScannedPackageIds.filter((id) => id !== _package.id),
                  )
                }}
              >
                Undo Scan
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <button
          type="button"
          className="font-medium bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 text-white transition-colors px-4 py-2 rounded-md"
          disabled={isLoading || scannedPackageIds.length === 0}
          onClick={() => {
            const auth = getAuth()
            mutate({
              shipmentId,
              shipmentPackageStatus: "IN_TRANSIT" as const,
              packageIds: [scannedPackageIds[0], ...scannedPackageIds.slice(1)],
              packageStatus: "TRANSFERRING_WAREHOUSE" as const,
              description: getDescriptionForNewPackageStatusLog(
                "TRANSFERRING_WAREHOUSE",
              ),
              createdAt: new Date(),
              createdById: auth.currentUser!.uid,
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
  } = api.shipment.warehouseTransfer.getPreparing.useQuery()

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
              <p className="mb-3">No transfer warehouse shipments found.</p>
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
              <div className="grid grid-cols-[repeat(7,_auto)_1fr] gap-x-3">
                <div className="font-medium px-2 py-1">Shipment ID</div>
                <div className="font-medium px-2 py-1">Status</div>
                <div className="font-medium px-2 py-1">Destination</div>
                <div className="font-medium px-2 py-1">Driver Name</div>
                <div className="font-medium px-2 py-1">Driver Contact No.</div>
                <div className="font-medium px-2 py-1">Vehicle Name</div>
                <div className="font-medium px-2 py-1">Vehicle Type</div>
                <div></div>
                {shipments.map((shipment) => (
                  <button
                    key={shipment.id}
                    className="group grid grid-cols-subgrid col-span-8 hover:bg-gray-100 border border-gray-300 hover:border-gray-100 py-2 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      onSelectShipmentId(shipment.id)
                    }}
                  >
                    <p className="text-right px-2">{shipment.id}</p>
                    <p className="px-2">{shipment.type}</p>
                    <p className="px-2">{shipment.warehouseDisplayName}</p>
                    <p className="px-2 text-left">
                      {shipment.driverDisplayName}
                    </p>
                    <p className="px-2 text-left">
                      {shipment.driverDisplayName}
                    </p>
                    <p className="px-2 text-left">
                      {shipment.vehicleDisplayName}
                    </p>
                    <p className="px-2 text-left">{shipment.vehicleType}</p>
                    <p className="invisible group-hover:visible text-left text-gray-500 px-2">
                      Choose this shipment.
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

function MarkAsInTransit({
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
    shipmentId: shipmentId,
  })

  const utils = api.useUtils()
  const { isLoading, mutate } =
    api.shipment.warehouseTransfer.updateStatusToInTransitById.useMutation({
      onSuccess: () => {
        utils.shipment.warehouseTransfer.getPreparing.invalidate()
        resetSelectedShipmentId()
      },
    })

  if (status === "loading") return <p>Loading ...</p>
  if (status === "error") return <p>Error {error.message}</p>
  if (packages.length === 0) return <p>No packages.</p>

  const hasPendingPackages = packages.some(
    (_package) => _package.status !== "TRANSFERRING_WAREHOUSE",
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
      Mark as In Transit
    </button>
  )
}

export function WarehouseTransferTab({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: ShipmentType | "INCOMPLETE_DELIVERY"
  setSelectedTab: (tab: ShipmentType | "INCOMPLETE_DELIVERY") => void
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
        <div className="flex justify-between items-center mb-3">
          <div className="font-semibold ">Shipment ID {selectedShipmentId}</div>
          <div>
            <button
              type="button"
              className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-md transition-colors mr-3"
              onClick={() => {
                setSelectedShipmentId(null)
              }}
            >
              Change Shipment
            </button>
            {selectedShipmentId && (
              <MarkAsInTransit
                shipmentId={selectedShipmentId}
                resetSelectedShipmentId={() => setSelectedShipmentId(null)}
              />
            )}
          </div>
        </div>
      )}
      {selectedShipmentId && <PackagesTable shipmentId={selectedShipmentId} />}
    </div>
  )
}

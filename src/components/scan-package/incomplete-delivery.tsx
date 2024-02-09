import { api } from "@/utils/api"
import { getColorFromPackageStatus } from "@/utils/colors"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { supportedPackageStatusToHumanized } from "@/utils/humanize"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { ArrowRight } from "@phosphor-icons/react/ArrowRight"
import { getAuth } from "firebase/auth"
import type { ShipmentType } from "@/utils/constants"

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
    formState: { errors },
  } = useForm<ScanPackageSchemaFormType>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(scanPackageSchemaFormSchema),
  })

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
          toast("Package was scanned already.", {
            icon: "⚠️",
          })
          return
        }

        if (!packageIds.includes(formData.packageId)) {
          toast.error("Unrecognized Package")
          return
        }

        onSubmitValidPackageId(formData.packageId)
        reset()
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

  if (status === "loading") return <div>Loading ...</div>
  if (status === "error") return <div>Error: {error.message}</div>

  return (
    <div>
      <ScanPackageForm
        packageIds={packages.map((_package) => _package.id)}
        scannedPackageIds={scannedPackageIds}
        updatedPackageIds={packages
          .filter((_package) => _package.status === "IN_WAREHOUSE")
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
                  "IN_WAREHOUSE",
                )}`}
              >
                {supportedPackageStatusToHumanized("IN_WAREHOUSE")}
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
              shipmentPackageStatus: "COMPLETED" as const,
              packageIds: [scannedPackageIds[0], ...scannedPackageIds.slice(1)],
              packageStatus: "IN_WAREHOUSE" as const,
              description: getDescriptionForNewPackageStatusLog("IN_WAREHOUSE"),
              createdAt: new Date(),
              createdById: auth.currentUser!.uid,
              isFailedAttempt: true,
            })
          }}
        >
          Save All
        </button>
      </div>
    </div>
  )
}

function SelectShipment({
  selectedShipmentId,
  setSelectedShipmentId: setSelectedShipmentId,
}: {
  selectedShipmentId: null | number
  setSelectedShipmentId: (id: null | number) => void
}) {
  const {
    status,
    data: shipments,
    error,
  } = api.shipment.delivery.getInTransit.useQuery()

  if (status === "loading") return <p>Loading ...</p>
  if (status === "error") return <p>Error {error.message}</p>
  if (shipments.length === 0) return <p>No shipments</p>

  return (
    <select
      value={selectedShipmentId === null ? "" : selectedShipmentId.toString()}
      onChange={(e) => {
        if (e.currentTarget.value === "") setSelectedShipmentId(null)
        else setSelectedShipmentId(Number(e.currentTarget.value))
      }}
    >
      <option value="">Select a shipment ...</option>
      {shipments.map((shipment) => (
        <option key={shipment.id} value={shipment.id.toString()}>
          {shipment.id}
        </option>
      ))}
    </select>
  )
}

function MarkAsComplete({
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
    api.shipment.delivery.updateStatusToCompletedById.useMutation({
      onSuccess: () => {
        utils.shipment.delivery.getInTransit.invalidate()
        resetSelectedShipmentId()
      },
    })

  if (status === "loading") return <p>Loading ...</p>
  if (status === "error") return <p>Error {error.message}</p>
  if (packages.length === 0) return <p>No packages.</p>

  const hasOutOfWarehouseOrUndeliveredPackages = packages.some(
    (_package) =>
      _package.status !== "IN_WAREHOUSE" && _package.status !== "DELIVERED",
  )

  return (
    <button
      type="button"
      disabled={isLoading || hasOutOfWarehouseOrUndeliveredPackages}
      className="bg-green-500 hover:bg-green-400 disabled:bg-green-300 text-white px-4 py-2 rounded-lg transition-colors font-medium"
      onClick={() => {
        mutate({
          id: shipmentId,
        })
      }}
    >
      Mark as Complete
    </button>
  )
}

export function IncompleteDeliveryTab({
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
      <div className="flex gap-2">
        <button
          type="button"
          className={`
              pb-1 font-semibold border-b-4 px-2
              ${
                selectedTab === "INCOMING"
                  ? "border-b-4 text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
          onClick={() => setSelectedTab("INCOMING")}
        >
          Incoming
        </button>
        <button
          type="button"
          className={`
              pb-1 font-semibold border-b-4 px-2
              ${
                selectedTab === "DELIVERY"
                  ? "border-b-4 text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
          onClick={() => setSelectedTab("DELIVERY")}
        >
          Delivery
        </button>
        <button
          type="button"
          className={`
              pb-1 font-semibold border-b-4 px-2
              ${
                selectedTab === "INCOMPLETE_DELIVERY"
                  ? "border-b-4 text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
          onClick={() => setSelectedTab("INCOMPLETE_DELIVERY")}
        >
          Incomplete Delivery
        </button>
        <button
          type="button"
          className={`
              pb-1 font-semibold border-b-4 px-2
              ${
                selectedTab === "TRANSFER_FORWARDER"
                  ? "border-b-4 text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
          onClick={() => setSelectedTab("TRANSFER_FORWARDER")}
        >
          Forwarder Transfer
        </button>
        <button
          type="button"
          className={`
              pb-1 font-semibold border-b-4 px-2
              ${
                selectedTab === "TRANSFER_WAREHOUSE"
                  ? "border-b-4 text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
          onClick={() => setSelectedTab("TRANSFER_WAREHOUSE")}
        >
          Warehouse Transfer
        </button>
      </div>
      <div className="flex justify-between mb-3">
        <div>
          <SelectShipment
            selectedShipmentId={selectedShipmentId}
            setSelectedShipmentId={setSelectedShipmentId}
          />
        </div>

        <div>
          {selectedShipmentId && (
            <MarkAsComplete
              shipmentId={selectedShipmentId}
              resetSelectedShipmentId={() => setSelectedShipmentId(null)}
            />
          )}
        </div>
      </div>
      {selectedShipmentId && <PackagesTable shipmentId={selectedShipmentId} />}
    </div>
  )
}

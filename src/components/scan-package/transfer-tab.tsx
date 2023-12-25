import { api } from "@/utils/api"
import { getColorFromPackageStatus } from "@/utils/colors"
import {
  REGEX_ONE_OR_MORE_DIGITS,
  getDescriptionForNewPackageStatusLog,
} from "@/utils/constants"
import { supportedPackageStatusToHumanized } from "@/utils/humanize"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { ArrowRight } from "@phosphor-icons/react/ArrowRight"
import { getAuth } from "firebase/auth"
import { ScanPackageTab } from "./common"

const scanPackageSchemaFormSchema = z.object({
  packageId: z
    .string()
    .min(1, {
      message: "Please enter a package ID.",
    })
    .regex(REGEX_ONE_OR_MORE_DIGITS, {
      message: "Only numeric values are accepted.",
    }),
})

type ScanPackageSchemaFormType = z.infer<typeof scanPackageSchemaFormSchema>

function ScanPackageForm({
  packageIds,
  scannedPackageIds,
  updatedPackageIds,
  onSubmitValidPackageId,
}: {
  packageIds: number[]
  scannedPackageIds: number[]
  updatedPackageIds: number[]
  onSubmitValidPackageId: (packageId: number) => void
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
        if (updatedPackageIds.includes(Number(formData.packageId))) {
          toast("Package was updated already.", {
            icon: "⚠️",
          })
          return
        }

        if (scannedPackageIds.includes(Number(formData.packageId))) {
          toast("Package was already scanned.", {
            icon: "⚠️",
          })
          return
        }

        if (!packageIds.includes(Number(formData.packageId))) {
          toast.error("Unrecognized Package")
          return
        }

        onSubmitValidPackageId(Number(formData.packageId))
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

function PackagesTable({ transferShipmentId }: { transferShipmentId: number }) {
  const {
    status,
    data: packages,
    error,
  } = api.package.getWithLatestStatusByTransferShipmentId.useQuery({
    transferShipmentId,
  })

  const [scannedPackageIds, setScannedPackageIds] = useState<number[]>([])

  const utils = api.useUtils()
  const { isLoading, mutate } = api.packageStatusLog.createMany.useMutation({
    onSuccess: () => {
      utils.package.getWithLatestStatusByTransferShipmentId.invalidate({
        transferShipmentId,
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
          .filter((_package) => _package.status === "TRANSFERRING_FORWARDER")
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
                  "TRANSFERRING_FORWARDER",
                )}`}
              >
                {supportedPackageStatusToHumanized("TRANSFERRING_FORWARDER")}
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
            const newStatusLogs = scannedPackageIds.map((packageId) => ({
              packageId,
              status: "TRANSFERRING_FORWARDER" as const,
              description: getDescriptionForNewPackageStatusLog(
                "TRANSFERRING_FORWARDER",
              ),
              createdAt: new Date(),
              createdById: auth.currentUser!.uid,
            }))

            mutate({
              newStatusLogs: [newStatusLogs[0], ...newStatusLogs.slice(1)],
            })
          }}
        >
          Save All
        </button>
      </div>
    </div>
  )
}

function SelectTransferShipment({
  selectedTransferShipmentId,
  setSelectedTransferShipmentId,
}: {
  selectedTransferShipmentId: null | number
  setSelectedTransferShipmentId: (id: null | number) => void
}) {
  const {
    status,
    data: transferShipments,
    error,
  } = api.transferShipment.getPreparing.useQuery()

  if (status === "loading") return <p>Loading ...</p>
  if (status === "error") return <p>Error {error.message}</p>
  if (transferShipments.length === 0) return <p>No transfer shipments</p>

  return (
    <select
      value={
        selectedTransferShipmentId === null
          ? ""
          : selectedTransferShipmentId.toString()
      }
      onChange={(e) => {
        if (e.currentTarget.value === "") setSelectedTransferShipmentId(null)
        else setSelectedTransferShipmentId(Number(e.currentTarget.value))
      }}
    >
      <option value="">Select a shipment ...</option>
      {transferShipments.map((transferShipment) => (
        <option
          key={transferShipment.id}
          value={transferShipment.id.toString()}
        >
          {transferShipment.id}
        </option>
      ))}
    </select>
  )
}

function MarkAsInTransit({
  transferShipmentId,
  resetSelectedTransferShipmentId,
}: {
  transferShipmentId: number
  resetSelectedTransferShipmentId: () => void
}) {
  const {
    status,
    data: packages,
    error,
  } = api.package.getWithLatestStatusByTransferShipmentId.useQuery({
    transferShipmentId,
  })

  const utils = api.useUtils()
  const { isLoading, mutate } =
    api.transferShipment.updateStatusToInTransitById.useMutation({
      onSuccess: () => {
        utils.transferShipment.getPreparing.invalidate()
        resetSelectedTransferShipmentId()
      },
    })

  if (status === "loading") return <p>Loading ...</p>
  if (status === "error") return <p>Error {error.message}</p>
  if (packages.length === 0) return <p>No packages.</p>

  const hasPendingPackages = packages.some(
    (_package) => _package.status !== "TRANSFERRING_FORWARDER",
  )

  return (
    <button
      type="button"
      disabled={isLoading || hasPendingPackages}
      className="bg-green-500 hover:bg-green-400 disabled:bg-green-300 text-white px-4 py-2 rounded-lg transition-colors font-medium"
      onClick={() => {
        mutate({
          id: transferShipmentId,
        })
      }}
    >
      Mark as In Transit
    </button>
  )
}

export function ScanPackageTransferTab({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: ScanPackageTab
  setSelectedTab: (tab: ScanPackageTab) => void
}) {
  const [selectedTransferShipmentId, setSelectedTransferShipmentId] = useState<
    null | number
  >(null)

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
                selectedTab === "TRANSFER"
                  ? "border-b-4 text-brand-cyan-500 border-brand-cyan-500"
                  : "text-gray-400 border-b-transparent"
              }
            `}
          onClick={() => setSelectedTab("TRANSFER")}
        >
          Transfer
        </button>
      </div>
      <div className="flex justify-between mb-3">
        <div>
          <SelectTransferShipment
            selectedTransferShipmentId={selectedTransferShipmentId}
            setSelectedTransferShipmentId={setSelectedTransferShipmentId}
          />
        </div>

        <div>
          {selectedTransferShipmentId && (
            <MarkAsInTransit
              transferShipmentId={selectedTransferShipmentId}
              resetSelectedTransferShipmentId={() =>
                setSelectedTransferShipmentId(null)
              }
            />
          )}
        </div>
      </div>
      {selectedTransferShipmentId && (
        <PackagesTable transferShipmentId={selectedTransferShipmentId} />
      )}
    </div>
  )
}

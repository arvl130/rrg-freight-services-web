import { api } from "@/utils/api"
import { getColorFromPackageStatus } from "@/utils/colors"
import { getDescriptionForNewPackageStatusLog } from "@/utils/constants"
import { supportedPackageStatusToHumanized } from "@/utils/humanize"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight"
import { getAuth } from "firebase/auth"
import type { ShipmentType } from "@/utils/constants"
import type { Package, PackageCategory } from "@/server/db/entities"
import type { SelectedTab } from "./tab-selector"
import { TabSelector } from "./tab-selector"

const scanPackageSchemaFormSchema = z.object({
  packageId: z.string().min(1, {
    message: "Please enter a package ID.",
  }),
})

type ScanPackageSchemaFormType = z.infer<typeof scanPackageSchemaFormSchema>

function ScanPackageForm({
  packageIds,
  scannedPackages,
  updatedPackageIds,
  onSubmitValidPackage,
}: {
  packageIds: string[]
  scannedPackages: SelectedPackage[]
  updatedPackageIds: string[]
  onSubmitValidPackage: (prop: SelectedPackage) => void
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

        if (scannedPackages.some(({ id }) => id === formData.packageId)) {
          toast("Package was already scanned.", {
            icon: "⚠️",
          })
          return
        }

        if (!packageIds.includes(formData.packageId)) {
          toast.error("Unrecognized Package")
          return
        }

        onSubmitValidPackage({
          id: formData.packageId,
          categoryId: null,
        })
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

type SelectedPackage = {
  id: string
  categoryId: number | null
}

type ValidSelectedPackage = {
  id: string
  categoryId: number
}

function TableItem(props: {
  item: Package
  isScanned: boolean
  isUpdatingStatus: boolean
  packageCategories: PackageCategory[]
  setSelectedPackage: (props: SelectedPackage) => void
  undoScan: () => void
}) {
  return (
    <div key={props.item.id} className="grid grid-cols-5 mb-1">
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
            {supportedPackageStatusToHumanized(props.item.status)}
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
              props.item.status,
            )}`}
          >
            {supportedPackageStatusToHumanized(props.item.status)}
          </span>
        </div>
      )}
      <div>
        {props.isScanned && (
          <select
            onChange={(e) => {
              if (e.currentTarget.value === "")
                props.setSelectedPackage({
                  id: props.item.id,
                  categoryId: null,
                })
              else
                props.setSelectedPackage({
                  id: props.item.id,
                  categoryId: Number(e.currentTarget.value),
                })
            }}
          >
            <option value="">Select a category ...</option>
            {props.packageCategories.map(({ id, displayName }) => (
              <option key={id} value={id}>
                {displayName}
              </option>
            ))}
          </select>
        )}
      </div>
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
    </div>
  )
}

function PackagesTable({ shipmentId }: { shipmentId: number }) {
  const packagesQuery = api.package.getWithLatestStatusByShipmentId.useQuery({
    shipmentId,
  })
  const packageCategoriesQuery = api.packageCategories.getAll.useQuery()
  const [scannedPackages, setScannedPackages] = useState<SelectedPackage[]>([])

  const utils = api.useUtils()
  const { isLoading, mutate } =
    api.shipment.package.updateManyToCompletedStatusWithCategory.useMutation({
      onSuccess: () => {
        utils.package.getWithLatestStatusByShipmentId.invalidate({
          shipmentId,
        })
        utils.package.getAll.invalidate()
        setScannedPackages([])
      },
    })

  if (packagesQuery.status === "loading") return <div>Loading ...</div>
  if (packagesQuery.status === "error")
    return <div>Error: {packagesQuery.error.message}</div>

  if (packageCategoriesQuery.status === "loading") return <div>Loading ...</div>
  if (packageCategoriesQuery.status === "error")
    return <div>Error: {packageCategoriesQuery.error.message}</div>

  return (
    <div>
      <ScanPackageForm
        packageIds={packagesQuery.data.map((_package) => _package.id)}
        scannedPackages={scannedPackages}
        updatedPackageIds={packagesQuery.data
          .filter((_package) => _package.status === "IN_WAREHOUSE")
          .map((_package) => _package.id)}
        onSubmitValidPackage={(props) =>
          setScannedPackages((currScannedPackages) => [
            ...currScannedPackages,
            props,
          ])
        }
      />
      <div className="grid grid-cols-5 font-medium">
        <div>Package ID</div>
        <div>Receiver</div>
        <div>Status</div>
        <div>Category</div>
        <div>Actions</div>
      </div>
      {packagesQuery.data.map((_package) => (
        <TableItem
          key={_package.id}
          item={_package}
          isScanned={scannedPackages.some(({ id }) => id === _package.id)}
          isUpdatingStatus={isLoading}
          packageCategories={packageCategoriesQuery.data}
          setSelectedPackage={(props) => {
            setScannedPackages((currScannedPackages) => [
              ...currScannedPackages.filter(({ id }) => id !== props.id),
              props,
            ])
          }}
          undoScan={() => {
            setScannedPackages((currScannedPackages) =>
              currScannedPackages.filter(({ id }) => id !== _package.id),
            )
          }}
        />
      ))}
      <div className="flex justify-end">
        <button
          type="button"
          className="font-medium bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 text-white transition-colors px-4 py-2 rounded-md"
          disabled={isLoading || scannedPackages.length === 0}
          onClick={() => {
            const auth = getAuth()
            const scannedPackagesNonNull =
              scannedPackages.filter<ValidSelectedPackage>(
                (props): props is ValidSelectedPackage =>
                  props.categoryId !== null,
              )

            if (scannedPackages.length !== scannedPackagesNonNull.length) {
              toast("One or more packages has an invalid category.", {
                icon: "⚠️",
              })
              return
            }

            mutate({
              shipmentId,
              shipmentPackageStatus: "COMPLETED" as const,
              packages: [
                scannedPackagesNonNull[0],
                ...scannedPackagesNonNull.slice(1),
              ],
              packageStatus: "IN_WAREHOUSE" as const,
              description: getDescriptionForNewPackageStatusLog("IN_WAREHOUSE"),
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
  } = api.shipment.warehouseTransfer.getInTransit.useQuery()

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
              <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-3">
                <div className="font-medium px-2 py-1">Shipment ID</div>
                <div className="font-medium px-2 py-1">Status</div>
                <div className="font-medium px-2 py-1">Sent to Warehouse</div>
                <div></div>
                {shipments.map((shipment) => (
                  <button
                    key={shipment.id}
                    className="group grid grid-cols-subgrid col-span-4 hover:bg-gray-100 border border-gray-300 hover:border-gray-100 py-2 rounded-lg transition-colors duration-200"
                    onClick={() => {
                      onSelectShipmentId(shipment.id)
                    }}
                  >
                    <p className="text-right px-2">{shipment.id}</p>
                    <p className="px-2">{shipment.type}</p>
                    <p className="text-left px-2">
                      {shipment.warehouseDisplayName}
                    </p>
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
    api.shipment.warehouseTransfer.updateStatusToCompletedById.useMutation({
      onSuccess: () => {
        utils.shipment.warehouseTransfer.getInTransit.invalidate()
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

export function WarehouseTransferReceivingTab({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: SelectedTab
  setSelectedTab: (tab: SelectedTab) => void
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
              <MarkAsCompleted
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

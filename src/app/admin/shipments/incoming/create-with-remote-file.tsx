import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type { WorkBook } from "xlsx"
import { utils, read } from "xlsx"
import { Fragment, useEffect, useRef, useState } from "react"
import type {
  PackageReceptionMode,
  PackageShippingMode,
  PackageShippingType,
} from "@/utils/constants"
import {
  REGEX_ONE_OR_MORE_DIGITS,
  REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS_INSIDE_PARENTHESIS,
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
} from "@/utils/constants"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { Check } from "@phosphor-icons/react/dist/ssr/Check"
import type {
  NormalizedPublicOverseasAgentUser,
  UploadedManifest,
  Warehouse,
} from "@/server/db/entities"
import { DateTime } from "luxon"
import { getColorOfUploadedManifestStatus } from "@/utils/colors"
import { getHumanizedOfuploadedManifestStatus } from "@/utils/humanize"

function SelectFileForm({
  uploadedManifests,
  setSelectedWorkBook,
  onSwitchTab,
}: {
  uploadedManifests: UploadedManifest[]
  setSelectedWorkBook: (wb: WorkBook) => void
  onSwitchTab: (tab: "DND" | "REMOTE_FILE") => void
}) {
  const [isDownloading, setIsDownloading] = useState(false)

  const apiUtils = api.useUtils()
  const requestReuploadMutation =
    api.uploadedManifest.updateStatusToRequestReuploadById.useMutation({
      onSuccess: () => {
        apiUtils.uploadedManifest.getAll.invalidate()
        toast.success("Re-upload requested.")
      },
    })

  return (
    <div className="px-4 py-3">
      {uploadedManifests.length === 0 ? (
        <div className="text-center">
          <p>No manifests have been uploaded.</p>
          <button
            type="button"
            className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
            onClick={() => {
              onSwitchTab("DND")
            }}
          >
            Use Local File
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between ">
            <div className="flex items-center font-semibold">
              List of manifests uploaded
            </div>
            <div>
              <button
                type="button"
                className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
                onClick={() => {
                  onSwitchTab("DND")
                }}
              >
                Use Local File
              </button>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(3,_auto),_1fr] mt-3">
            <div className="grid grid-cols-subgrid col-span-4 border border-gray-300 bg-gray-100">
              <div className="font-semibold px-3 py-2 border-r border-gray-300">
                ID
              </div>
              <div className="font-semibold px-3 py-2 border-r border-gray-300">
                Upload Date
              </div>
              <div className="font-semibold px-3 py-2 border-r border-gray-300">
                Status
              </div>
              <div className="font-semibold px-3 py-2">Actions</div>
            </div>
            {uploadedManifests.map((manifest) => (
              <div
                key={manifest.id}
                className="grid grid-cols-subgrid col-span-4 border-x border-b border-gray-300"
              >
                <div className="px-3 py-2 border-r border-gray-300">
                  {manifest.id}
                </div>
                <div className="px-3 py-2 border-r border-gray-300">
                  {DateTime.fromISO(manifest.createdAt).toLocaleString(
                    DateTime.DATETIME_FULL,
                  )}
                </div>
                <div className="px-3 py-2 border-r border-gray-300">
                  <span
                    className={`${getColorOfUploadedManifestStatus(
                      manifest.status,
                    )} text-white font-medium px-3 rounded-full text-sm py-1`}
                  >
                    {getHumanizedOfuploadedManifestStatus(manifest.status)}
                  </span>
                </div>
                <div className="px-3 py-2 flex gap-x-3 gap-y-2 flex-wrap">
                  {manifest.status === "PENDING_REVIEW" && (
                    <>
                      <button
                        type="button"
                        className="px-4 py-2 bg-green-500 hover:bg-green-400 transition-colors duration-200 disabled:bg-green-300 rounded-md text-white font-medium"
                        disabled={isDownloading}
                        onClick={async () => {
                          setIsDownloading(true)
                          try {
                            const response = await fetch(manifest.downloadUrl)
                            const data = await response.arrayBuffer()
                            const workbook = read(data)

                            setSelectedWorkBook(workbook)
                            setIsDownloading(false)
                          } catch (e) {
                            if (e instanceof Error) {
                              toast.error(e.message)
                            }

                            setIsDownloading(false)
                          }
                        }}
                      >
                        Create Shipment for Manifest
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-400 transition-colors duration-200 disabled:bg-purple-300 rounded-md text-white font-medium"
                        disabled={requestReuploadMutation.isLoading}
                        onClick={() => {
                          requestReuploadMutation.mutate({
                            id: manifest.id,
                          })
                        }}
                      >
                        Request Re-upload
                      </button>
                    </>
                  )}
                  {manifest.status === "SHIPMENT_CREATED" && (
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-500 hover:bg-green-400 transition-colors duration-200 disabled:bg-green-300 rounded-md text-white font-medium"
                    >
                      View Shipment
                    </button>
                  )}
                  <a
                    href={manifest.downloadUrl}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SelectSheetNameForm({
  selectedWorkBook,
  setSelectedSheetName,
}: {
  selectedWorkBook: WorkBook
  selectedSheetName: string
  setSelectedSheetName: (sheetName: string) => void
}) {
  return (
    <div className="px-4 py-2">
      <label className="mr-3">Choose a sheet to import:</label>
      <select
        className="px-3 py-1 bg-white border border-gray-300 rounded-md w-56"
        onChange={(e) => setSelectedSheetName(e.currentTarget.value)}
        defaultValue=""
      >
        {selectedWorkBook.SheetNames.map((sheetName) => (
          <option key={sheetName} value={sheetName}>
            {sheetName}
          </option>
        ))}
      </select>
    </div>
  )
}

const expectedColumns = [
  "Received Number",
  "Shipping Mode",
  "Shipping Type",
  "Reception Mode",
  "Weight In Kg",
  "Dimensions (Space Use)",
  "Sender Full Name",
  "Sender Contact Number",
  "Sender Email Address",
  "Sender Street Address",
  "Sender City",
  "Sender State/Province",
  "Sender Country Code",
  "Sender Postal Code",
  "Receiver Full Name",
  "Receiver Contact Number",
  "Receiver Email Address",
  "Receiver Street Address",
  "Receiver Barangay",
  "Receiver City",
  "Receiver State/Province",
  "Receiver Country Code",
  "Receiver Postal Code",
  "Fragile?",
  "Declared Value",
]

const sheetRowSchema = z.object({
  "Received Number": z.string().min(1).max(100),
  "Shipping Mode": z.custom<PackageShippingMode>((val) =>
    SUPPORTED_PACKAGE_SHIPPING_MODES.includes(val as PackageShippingMode),
  ),
  "Shipping Type": z.custom<PackageShippingType>((val) =>
    SUPPORTED_PACKAGE_SHIPPING_TYPES.includes(val as PackageShippingType),
  ),
  "Reception Mode": z.custom<PackageReceptionMode>((val) =>
    SUPPORTED_PACKAGE_RECEPTION_MODES.includes(val as PackageReceptionMode),
  ),
  "Weight In Kg": z.number(),
  "Dimensions (Space Use)": z
    .string()
    .regex(REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS_INSIDE_PARENTHESIS),
  "Sender Full Name": z.string().min(1).max(100),
  "Sender Contact Number": z.string().min(1).max(15),
  "Sender Email Address": z
    .string()
    .min(1)
    .max(100)
    .endsWith("@gmail.com")
    .email(),
  "Sender Street Address": z.string().min(1).max(255),
  "Sender City": z.string().min(1).max(100),
  "Sender State/Province": z.string().min(1).max(100),
  "Sender Country Code": z.string().min(1).max(3),
  "Sender Postal Code": z.number(),
  "Receiver Full Name": z.string().min(1).max(100),
  "Receiver Contact Number": z.string().min(1).max(15),
  "Receiver Email Address": z
    .string()
    .min(1)
    .max(100)
    .endsWith("@gmail.com")
    .email(),
  "Receiver Street Address": z.string().min(1).max(255),
  "Receiver Barangay": z.string().min(1).max(100),
  "Receiver City": z.string().min(1).max(100),
  "Receiver State/Province": z.string().min(1).max(100),
  "Receiver Country Code": z.string().min(1).max(3),
  "Receiver Postal Code": z.number(),
  "Fragile?": z.union([z.literal("Yes"), z.literal("No")]),
  "Declared Value": z.number().optional(),
})

type SheetRow = z.infer<typeof sheetRowSchema>

const chooseAgentFormSchema = z.object({
  sentByAgentId: z.string().length(28),
  warehouseId: z.string().regex(REGEX_ONE_OR_MORE_DIGITS),
})

type ChooseAgentFormType = z.infer<typeof chooseAgentFormSchema>

function ChooseAgentForm({
  warehouses,
  agents,
  sheetRows,
  reset,
  onSuccess,
  invalidAddressesCount,
}: {
  warehouses: Warehouse[]
  agents: NormalizedPublicOverseasAgentUser[]
  sheetRows: SheetRow[]
  invalidAddressesCount: number
  reset: () => void
  onClose: () => void
  onSuccess: (newShipmentId: number) => void
}) {
  const apiUtils = api.useUtils()
  const { isLoading, mutate } = api.shipment.incoming.create.useMutation({
    onSuccess: ({ shipmentId }) => {
      apiUtils.shipment.incoming.getAll.invalidate()
      apiUtils.package.getInWarehouse.invalidate()
      apiUtils.package.getAll.invalidate()
      onSuccess(shipmentId)
      toast.success("Shipment Created")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm<ChooseAgentFormType>({
    resolver: zodResolver(chooseAgentFormSchema),
  })

  return (
    <form
      onSubmit={handleSubmit((formData) => {
        mutate({
          destinationWarehouseId: Number(formData.warehouseId),
          sentByAgentId: formData.sentByAgentId,
          newPackages: sheetRows.map((newPackage) => ({
            preassignedId: newPackage["Received Number"],
            shippingMode: newPackage["Shipping Mode"],
            shippingType: newPackage["Shipping Type"],
            receptionMode: newPackage["Reception Mode"],
            weightInKg: newPackage["Weight In Kg"],
            volumeInCubicMeter: Number(
              newPackage["Dimensions (Space Use)"].match(
                REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS_INSIDE_PARENTHESIS,
              )![1],
            ),
            senderFullName: newPackage["Sender Full Name"],
            senderContactNumber: newPackage["Sender Contact Number"],
            senderEmailAddress: newPackage["Sender Email Address"],
            senderStreetAddress: newPackage["Sender Street Address"],
            senderCity: newPackage["Sender City"],
            senderStateOrProvince: newPackage["Sender State/Province"],
            senderCountryCode: newPackage["Sender Country Code"],
            senderPostalCode: newPackage["Sender Postal Code"],
            receiverFullName: newPackage["Receiver Full Name"],
            receiverContactNumber: newPackage["Receiver Contact Number"],
            receiverEmailAddress: newPackage["Receiver Email Address"],
            receiverStreetAddress: newPackage["Receiver Street Address"],
            receiverBarangay: newPackage["Receiver Barangay"],
            receiverCity: newPackage["Receiver City"],
            receiverStateOrProvince: newPackage["Receiver State/Province"],
            receiverCountryCode: newPackage["Receiver Country Code"],
            receiverPostalCode: newPackage["Receiver Postal Code"],
            isFragile: newPackage["Fragile?"] === "Yes",
            declaredValue: newPackage["Declared Value"] ?? null,
          })),
        })
      })}
    >
      {invalidAddressesCount === 0 && (
        <div className="mt-3">
          <div>
            <p className="font-medium">
              Select the warehouse that will receive this shipment:
              <select
                {...register("warehouseId")}
                className="bg-white ml-2 px-3 py-1.5 border border-gray-300 rounded-md"
              >
                <option value="">Choose ...</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.displayName}
                  </option>
                ))}
              </select>
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-between gap-3 pt-2">
        {invalidAddressesCount === 0 ? (
          <div>
            <p className="font-medium">
              Select the agent that will monitor this shipment:
              <select
                {...register("sentByAgentId")}
                className="bg-white ml-2 px-3 py-1.5 border border-gray-300 rounded-md"
              >
                <option value="">Choose ...</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.displayName} ({agent.companyName})
                  </option>
                ))}
              </select>
            </p>
            <p className="text-gray-500">
              Typically, this is the agent that sent the file.
            </p>
          </div>
        ) : (
          <div className="text-red-500 font-medium">
            {invalidAddressesCount} invalid{" "}
            {invalidAddressesCount === 1 ? "address has" : "addresses have"}{" "}
            been detected. Please fix them and re-import the file.
            <div className="text-black">
              {" "}
              <a
                className="underline font-extrabold"
                href="/assets/pdf/location_cheker.pdf"
                target="_blank"
              >
                click here
              </a>{" "}
              to see correct location&apos;s name
            </div>
          </div>
        )}
        <div className="space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-sky-500 hover:bg-sky-50 transition-colors rounded-lg text-sky-500 font-medium"
            onClick={reset}
          >
            Change File
          </button>

          <button
            type="button"
            className="bg-sky-500 hover:bg-sky-400 disabled:bg-sky-300 transition-colors text-white px-4 py-2 rounded-md font-medium"
            disabled={isLoading || !isValid || invalidAddressesCount > 0}
          >
            Import
          </button>
        </div>
      </div>
    </form>
  )
}

function ReceiverAddressValidity({
  provinceName,
  cityName,
  barangayName,
  onAllValid,
}: {
  provinceName: string
  cityName: string
  barangayName: string
  onAllValid: () => void
}) {
  const hasAttemptedValidation = useRef(false)
  const { status, data, error } =
    api.addressValidation.getValidityByName.useQuery(
      {
        provinceName: provinceName,
        cityName: cityName,
        barangayName: barangayName,
      },
      {
        refetchOnWindowFocus: false,
      },
    )

  useEffect(() => {
    if (
      !hasAttemptedValidation.current &&
      data &&
      [data.province.isValid, data.city.isValid, data.barangay.isValid].every(
        Boolean,
      )
    ) {
      hasAttemptedValidation.current = true
      onAllValid()
    }
  }, [data, hasAttemptedValidation, onAllValid])

  return (
    <div
      className="px-1.5 py-1 space-x-2"
      style={{
        gridColumn: `span ${expectedColumns.length} / span ${expectedColumns.length}`,
      }}
    >
      {status === "loading" && <>Checking consignee address validity ...</>}
      {status === "error" && <>Error occured: {error.message}</>}
      {status === "success" && (
        <>
          <div
            className={`inline-flex gap-1 items-center px-2 py-1 rounded-full text-white text-sm font-medium ${
              data.province.isValid ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {data.province.isValid ? (
              <Check size={16} weight="bold" />
            ) : (
              <X size={16} className="text-red-500" weight="bold" />
            )}
            Province
          </div>
          <div
            className={`inline-flex gap-1 items-center px-2 py-1 rounded-full text-white text-sm font-medium ${
              data.city.isValid ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {data.city.isValid ? (
              <Check size={16} weight="bold" />
            ) : (
              <X size={16} className="text-red-500" weight="bold" />
            )}
            City
          </div>
          <div
            className={`inline-flex gap-1 items-center px-2 py-1 rounded-full text-white text-sm font-medium ${
              data.barangay.isValid ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {data.barangay.isValid ? (
              <Check size={16} weight="bold" />
            ) : (
              <X size={16} className="text-red-500" weight="bold" />
            )}
            Barangay
          </div>
        </>
      )}
    </div>
  )
}

function SenderColumn(props: { sheetRow: SheetRow }) {
  return (
    <div>
      <div className="font-medium">Sender</div>

      <div>{props.sheetRow["Sender Full Name"]}</div>
      <div>{props.sheetRow["Sender Contact Number"]}</div>
      <div>{props.sheetRow["Sender Email Address"]}</div>
      <div>{props.sheetRow["Sender Street Address"]}</div>
      <div>
        {props.sheetRow["Sender City"]},{" "}
        {props.sheetRow["Sender State/Province"]}
      </div>
      <div>
        {props.sheetRow["Sender Country Code"]},{" "}
        {props.sheetRow["Sender Postal Code"]}
      </div>
      <div></div>
    </div>
  )
}

function ReceiverColumn(props: {
  sheetRow: SheetRow
  onAddressValid: () => void
}) {
  return (
    <div>
      <div className="font-medium">Receiver</div>
      <div>{props.sheetRow["Receiver Full Name"]}</div>
      <div>{props.sheetRow["Receiver Contact Number"]}</div>
      <div>{props.sheetRow["Receiver Email Address"]}</div>
      <div>
        {props.sheetRow["Receiver Street Address"]}, Brgy.{" "}
        {props.sheetRow["Receiver Barangay"]}
      </div>
      <div>
        {props.sheetRow["Receiver City"]},{" "}
        {props.sheetRow["Receiver State/Province"]}
      </div>
      <div>
        {props.sheetRow["Receiver Country Code"]}{" "}
        {props.sheetRow["Receiver Postal Code"]}
      </div>
      <ReceiverAddressValidity
        provinceName={props.sheetRow["Receiver State/Province"]}
        cityName={props.sheetRow["Receiver City"]}
        barangayName={props.sheetRow["Receiver Barangay"]}
        onAllValid={props.onAddressValid}
      />
    </div>
  )
}

function DetailsColumn(props: { sheetRow: SheetRow }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-3">
      <div className="text-right font-medium">
        Tracking Number (from agent):
      </div>
      <div>{props.sheetRow["Received Number"]}</div>

      <div className="text-right font-medium">Shipping Mode:</div>
      <div>
        {props.sheetRow["Shipping Mode"] === "AIR"
          ? "Air Freight"
          : "Sea Cargo"}
      </div>

      <div className="text-right font-medium">Shipping Type:</div>
      <div>{props.sheetRow["Shipping Type"]}</div>

      <div className="text-right font-medium">Reception Mode:</div>
      <div>
        {props.sheetRow["Reception Mode"] === "DOOR_TO_DOOR"
          ? "Door to Door"
          : "For Pickup"}
      </div>

      <div className="text-right font-medium">Weight In KG:</div>
      <div>{props.sheetRow["Weight In Kg"]}</div>

      <div className="text-right font-medium">Dimensions (Space Use):</div>
      <div>{props.sheetRow["Dimensions (Space Use)"]}</div>

      <div className="text-right font-medium">Fragile?:</div>
      <div>{props.sheetRow["Fragile?"]}</div>

      <div className="text-right font-medium">Declared Value:</div>
      <div>{props.sheetRow["Declared Value"]}</div>
    </div>
  )
}

function ValidSheetRow(props: {
  sheetRow: SheetRow
  onAddressValid: () => void
}) {
  return (
    <div className="grid grid-cols-[auto_auto_1fr] gap-x-3 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 border-b border-gray-300">
      <DetailsColumn sheetRow={props.sheetRow} />
      <SenderColumn sheetRow={props.sheetRow} />
      <ReceiverColumn
        sheetRow={props.sheetRow}
        onAddressValid={props.onAddressValid}
      />
    </div>
  )
}

function HasValidSheetRows({
  sheetName,
  sheetRows,
  validAddressCount,
  reset,
  onClose,
  onSuccess,
  onValidAddress,
}: {
  sheetName: string
  sheetRows: SheetRow[]
  validAddressCount: number
  reset: () => void
  onClose: () => void
  onSuccess: (newShipmentId: number) => void
  onValidAddress: () => void
}) {
  const getOverseasAgentsQuery = api.user.getOverseasAgents.useQuery()
  const getWarehousesQuery = api.warehouse.getAll.useQuery()

  return (
    <div className="px-4 grid grid-rows-[1fr_auto] overflow-auto">
      <div className="h-full overflow-auto border border-gray-300 grid auto-rows-min">
        {sheetRows.map((newPackage, index) => (
          <ValidSheetRow
            key={`${sheetName}-${index}`}
            sheetRow={newPackage}
            onAddressValid={() => {
              onValidAddress()
            }}
          />
        ))}
      </div>
      {getOverseasAgentsQuery.status === "loading" && (
        <div>Loading agents ...</div>
      )}
      {getOverseasAgentsQuery.status === "error" && (
        <div>
          Error while loading agents: {getOverseasAgentsQuery.error.message}
        </div>
      )}
      {getOverseasAgentsQuery.status === "success" && (
        <>
          {getWarehousesQuery.status === "loading" && (
            <div>Loading warehouses ...</div>
          )}
          {getWarehousesQuery.status === "error" && (
            <div>
              Error while loading warehouses: {getWarehousesQuery.error.message}
            </div>
          )}
          {getWarehousesQuery.status === "success" && (
            <ChooseAgentForm
              warehouses={getWarehousesQuery.data}
              agents={getOverseasAgentsQuery.data}
              sheetRows={sheetRows}
              reset={() => reset()}
              onClose={onClose}
              onSuccess={onSuccess}
              invalidAddressesCount={sheetRows.length - validAddressCount}
            />
          )}
        </>
      )}
    </div>
  )
}

function HasValidSheetName({
  selectedWorkBook,
  selectedSheetName,
  reset,
  onClose,
  onSuccess,
  validAddressCount,
  onValidAddress,
}: {
  selectedWorkBook: WorkBook
  selectedSheetName: string
  reset: () => void
  onClose: () => void
  onSuccess: (newShipmentId: number) => void
  validAddressCount: number
  onValidAddress: () => void
}) {
  const sheetRowsRaw = utils.sheet_to_json<Record<string, unknown>>(
    selectedWorkBook.Sheets[selectedSheetName],
  )

  const parseArrayResult = sheetRowSchema.array().safeParse(sheetRowsRaw)

  if (parseArrayResult.success) {
    if (parseArrayResult.data.length === 0)
      return <div>Selected sheet has no rows.</div>
    else
      return (
        <HasValidSheetRows
          sheetName={selectedSheetName}
          sheetRows={parseArrayResult.data}
          reset={reset}
          onClose={onClose}
          validAddressCount={validAddressCount}
          onSuccess={onSuccess}
          onValidAddress={onValidAddress}
        />
      )
  } else {
    const rowsWithErrors = Object.keys(
      parseArrayResult.error.flatten().fieldErrors,
    )

    return (
      <div className="px-4 grid grid-rows-[auto_1fr] overflow-auto">
        <p className="mb-3">
          One or more or rows in this sheet contains errors. Please recheck its
          contents.
        </p>
        <div
          className="h-full overflow-auto border border-gray-300 grid auto-rows-min"
          style={{
            gridTemplateColumns: `repeat(${expectedColumns.length}, auto)`,
          }}
        >
          {expectedColumns.map((column) => (
            <div
              key={column}
              className="px-1.5 py-1 font-medium whitespace-nowrap"
            >
              {column}
            </div>
          ))}
          {rowsWithErrors.map((row) => {
            const parseRowResult = sheetRowSchema.safeParse(
              sheetRowsRaw[row as keyof typeof sheetRowsRaw],
            )

            if (!parseRowResult.success) {
              const fieldsWithErrors = Object.keys(
                parseRowResult.error.flatten().fieldErrors,
              )
              const newPackage = sheetRowsRaw[row as any] as SheetRow

              return (
                <Fragment key={row}>
                  {expectedColumns.map((column) => (
                    <div
                      key={column}
                      className={`px-1.5 py-1 ${
                        fieldsWithErrors.includes(column) ? "bg-red-300" : ""
                      }`}
                    >
                      {typeof newPackage[column as keyof SheetRow] !==
                        "undefined" && newPackage[column as keyof SheetRow]}
                    </div>
                  ))}
                </Fragment>
              )
            }
          })}
        </div>
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 border border-sky-500 hover:bg-sky-50 transition-colors rounded-lg text-sky-500 font-medium"
            onClick={reset}
          >
            Change File
          </button>
        </div>
      </div>
    )
  }
}

function HasValidWorkBook(props: {
  workbook: WorkBook
  onReset: () => void
  onClose: () => void
  onSuccess: (newShipmentId: number) => void
}) {
  const [selectedSheetName, setSelectedSheetName] = useState(
    props.workbook.SheetNames[0],
  )
  const [validAddressCount, setValidAddressCount] = useState(0)

  return (
    <>
      <div className="px-4 py-2 grid grid-rows-[auto_1fr] overflow-auto">
        <SelectSheetNameForm
          selectedWorkBook={props.workbook}
          selectedSheetName={selectedSheetName}
          setSelectedSheetName={(sheetName) => {
            setSelectedSheetName(sheetName)
            setValidAddressCount(0)
          }}
        />
        {selectedSheetName && (
          <HasValidSheetName
            selectedWorkBook={props.workbook}
            selectedSheetName={selectedSheetName}
            reset={props.onReset}
            onClose={props.onClose}
            onSuccess={props.onSuccess}
            validAddressCount={validAddressCount}
            onValidAddress={() => {
              setValidAddressCount(
                (currValidAddressCount) => currValidAddressCount + 1,
              )
            }}
          />
        )}
      </div>
    </>
  )
}

export function CreateWithRemoteFile({
  uploadedManifests,
  isOpen,
  onClose,
  onSuccess,
  onSwitchTab,
}: {
  uploadedManifests: UploadedManifest[]
  isOpen: boolean
  onClose: () => void
  onSwitchTab: (tab: "DND" | "REMOTE_FILE") => void
  onSuccess: (newShipmentId: number) => void
}) {
  const [selectedWorkbook, setSelectedWorkBook] = useState<null | WorkBook>(
    null,
  )

  useEffect(() => {
    if (!isOpen) {
      setSelectedWorkBook(null)
    }
  }, [isOpen])

  if (selectedWorkbook === null)
    return (
      <SelectFileForm
        uploadedManifests={uploadedManifests}
        setSelectedWorkBook={(wb) => setSelectedWorkBook(wb)}
        onSwitchTab={onSwitchTab}
      />
    )

  return (
    <>
      {selectedWorkbook.SheetNames.length === 0 ? (
        <div className="px-4 py-2 flex justify-center items-center">
          <p className="max-w-md">
            This file selected seems to be broken (no sheets were found). Please
            try using another file.
          </p>
        </div>
      ) : (
        <HasValidWorkBook
          workbook={selectedWorkbook}
          onReset={() => {
            setSelectedWorkBook(null)
          }}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}

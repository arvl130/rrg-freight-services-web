import { zodResolver } from "@hookform/resolvers/zod"
import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import { ZodError, z } from "zod"
import type { WorkBook } from "xlsx"
import { utils, read } from "xlsx"
import { Fragment, useCallback, useEffect, useState } from "react"
import type {
  PackageReceptionMode,
  PackageShippingMode,
  PackageShippingType,
} from "@/utils/constants"
import {
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
} from "@/utils/constants"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { CloudArrowUp } from "@phosphor-icons/react/dist/ssr/CloudArrowUp"
import { ArrowCircleDown } from "@phosphor-icons/react/dist/ssr/ArrowCircleDown"
import type { User } from "@/server/db/entities"
import type { FileRejection } from "react-dropzone"
import { useDropzone } from "react-dropzone"

function SelectFileForm({
  setSelectedWorkBook,
}: {
  setSelectedWorkBook: (wb: WorkBook) => void
}) {
  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const combinedFiles = [...acceptedFiles, ...rejectedFiles]
      if (combinedFiles.length === 0) return
      if (combinedFiles.length > 1) {
        toast.error("Please drop only one (1) file.")
        return
      }

      if (acceptedFiles.length === 0) return
      if (acceptedFiles.length > 1) {
        toast.error("Please drop only one (1) file.")
        return
      }

      const [sheetFile] = acceptedFiles
      const buffer = await sheetFile.arrayBuffer()
      const workBook = read(buffer)

      setSelectedWorkBook(workBook)
    },
    [setSelectedWorkBook],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.oasis.opendocument.spreadsheet": [".ods"],
    },
  })

  return (
    <div className="px-4 pt-2 pb-4 grid grid-rows-[auto_1fr]">
      <div className="mb-3">
        <p className="font-semibold text-lg">Choose a file to import</p>
        <p className="text-gray-500">
          Supported file formats <code>.xlsx</code>, <code>.xls</code>, and{" "}
          <code>.ods</code> are supported.
        </p>
      </div>
      <div
        {...getRootProps({
          className: `px-4 py-2 border-4 border-dashed border-cyan-300 rounded-2xl ${
            isDragActive ? "bg-cyan-100" : "bg-cyan-50"
          } transition-colors duration-75 flex items-center justify-center`,
        })}
      >
        <input
          {...getInputProps({
            className:
              "block w-full text-sm border border-gray-300 px-1.5 py-1.5 mb-3 rounded-lg",
          })}
        />

        <div className="flex flex-col items-center">
          {isDragActive ? (
            <>
              <ArrowCircleDown size={96} className="text-gray-700" />

              <p className="font-semibold mb-3 text-center">Drop it here!</p>
            </>
          ) : (
            <>
              <CloudArrowUp size={96} className="text-gray-700" />

              <p className="font-semibold mb-3 text-center">
                Drag & Drop your file here
              </p>
              <span className="bg-cyan-500 disabled:bg-cyan-300 hover:bg-cyan-400 transition-colors text-white font-medium px-4 py-2 rounded-md">
                Select File
              </span>
            </>
          )}
        </div>
      </div>
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
  "Sender Full Name": z.string().min(1).max(100),
  "Sender Contact Number": z.string().min(1).max(15),
  "Sender Email Address": z.string().min(1).max(100),
  "Sender Street Address": z.string().min(1).max(255),
  "Sender City": z.string().min(1).max(100),
  "Sender State/Province": z.string().min(1).max(100),
  "Sender Country Code": z.string().min(1).max(3),
  "Sender Postal Code": z.number(),
  "Receiver Full Name": z.string().min(1).max(100),
  "Receiver Contact Number": z.string().min(1).max(15),
  "Receiver Email Address": z.string().min(1).max(100),
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
})

type ChooseAgentFormType = z.infer<typeof chooseAgentFormSchema>

function ChooseAgentForm({
  agents,
  sheetRows,
  reset,
  close,
}: {
  agents: User[]
  sheetRows: SheetRow[]
  reset: () => void
  close: () => void
}) {
  const apiUtils = api.useUtils()
  const { isLoading, mutate } = api.shipment.incoming.create.useMutation({
    onSuccess: () => {
      apiUtils.shipment.incoming.getAll.invalidate()
      apiUtils.package.getInWarehouse.invalidate()
      apiUtils.package.getAll.invalidate()
      close()
      toast.success("Shipment Created")
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
          sentByAgentId: formData.sentByAgentId,
          newPackages: sheetRows.map((newPackage) => ({
            preassignedId: newPackage["Received Number"],
            shippingMode: newPackage["Shipping Mode"],
            shippingType: newPackage["Shipping Type"],
            receptionMode: newPackage["Reception Mode"],
            weightInKg: newPackage["Weight In Kg"],
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
      className="flex justify-between gap-3 pt-2"
    >
      <div>
        <select {...register("sentByAgentId")} defaultValue="">
          <option value="">Select an agent ...</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.displayName}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className="px-4 py-2 border border-sky-500 hover:bg-sky-50 transition-colors rounded-lg text-sky-500 font-medium"
          onClick={reset}
        >
          Change File
        </button>

        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-400 disabled:bg-sky-300 transition-colors text-white px-4 py-2 rounded-md font-medium"
          disabled={isLoading || !isValid}
        >
          Import
        </button>
      </div>
    </form>
  )
}

function CreatePackagesForm({
  selectedWorkBook,
  selectedSheetName,
  reset,
  close,
}: {
  selectedWorkBook: WorkBook
  selectedSheetName: string
  reset: () => void
  close: () => void
}) {
  const sheetRowsRaw = utils.sheet_to_json<Record<string, unknown>>(
    selectedWorkBook.Sheets[selectedSheetName],
  )

  const { status, data: agents, error } = api.user.getOverseasAgents.useQuery()
  const parseArrayResult = sheetRowSchema.array().safeParse(sheetRowsRaw)

  if (parseArrayResult.success) {
    if (parseArrayResult.data.length === 0)
      return <div>Selected sheet has no rows.</div>

    return (
      <div className="px-4 grid grid-rows-[1fr_auto] overflow-auto">
        <div
          className="h-full overflow-auto border border-gray-300 grid auto-rows-min"
          style={{
            gridTemplateColumns: `repeat(${expectedColumns.length}, auto)`,
          }}
        >
          {expectedColumns.map((key) => (
            <div
              key={key}
              className="px-1.5 py-1 font-medium whitespace-nowrap"
            >
              {key}
            </div>
          ))}
          {parseArrayResult.data.map((newPackage, index) => {
            return (
              <Fragment key={index}>
                {expectedColumns.map((key) => (
                  <div key={key} className="w-full px-1.5 py-1">
                    {newPackage[key as keyof typeof newPackage]}
                  </div>
                ))}
              </Fragment>
            )
          })}
        </div>
        {status === "loading" && <div>Loading agents ...</div>}
        {status === "error" && (
          <div>Error while loading agents. {error.message}</div>
        )}
        {status === "success" && (
          <ChooseAgentForm
            agents={agents}
            sheetRows={parseArrayResult.data}
            reset={() => reset()}
            close={() => close()}
          />
        )}
      </div>
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
}) {
  const [selectedSheetName, setSelectedSheetName] = useState(
    props.workbook.SheetNames[0],
  )

  return (
    <>
      <div className="px-4 py-2 grid grid-rows-[auto_1fr] overflow-auto">
        <SelectSheetNameForm
          selectedWorkBook={props.workbook}
          selectedSheetName={selectedSheetName}
          setSelectedSheetName={(sheetName) => setSelectedSheetName(sheetName)}
        />
        {props.workbook && selectedSheetName && (
          <CreatePackagesForm
            selectedWorkBook={props.workbook}
            selectedSheetName={selectedSheetName}
            reset={props.onReset}
            close={close}
          />
        )}
      </div>
    </>
  )
}

export function CreateModal({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: () => void
}) {
  const [selectedWorkbook, setSelectedWorkBook] = useState<null | WorkBook>(
    null,
  )

  useEffect(() => {
    if (!isOpen) {
      setSelectedWorkBook(null)
    }
  }, [isOpen])

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_56rem)] h-[32rem] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            New Incoming Shipment
          </Dialog.Title>
          {selectedWorkbook === null ? (
            <SelectFileForm
              setSelectedWorkBook={(wb) => setSelectedWorkBook(wb)}
            />
          ) : (
            <>
              {selectedWorkbook.SheetNames.length === 0 ? (
                <div className="px-4 py-2 flex justify-center items-center">
                  <p className="max-w-md">
                    This file selected seems to be broken (no sheets were
                    found). Please try using another file.
                  </p>
                </div>
              ) : (
                <HasValidWorkBook
                  workbook={selectedWorkbook}
                  onReset={() => {
                    setSelectedWorkBook(null)
                  }}
                  onClose={() => {
                    close()
                  }}
                />
              )}
            </>
          )}

          <Dialog.Close asChild>
            <button
              type="button"
              className="text-white absolute top-3 right-3"
              onClick={close}
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

import "@/utils/firebase"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import * as Dialog from "@radix-ui/react-dialog"
import { z } from "zod"
import type { WorkBook } from "xlsx"
import { utils, read } from "xlsx"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import type {
  PackageReceptionMode,
  PackageShippingMode,
  PackageShippingType,
} from "@/utils/constants"
import {
  REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS_INSIDE_PARENTHESIS,
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
} from "@/utils/constants"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { Check } from "@phosphor-icons/react/dist/ssr/Check"
import { CloudArrowUp } from "@phosphor-icons/react/dist/ssr/CloudArrowUp"
import { ArrowCircleDown } from "@phosphor-icons/react/dist/ssr/ArrowCircleDown"
import type { FileRejection } from "react-dropzone"
import { useDropzone } from "react-dropzone"

function SelectFileForm({
  setSelectedFileAndWorkBook,
}: {
  setSelectedFileAndWorkBook: (input: { wb: WorkBook; file: File }) => void
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

      setSelectedFileAndWorkBook({
        file: sheetFile,
        wb: workBook,
      })
    },
    [setSelectedFileAndWorkBook],
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
          Supported file formats are <code>.xlsx</code>, <code>.xls</code>, and{" "}
          <code>.ods</code>.
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

function UploadFileForm({
  id,
  invalidAddressesCount,
  sheetFile,
  reset,
  onClose,
}: {
  id: number
  invalidAddressesCount: number
  sheetFile: File
  reset: () => void
  onClose: () => void
}) {
  const [isUploading, setIsUploading] = useState(false)

  const apiUtils = api.useUtils()
  const { isPending, mutate } = api.uploadedManifest.updateById.useMutation({
    onSuccess: () => {
      apiUtils.uploadedManifest.getByCurrentUser.invalidate()
      toast.success("Manifest Updated")
      onClose()
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: () => {
      setIsUploading(false)
    },
  })

  return (
    <div>
      <div className="flex justify-between gap-3 pt-2">
        {invalidAddressesCount === 0 ? (
          <div></div>
        ) : (
          <div className="text-red-500 font-medium">
            {invalidAddressesCount} invalid{" "}
            {invalidAddressesCount === 1 ? "address has" : "addresses have"}{" "}
            been detected. Please fix them and re-import the file.
            <div className="">
              Click{" "}
              <a
                className="text-black underline font-semibold"
                href="/assets/pdf/location_cheker.pdf"
                target="_blank"
              >
                here
              </a>{" "}
              to see the list of valid addresses.
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
            disabled={isUploading || invalidAddressesCount > 0 || isPending}
            onClick={async () => {
              setIsUploading(true)
              try {
                const storage = getStorage()
                const refPath = `manifests/${crypto.randomUUID()}`
                const manifestRef = ref(storage, refPath)

                await uploadBytes(manifestRef, sheetFile, {
                  contentType: sheetFile.type,
                })

                const downloadUrl = await getDownloadURL(manifestRef)
                mutate({
                  id,
                  downloadUrl,
                })
              } catch {
                setIsUploading(false)
              }
            }}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
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
      {status === "pending" && <>Checking consignee address validity ...</>}
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
  id,
  sheetName,
  sheetRows,
  sheetFile,
  validAddressCount,
  reset,
  onClose,
  onValidAddress,
}: {
  id: number
  sheetName: string
  sheetRows: SheetRow[]
  sheetFile: File
  validAddressCount: number
  reset: () => void
  onClose: () => void
  onValidAddress: () => void
}) {
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
      <UploadFileForm
        id={id}
        sheetFile={sheetFile}
        reset={() => reset()}
        onClose={onClose}
        invalidAddressesCount={sheetRows.length - validAddressCount}
      />
    </div>
  )
}

function HasValidSheetName({
  id,
  selectedWorkBook,
  sheetFile,
  selectedSheetName,
  reset,
  onClose,
  validAddressCount,
  onValidAddress,
}: {
  id: number
  selectedWorkBook: WorkBook
  sheetFile: File
  selectedSheetName: string
  reset: () => void
  onClose: () => void
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
          id={id}
          sheetName={selectedSheetName}
          sheetRows={parseArrayResult.data}
          validAddressCount={validAddressCount}
          sheetFile={sheetFile}
          reset={reset}
          onClose={onClose}
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
  id: number
  workbook: WorkBook
  sheetFile: File
  onReset: () => void
  onClose: () => void
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
            id={props.id}
            selectedWorkBook={props.workbook}
            sheetFile={props.sheetFile}
            selectedSheetName={selectedSheetName}
            reset={props.onReset}
            onClose={props.onClose}
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

export function ReuploadManifestModal({
  id,
  isOpen,
  onClose,
}: {
  id: number
  isOpen: boolean
  onClose: () => void
}) {
  const [selectedFileAndWorkbook, setSelectedFileAndWorkBook] =
    useState<null | {
      wb: WorkBook
      file: File
    }>(null)

  useEffect(() => {
    if (!isOpen) {
      setSelectedFileAndWorkBook(null)
    }
  }, [isOpen])

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_72rem)] h-[calc(100svh_-_1rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            New Manifest
          </Dialog.Title>
          {selectedFileAndWorkbook === null ? (
            <SelectFileForm
              setSelectedFileAndWorkBook={(input) =>
                setSelectedFileAndWorkBook(input)
              }
            />
          ) : (
            <>
              {selectedFileAndWorkbook.wb.SheetNames.length === 0 ? (
                <div className="px-4 py-2 flex justify-center items-center">
                  <p className="max-w-md">
                    This file selected seems to be broken (no sheets were
                    found). Please try using another file.
                  </p>
                </div>
              ) : (
                <HasValidWorkBook
                  id={id}
                  workbook={selectedFileAndWorkbook.wb}
                  sheetFile={selectedFileAndWorkbook.file}
                  onReset={() => {
                    setSelectedFileAndWorkBook(null)
                  }}
                  onClose={onClose}
                />
              )}
            </>
          )}

          <Dialog.Close asChild>
            <button
              type="button"
              className="text-white absolute top-3 right-3"
              onClick={onClose}
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

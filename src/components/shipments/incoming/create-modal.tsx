import { zodResolver } from "@hookform/resolvers/zod"
import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import { ZodError, z } from "zod"
import { utils, read, WorkBook } from "xlsx"
import { useEffect, useState } from "react"
import {
  PackageReceptionMode,
  PackageShippingMode,
  PackageShippingType,
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
} from "@/utils/constants"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { User } from "@/server/db/entities"

const selectFileFormSchema = z.object({
  sheetFiles: z.custom<FileList>(
    (val) => {
      return (val as FileList)?.length === 1
    },
    {
      message: "Please select a file.",
    },
  ),
})

type SelectFileFormType = z.infer<typeof selectFileFormSchema>

function SelectFileForm({
  setSelectedWorkBook,
}: {
  setSelectedWorkBook: (wb: WorkBook) => void
}) {
  const {
    register,
    formState: { isValid },
    handleSubmit,
  } = useForm<SelectFileFormType>({
    resolver: zodResolver(selectFileFormSchema),
  })

  return (
    <form
      className="px-4 py-2"
      onSubmit={handleSubmit(async (formData) => {
        const [sheetFile] = formData.sheetFiles
        const buffer = await sheetFile.arrayBuffer()
        const workBook = read(buffer)

        setSelectedWorkBook(workBook)
      })}
    >
      <p className="mb-1">
        Select an .xlsx, .xls., or .csv file to be imported
      </p>
      <input
        type="file"
        className="block w-full text-sm border border-gray-300 px-1.5 py-1.5 mb-3 rounded-lg"
        accept="
      application/vnd.ms-excel,
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
      application/vnd.oasis.opendocument.spreadsheet,
      text/csv
    "
        {...register("sheetFiles")}
      />
      <button
        type="submit"
        className="bg-cyan-500 disabled:bg-cyan-300 hover:bg-cyan-400 transition-colors text-white font-medium px-4 py-2 rounded-md"
        disabled={!isValid}
      >
        Select File
      </button>
    </form>
  )
}

function SelectSheetNameForm({
  selectedWorkBook,
  setSelectedSheetName,
}: {
  selectedWorkBook: WorkBook
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
        <option value="" disabled>
          Select ...
        </option>
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
  "Shipping Mode",
  "Shipping Type",
  "Reception Mode",
  "Weight In ",
  "Sender Full ",
  "Sender Contact ",
  "Sender Email ",
  "Sender Street ",
  "Sender City",
  "Sender State/",
  "Sender Country ",
  "Sender Postal ",
  "Receiver Full ",
  "Receiver Contact ",
  "Receiver Email ",
  "Receiver Street ",
  "Receiver Barangay",
  "Receiver City",
  "Receiver State/",
  "Receiver Country ",
  "Receiver Postal ",
]

const sheetRowSchema = z.object({
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
          })),
        })
      })}
      className="flex justify-between gap-3 pt-2"
    >
      <div>
        <select {...register("sentByAgentId")}>
          <option value={undefined} selected>
            Select an agent ...
          </option>
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

  try {
    const sheetRows = sheetRowSchema.array().parse(sheetRowsRaw)

    if (sheetRows.length === 0) return <div>Selected sheet has no rows.</div>
    return (
      <div className="px-4 grid grid-rows-[1fr_auto] overflow-auto">
        <div className="h-full overflow-auto border border-gray-300">
          <div className={`grid grid-cols-[repeat(21,_13rem)] font-medium`}>
            {Object.keys(sheetRows[0]).map((key) => (
              <div key={key} className="px-1.5 py-1">
                {key}
              </div>
            ))}
          </div>
          {sheetRows.map((newPackage, index) => (
            <div key={index} className={`grid grid-cols-[repeat(21,_13rem)]`}>
              {Object.keys(newPackage).map((key) => (
                <div
                  key={key}
                  className="w-full overflow-hidden text-ellipsis px-1.5 py-1"
                >
                  {newPackage[key as keyof typeof newPackage]}
                </div>
              ))}
            </div>
          ))}
        </div>
        {status === "loading" && <div>Loading agents ...</div>}
        {status === "error" && (
          <div>Error while loading agents. {error.message}</div>
        )}
        {status === "success" && (
          <ChooseAgentForm
            agents={agents}
            sheetRows={sheetRows}
            reset={() => reset()}
            close={() => close()}
          />
        )}
      </div>
    )
  } catch (e) {
    if (e instanceof ZodError) {
      const rowsWithErrors = Object.keys(e.flatten().fieldErrors)

      return (
        <div className="px-4 grid grid-rows-[auto_1fr] overflow-auto">
          <p className="mb-3">
            One or more or rows in this sheet contains errors. Please recheck
            its contents.
          </p>
          <div className="h-full overflow-auto border border-gray-300">
            <div className={`grid grid-cols-[repeat(21,_13rem)] font-medium`}>
              {expectedColumns.map((column) => (
                <div key={column} className="px-1.5 py-1">
                  {column}
                </div>
              ))}
            </div>
            {rowsWithErrors.map((row) => {
              try {
                sheetRowSchema.parse(
                  sheetRowsRaw[row as keyof typeof sheetRowsRaw],
                )
              } catch (e) {
                if (e instanceof ZodError) {
                  const fieldsWithErrors = Object.keys(e.flatten().fieldErrors)
                  const newPackage = sheetRowsRaw[row as any] as SheetRow

                  return (
                    <div className={`grid grid-cols-[repeat(21,_13rem)]`}>
                      {expectedColumns.map((column) => (
                        <div
                          key={column}
                          className={`px-1.5 py-1 ${
                            fieldsWithErrors.includes(column)
                              ? "bg-red-300"
                              : ""
                          }`}
                        >
                          {typeof newPackage[column as keyof SheetRow] !==
                            "undefined" && newPackage[column as keyof SheetRow]}
                        </div>
                      ))}
                    </div>
                  )
                }
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
    } else return <div>An unknown error occured while parsing this sheet.</div>
  }
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
  const [selectedSheetName, setSelectedSheetName] = useState<null | string>(
    null,
  )

  useEffect(() => {
    if (!isOpen) {
      setSelectedWorkBook(null)
      setSelectedSheetName(null)
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
          <div className="px-4 py-2 grid grid-rows-[auto_1fr] overflow-auto">
            {selectedWorkbook === null ? (
              <SelectFileForm
                setSelectedWorkBook={(wb) => setSelectedWorkBook(wb)}
              />
            ) : (
              <SelectSheetNameForm
                selectedWorkBook={selectedWorkbook}
                setSelectedSheetName={(sheetName) =>
                  setSelectedSheetName(sheetName)
                }
              />
            )}

            {selectedWorkbook && selectedSheetName && (
              <CreatePackagesForm
                selectedWorkBook={selectedWorkbook}
                selectedSheetName={selectedSheetName}
                reset={() => {
                  setSelectedWorkBook(null)
                  setSelectedSheetName(null)
                }}
                close={close}
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

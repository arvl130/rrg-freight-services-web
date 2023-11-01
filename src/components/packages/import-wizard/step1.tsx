import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { WorkBook, read } from "xlsx"
import { useEffect } from "react"

function ExampleTable() {
  return (
    <div className="w-full overflow-auto text-sm px-2 py-1 border border-gray-300 rounded-2xl">
      <div className="w-full grid grid-cols-[repeat(21,_10rem)]">
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Shipping Mode
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Shipping Type
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Reception Mode
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Weight In Kg
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Sender Full Name
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Sender Contact Number
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Sender Email Address
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Sender Street Address
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Sender City
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Sender State/Province
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Sender Country Code
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Sender Postal Code
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Receiver Full Name
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Receiver Contact Number
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Receiver Email Address
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Receiver Street Address
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Receiver Barangay
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Receiver City
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Receiver State/Province
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Receiver Country Code
        </div>
        <div className="text-center flex items-center justify-center uppercase font-medium py-1">
          Receiver Postal Code
        </div>
      </div>
      <div className="w-full grid grid-cols-[repeat(22,_10rem)]">
        <div className="text-center flex justify-center items-center">SEA</div>
        <div className="text-center flex justify-center items-center">
          STANDARD
        </div>
        <div className="text-center flex justify-center items-center">
          DOOR_TO_DOOR
        </div>
        <div className="text-center flex justify-center items-center">50</div>
        <div className="text-center flex justify-center items-center">
          Phineas Flynn
        </div>
        <div className="text-center flex justify-center items-center">
          +1123456789
        </div>
        <div className="text-center flex justify-center items-center">
          phineasflynn@example.com
        </div>
        <div className="text-center flex justify-center items-center">
          2308 Maple Drive
        </div>
        <div className="text-center flex justify-center items-center">
          Tri-State Area
        </div>
        <div className="text-center flex justify-center items-center">
          Unknown State
        </div>
        <div className="text-center flex justify-center items-center">USA</div>
        <div className="text-center flex justify-center items-center">1111</div>
        <div className="text-center flex justify-center items-center">
          Ferb Fletcher
        </div>
        <div className="text-center flex justify-center items-center">
          +639123456789
        </div>
        <div className="text-center flex justify-center items-center">
          ferbfletcher@example.com
        </div>
        <div className="text-center flex justify-center items-center">
          123 Street
        </div>
        <div className="text-center flex justify-center items-center">
          San Bartolome
        </div>
        <div className="text-center flex justify-center items-center">
          Quezon City
        </div>
        <div className="text-center flex justify-center items-center">
          National Capital Region
        </div>
        <div className="text-center flex justify-center items-center">PHL</div>
        <div className="text-center flex justify-center items-center">2222</div>
      </div>
    </div>
  )
}

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

export function PackagesImportWizardSelectFile({
  isOpenModal,
  setSelectedWorkBook,
}: {
  isOpenModal: boolean
  setSelectedWorkBook: (wb: WorkBook) => void
}) {
  const {
    reset,
    register,
    formState: { isValid },
    handleSubmit,
  } = useForm<SelectFileFormType>({
    resolver: zodResolver(selectFileFormSchema),
  })

  useEffect(() => {
    if (!isOpenModal) reset()
  }, [isOpenModal, reset])

  return (
    <div className="h-full grid grid-rows-[auto_1fr] grid-cols-[100%]">
      <ul className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto] gap-1 items-center px-12 py-6 [background-color:_#78CFDC] text-sm">
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full border-2 border-green-600">
              1
            </p>
            <p>Choose file</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full">
              2
            </p>
            <p>Select header</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full">
              2
            </p>
            <p>Select columns</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full">
              3
            </p>
            <p>Validate data</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full">
              5
            </p>
            <p>Success</p>
          </div>
        </li>
      </ul>
      <div className="px-12 py-6 grid grid-rows-[auto_auto_1fr]">
        <div className="mb-3">
          <h3 className="font-semibold mb-2">Upload file</h3>
          <p>Data that we expect:</p>
        </div>
        <ExampleTable />
        <form
          onSubmit={handleSubmit(async (formData) => {
            const [sheetFile] = formData.sheetFiles
            const buffer = await sheetFile.arrayBuffer()

            const wb = read(buffer)
            setSelectedWorkBook(wb)
            reset()
          })}
          className="flex flex-col items-center justify-center mt-6 border-4 border-gray-300 rounded-2xl border-dashed [border-color:_#78CFDC]"
        >
          <p className="mb-1">Upload .xlsx, .xls. or .csv file</p>
          <input
            type="file"
            className="text-sm border border-gray-300 px-2 py-1.5 mb-2 rounded-md"
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
      </div>
    </div>
  )
}

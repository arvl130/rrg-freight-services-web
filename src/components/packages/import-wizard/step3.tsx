import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { WorkBook, utils } from "xlsx"
import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft"
import { ArrowRight } from "@phosphor-icons/react/ArrowRight"
import { z } from "zod"

const selectHeaderFormSchema = z.object({
  row: z.string(),
})

type SelectHeaderFormType = z.infer<typeof selectHeaderFormSchema>

export function PackagesImportWizardSelectHeader({
  selectedWorkBook,
  selectedSheetName,
  setSelectedHeaderRow,
  goBack,
}: {
  selectedWorkBook: WorkBook
  selectedSheetName: string
  setSelectedHeaderRow: (row: number) => void
  goBack: () => void
}) {
  const sheetRows = utils.sheet_to_json(
    selectedWorkBook.Sheets[selectedSheetName],
    {
      header: "A",
    },
  )

  const { register, handleSubmit } = useForm<SelectHeaderFormType>({
    resolver: zodResolver(selectHeaderFormSchema),
  })

  return (
    <form
      className="h-full grid grid-rows-[auto_1fr_auto] grid-cols-[100%]"
      onSubmit={handleSubmit((formData) => {
        setSelectedHeaderRow(parseInt(formData.row))
      })}
    >
      <ul className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto] gap-1 items-center px-12 py-6 [background-color:_#78CFDC] text-sm">
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full">
              1
            </p>
            <p>Upload file</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full">
              2
            </p>
            <p>Select header row</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full">
              2
            </p>
            <p>Match columns</p>
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
      <div className="px-12 py-6 grid grid-rows-[auto_1fr]">
        <p className="mb-1 font-medium">Select Header</p>
        <div className="border border-gray-300 px-4 py-3 rounded-lg space-y-3">
          {sheetRows.map((row, index) => {
            return (
              <label
                key={index}
                className="text-sm grid grid-cols-[4rem_1fr] w-full"
              >
                <div>
                  <input type="radio" {...register("row")} value={index} />
                </div>
                <div
                  className="overflow-auto"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${
                      Object.values(row as object).length
                    }, 12rem)`,
                  }}
                >
                  {Object.values(row as object).map((value, index) => (
                    <div key={index}>{value}</div>
                  ))}
                </div>
              </label>
            )
          })}
        </div>
      </div>
      <div className="px-12 py-4 [background-color:_#78CFDC] text-white flex justify-between">
        <button
          type="button"
          className="font-medium flex items-center gap-1"
          onClick={goBack}
        >
          <ArrowLeft size={24} />
          <div>Back</div>
        </button>
        <button type="submit" className="font-medium flex items-center gap-1">
          <div>Next</div>
          <ArrowRight size={24} />
        </button>
      </div>
    </form>
  )
}

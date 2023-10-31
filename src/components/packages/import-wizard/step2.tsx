import { ArrowLeft } from "@phosphor-icons/react/dist/icons/ArrowLeft"
import { WorkBook } from "xlsx"

export function PackagesImportWizardSelectSheetName({
  selectedWorkBook,
  setSelectedSheetName,
  goBack,
}: {
  selectedWorkBook: WorkBook
  setSelectedSheetName: (sheetName: string) => void
  goBack: () => void
}) {
  return (
    <div className="h-full grid grid-rows-[auto_1fr_auto] grid-cols-[100%]">
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
      <div className="px-12 py-6 flex items-center justify-center flex-col">
        <p className="font-medium mb-3">Select the sheet to import:</p>
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
      <div className="px-12 py-4 [background-color:_#78CFDC] text-white flex">
        <button
          type="button"
          className="font-medium flex items-center gap-1"
          onClick={goBack}
        >
          <ArrowLeft size={24} />
          <div>Back</div>
        </button>
      </div>
    </div>
  )
}

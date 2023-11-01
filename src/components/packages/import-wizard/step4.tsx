import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { WorkBook, utils } from "xlsx"
import { z } from "zod"
import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft"
import { ArrowRight } from "@phosphor-icons/react/ArrowRight"
import { Check } from "@phosphor-icons/react/Check"

const matchColumnsFormSchema = z.object({
  shippingMode: z.string().min(1),
  shippingType: z.string().min(1),
  receptionMode: z.string().min(1),
  weightInKg: z.string().min(1),
  senderFullName: z.string().min(1),
  senderContactNumber: z.string().min(1),
  senderEmailAddress: z.string().min(1),
  senderStreetAddress: z.string().min(1),
  senderCity: z.string().min(1),
  senderStateOrProvince: z.string().min(1),
  senderCountryCode: z.string().min(1),
  senderPostalCode: z.string().min(1),
  receiverFullName: z.string().min(1),
  receiverContactNumber: z.string().min(1),
  receiverEmailAddress: z.string().min(1),
  receiverStreetAddress: z.string().min(1),
  receiverBarangay: z.string().min(1),
  receiverCity: z.string().min(1),
  receiverStateOrProvince: z.string().min(1),
  receiverCountryCode: z.string().min(1),
  receiverPostalCode: z.string().min(1),
})

export type MatchColumnsFormType = z.infer<typeof matchColumnsFormSchema>

export function PackagesImportWizardSelectColumnNames({
  selectedWorkBook,
  selectedSheetName,
  selectedHeaderRow,
  setColumnNames,
  goBack,
}: {
  selectedWorkBook: WorkBook
  selectedSheetName: string
  selectedHeaderRow: number
  setColumnNames: (row: MatchColumnsFormType) => void
  goBack: () => void
}) {
  const sheetRows = utils.sheet_to_json<Record<string, string>>(
    selectedWorkBook.Sheets[selectedSheetName],
    {
      header: "A",
    },
  )

  const {
    watch,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<MatchColumnsFormType>({
    resolver: zodResolver(matchColumnsFormSchema),
  })

  const sheetColumnNames = Object.keys(sheetRows[selectedHeaderRow] as object)
  const availableColumnNames = sheetColumnNames.filter(
    (columnName) => !Object.values(watch()).includes(columnName),
  )

  return (
    <form
      className="h-[calc(100vh_-_6rem)] grid grid-rows-[auto_1fr_auto]"
      onSubmit={handleSubmit((formData) => {
        setColumnNames(formData)
      })}
    >
      <ul className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto] gap-1 items-center px-12 py-6 [background-color:_#78CFDC] text-sm">
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-green-600 text-white rounded-full">
              <Check size={20} />
            </p>
            <p>Choose file</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-green-600 text-white rounded-full">
              <Check size={20} />
            </p>
            <p>Select header</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full border-2 border-green-600">
              3
            </p>
            <p>Select columns</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full">
              4
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
      <div className="px-12 py-6 overflow-auto">
        <p className="font-medium">Match columns</p>
        <div className="grid grid-cols-2 gap-y-3 max-w-md mx-auto">
          <label>Shipping Mode</label>
          <select {...register("shippingMode")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Shipping Type</label>
          <select {...register("shippingType")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Reception Mode</label>
          <select {...register("receptionMode")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Weight In Kg</label>
          <select {...register("weightInKg")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Sender Full Name</label>
          <select {...register("senderFullName")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Sender Contact Number</label>
          <select {...register("senderContactNumber")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Sender Email Address</label>
          <select {...register("senderEmailAddress")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Sender Street Address</label>
          <select {...register("senderStreetAddress")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Sender City</label>
          <select {...register("senderCity")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Sender State/Province</label>
          <select {...register("senderStateOrProvince")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Sender Country Code</label>
          <select {...register("senderCountryCode")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Sender Postal Code</label>
          <select {...register("senderPostalCode")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Receiver Full Name</label>
          <select {...register("receiverFullName")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Receiver Contact Number</label>
          <select {...register("receiverContactNumber")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Receiver Email Address</label>
          <select {...register("receiverEmailAddress")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Receiver Street Address</label>
          <select {...register("receiverStreetAddress")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Receiver Barangay</label>
          <select {...register("receiverBarangay")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Receiver City</label>
          <select {...register("receiverCity")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Receiver State/Province</label>
          <select {...register("receiverStateOrProvince")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Receiver Country Code</label>
          <select {...register("receiverCountryCode")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
          <label>Receiver Postal Code</label>
          <select {...register("receiverPostalCode")}>
            <option value="">Select ...</option>
            {sheetColumnNames.map((columnName) => (
              <option
                key={columnName}
                value={columnName}
                disabled={!availableColumnNames.includes(columnName)}
              >
                {sheetRows[selectedHeaderRow][columnName]}
              </option>
            ))}
          </select>
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

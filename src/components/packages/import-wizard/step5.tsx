import { ZodError, z } from "zod"
import {
  ReceptionMode,
  ShippingMode,
  ShippingType,
  supportedReceptionModes,
  supportedShippingModes,
  supportedShippingTypes,
} from "@/utils/constants"
import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft"
import { WorkBook, utils } from "xlsx"
import { MatchColumnsFormType } from "./step4"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { Package } from "@/server/db/entities"
import { Check } from "@phosphor-icons/react/Check"

const newPackageSchema = z.object({
  shippingMode: z.custom<ShippingMode>((val) =>
    supportedShippingModes.includes(val as ShippingMode),
  ),
  shippingType: z.custom<ShippingType>((val) =>
    supportedShippingTypes.includes(val as ShippingType),
  ),
  receptionMode: z.custom<ReceptionMode>((val) =>
    supportedReceptionModes.includes(val as ReceptionMode),
  ),
  weightInKg: z.number(),
  senderFullName: z.string().min(1).max(100),
  senderContactNumber: z.string().min(1).max(15),
  senderEmailAddress: z.string().min(1).max(100),
  senderStreetAddress: z.string().min(1).max(255),
  senderCity: z.string().min(1).max(100),
  senderStateOrProvince: z.string().min(1).max(100),
  senderCountryCode: z.string().min(1).max(3),
  senderPostalCode: z.number(),
  receiverFullName: z.string().min(1).max(100),
  receiverContactNumber: z.string().min(1).max(15),
  receiverEmailAddress: z.string().min(1).max(100),
  receiverStreetAddress: z.string().min(1).max(255),
  receiverBarangay: z.string().min(1).max(100),
  receiverCity: z.string().min(1).max(100),
  receiverStateOrProvince: z.string().min(1).max(100),
  receiverCountryCode: z.string().min(1).max(3),
  receiverPostalCode: z.number(),
})

type NewPackageType = z.infer<typeof newPackageSchema>

const createPackagesFormSchema = z.object({
  newPackages: newPackageSchema.array(),
})

type createPackagesFormType = z.infer<typeof createPackagesFormSchema>

export function PackagesImportWizardCreatePackages({
  selectedWorkBook,
  selectedSheetName,
  selectedHeaderRow,
  selectedColumnNames,
  setCreatedPackages,
  goBack,
}: {
  selectedWorkBook: WorkBook
  selectedSheetName: string
  selectedHeaderRow: number
  selectedColumnNames: MatchColumnsFormType
  setCreatedPackages: (packages: Package[]) => void
  goBack: () => void
}) {
  const originalSheetRows = utils.sheet_to_json<Record<string, string>>(
    selectedWorkBook.Sheets[selectedSheetName],
    {
      header: "A",
    },
  )

  const sheetRows = useMemo(() => {
    const newSheetRows = [...originalSheetRows]
    newSheetRows.splice(selectedHeaderRow, 1)

    return newSheetRows
  }, [originalSheetRows, selectedHeaderRow])

  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const {
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<createPackagesFormType>({
    resolver: zodResolver(createPackagesFormSchema),
  })

  useEffect(() => {
    const newPackages = selectedRows.map((row) => ({
      shippingMode: sheetRows[row][selectedColumnNames.shippingMode],
      shippingType: sheetRows[row][selectedColumnNames.shippingType],
      receptionMode: sheetRows[row][selectedColumnNames.receptionMode],
      weightInKg: sheetRows[row][selectedColumnNames.weightInKg],
      senderFullName: sheetRows[row][selectedColumnNames.senderFullName],
      senderContactNumber:
        sheetRows[row][selectedColumnNames.senderContactNumber],
      senderEmailAddress:
        sheetRows[row][selectedColumnNames.senderEmailAddress],
      senderStreetAddress:
        sheetRows[row][selectedColumnNames.senderStreetAddress],
      senderCity: sheetRows[row][selectedColumnNames.senderCity],
      senderStateOrProvince:
        sheetRows[row][selectedColumnNames.senderStateOrProvince],
      senderCountryCode: sheetRows[row][selectedColumnNames.senderCountryCode],
      senderPostalCode: sheetRows[row][selectedColumnNames.senderPostalCode],
      receiverFullName: sheetRows[row][selectedColumnNames.receiverFullName],
      receiverContactNumber:
        sheetRows[row][selectedColumnNames.receiverContactNumber],
      receiverEmailAddress:
        sheetRows[row][selectedColumnNames.receiverEmailAddress],
      receiverStreetAddress:
        sheetRows[row][selectedColumnNames.receiverStreetAddress],
      receiverBarangay: sheetRows[row][selectedColumnNames.receiverBarangay],
      receiverCity: sheetRows[row][selectedColumnNames.receiverCity],
      receiverStateOrProvince:
        sheetRows[row][selectedColumnNames.receiverStateOrProvince],
      receiverCountryCode:
        sheetRows[row][selectedColumnNames.receiverCountryCode],
      receiverPostalCode:
        sheetRows[row][selectedColumnNames.receiverPostalCode],
    })) as unknown as NewPackageType[]

    setValue("newPackages", newPackages)
  }, [selectedRows, sheetRows, setValue, selectedColumnNames])

  const apiUtils = api.useUtils()
  const { isLoading, mutate } = api.package.createMany.useMutation({
    onSuccess: (createdPackages) => {
      apiUtils.package.getAll.invalidate()
      setCreatedPackages(createdPackages)
    },
  })

  return (
    <form
      className="h-[calc(100vh_-_6rem)] grid grid-rows-[auto_1fr_auto] grid-cols-[100%]"
      onSubmit={handleSubmit((formData) => mutate(formData))}
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
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full">
              <p className="flex justify-center items-center h-8 w-8 bg-green-600 text-white rounded-full">
                <Check size={20} />
              </p>
            </p>
            <p>Select header</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-green-600 text-white rounded-full">
              <Check size={20} />
            </p>
            <p>Select columns</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full border-2 border-green-600">
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
      <div className="px-12 py-6 overflow-auto grid grid-rows-[auto_1fr]">
        <div className="mb-3">
          <p className="font-medium">Select packages to import:</p>
          <p className="text-sm">
            <span className="text-red-500">*</span> Fields containing errors
            will be shaded red and cannot be selected.
          </p>
        </div>
        <div className="overflow-auto border border-gray-300">
          <div className="grid grid-cols-[2rem_repeat(22,_12rem)] font-semibold px-2 py-1">
            <div className="text-center">
              <input type="checkbox" />
            </div>
            <div className="px-1 py-0.5">Shipping Mode</div>
            <div className="px-1 py-0.5">Shipping Type</div>
            <div className="px-1 py-0.5">Reception Mode</div>
            <div className="px-1 py-0.5">Weight In</div>
            <div className="px-1 py-0.5">Sender Full</div>
            <div className="px-1 py-0.5">Sender Contact</div>
            <div className="px-1 py-0.5">Sender Email</div>
            <div className="px-1 py-0.5">Sender Street</div>
            <div className="px-1 py-0.5">Sender City</div>
            <div className="px-1 py-0.5">Sender State</div>
            <div className="px-1 py-0.5">Sender Country</div>
            <div className="px-1 py-0.5">Sender Postal</div>
            <div className="px-1 py-0.5">Receiver Full</div>
            <div className="px-1 py-0.5">Receiver Contact</div>
            <div className="px-1 py-0.5">Receiver Email</div>
            <div className="px-1 py-0.5">Receiver Street</div>
            <div className="px-1 py-0.5">Receiver Barangay</div>
            <div className="px-1 py-0.5">Receiver City</div>
            <div className="px-1 py-0.5">Receiver State</div>
            <div className="px-1 py-0.5">Receiver Country</div>
            <div className="px-1 py-0.5">Receiver Postal</div>
          </div>
          {sheetRows.map((row, index) => {
            const fieldsWithErrors: string[] = []
            try {
              newPackageSchema.parse({
                shippingMode: row[selectedColumnNames.shippingMode],
                shippingType: row[selectedColumnNames.shippingType],
                receptionMode: row[selectedColumnNames.receptionMode],
                weightInKg: row[selectedColumnNames.weightInKg],
                senderFullName: row[selectedColumnNames.senderFullName],
                senderContactNumber:
                  row[selectedColumnNames.senderContactNumber],
                senderEmailAddress: row[selectedColumnNames.senderEmailAddress],
                senderStreetAddress:
                  row[selectedColumnNames.senderStreetAddress],
                senderCity: row[selectedColumnNames.senderCity],
                senderStateOrProvince:
                  row[selectedColumnNames.senderStateOrProvince],
                senderCountryCode: row[selectedColumnNames.senderCountryCode],
                senderPostalCode: row[selectedColumnNames.senderPostalCode],
                receiverFullName: row[selectedColumnNames.receiverFullName],
                receiverContactNumber:
                  row[selectedColumnNames.receiverContactNumber],
                receiverEmailAddress:
                  row[selectedColumnNames.receiverEmailAddress],
                receiverStreetAddress:
                  row[selectedColumnNames.receiverStreetAddress],
                receiverBarangay: row[selectedColumnNames.receiverBarangay],
                receiverCity: row[selectedColumnNames.receiverCity],
                receiverStateOrProvince:
                  row[selectedColumnNames.receiverStateOrProvince],
                receiverCountryCode:
                  row[selectedColumnNames.receiverCountryCode],
                receiverPostalCode: row[selectedColumnNames.receiverPostalCode],
              })
            } catch (e) {
              if (e instanceof ZodError)
                for (const key of Object.keys(e.flatten().fieldErrors))
                  fieldsWithErrors.push(key)
            }

            const isValid = fieldsWithErrors.length === 0
            return (
              <div
                key={index}
                className="px-2 py-1"
                style={{
                  display: "grid",
                  gridTemplateColumns: `2rem repeat(${
                    Object.values(row as object).length
                  }, 12rem)`,
                }}
              >
                <div className="text-center">
                  {isValid && (
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.currentTarget.checked)
                          setSelectedRows((currSelectedRows) => [
                            ...currSelectedRows,
                            index,
                          ])
                        else
                          setSelectedRows((currSelectedRows) =>
                            currSelectedRows.filter((row) => row != index),
                          )
                      }}
                    />
                  )}
                </div>
                <>
                  {Object.keys(selectedColumnNames).map((key) => {
                    const columnName = key as keyof MatchColumnsFormType
                    if (isValid)
                      return (
                        <div
                          key={`${index}-${key}`}
                          className="px-1 py-0.5 overflow-hidden text-ellipsis"
                        >
                          {row[selectedColumnNames[columnName]]}
                        </div>
                      )

                    return (
                      <>
                        {fieldsWithErrors.includes(columnName) ? (
                          <div
                            key={`${index}-${key}`}
                            className="px-1 py-0.5 bg-red-200 overflow-hidden text-ellipsis"
                          >
                            {row[selectedColumnNames[columnName]]}
                          </div>
                        ) : (
                          <div
                            key={`${index}-${key}`}
                            className="px-1 py-0.5 overflow-hidden text-ellipsis"
                          >
                            {row[selectedColumnNames[columnName]]}
                          </div>
                        )}
                      </>
                    )
                  })}
                </>
              </div>
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
        <button
          type="submit"
          disabled={selectedRows.length === 0 || isLoading}
          className="font-medium flex items-center gap-1 disabled:bg-green-300 bg-green-600 hover:bg-green-500 transition-colors duration-200 px-6 py-1 rounded-md"
        >
          {isLoading ? "Saving ..." : "Save"}
        </button>
      </div>
    </form>
  )
}

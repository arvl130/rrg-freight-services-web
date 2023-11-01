import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { WorkBook, read } from "xlsx"
import { useEffect } from "react"

function Forms() {
  return (
    <div className="overflow-auto p-4">
      <form>
        <h1 className="font-semibold text-lg mb-2">Sender Info:</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-bold">Full Name</label>
            <input
              id="fullname"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
              placeholder="Fernando Jabili"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Contact Number</label>
            <input
              id="contactnumber"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
              placeholder="+852 | 2838 8961"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Email Address</label>
            <input
              id="email"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
              placeholder="e-mail@example.com"
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-bold">Street Name, Building</label>
            <input
              id="street"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
              placeholder="Cambridge House 19 Cameron Road Tsimshatsui Kow..."
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Province</label>
            <select
              id="province"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
            >
              <option value="HK">Hong Kong</option>
              <option value="TV">TV/Monitors</option>
              <option value="PC">PC</option>
              <option value="GA">Gaming/Console</option>
              <option value="PH">Phones</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Country</label>
            <select
              id="country"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
            >
              <option value="HK">Hong Kong</option>
              <option value="TV">TV/Monitors</option>
              <option value="PC">PC</option>
              <option value="GA">Gaming/Console</option>
              <option value="PH">Phones</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="pcode" className="text-sm font-bold">
              Postal Code
            </label>
            <input
              id="pcode"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
              placeholder="852"
            />
          </div>
        </div>
        <div className=" mt-4 grid grid-cols-5 gap-5 pb-4">
          <div className="flex flex-col">
            <label htmlFor="mode" className="text-sm font-bold">
              Mode
            </label>
            <select
              id="mode"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
            >
              <option value="AF">Air Freight</option>
              <option value="TV">TV/Monitors</option>
              <option value="PC">PC</option>
              <option value="GA">Gaming/Console</option>
              <option value="PH">Phones</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="dtype" className="text-sm font-bold">
              Delivery Type
            </label>
            <select
              id="dtype"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
            >
              <option value="SD">Standard Delivery</option>
              <option value="TV">TV/Monitors</option>
              <option value="PC">PC</option>
              <option value="GA">Gaming/Console</option>
              <option value="PH">Phones</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="weight" className="text-sm font-bold">
              Weight
            </label>
            <input
              id="weight"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
              placeholder="KG | 50"
            />
          </div>
          <div className="flex items-center mb-2 ml-10 space-x-10">
            <div className="flex items-center space-x-2">
              <input type="radio" id="pickup" className="w-5 h-5" />
              <label htmlFor="pickup" className="text-sm font-bold">
                For Pick-Up
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" id="d2d" className="w-5 h-5" />
              <label htmlFor="d2d" className="text-sm font-bold">
                Door-to-Door Delivery
              </label>
            </div>
          </div>
        </div>
        <hr className="my-4 border-t border-gray-200" />
        <h1 className="font-semibold text-lg mb-2">Receiver Info:</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-bold">Receiver Name</label>
            <input
              id="receiver-fullname"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
              placeholder="Jeriko Batumbakal"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Contact Number</label>
            <input
              id="receiver-contactnumber"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
              placeholder="+63 | 9123456789"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Email Address</label>
            <input
              id="receiver-email"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
              placeholder="e-mailex@example.com"
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-bold">Street Name, Building</label>
            <input
              id="street"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
              placeholder="1830 Job Street, Jordan Plains Subdivision"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Barangay</label>
            <select
              id="province"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
            >
              <option value="HK">Hong Kong</option>
              <option value="TV">TV/Monitors</option>
              <option value="PC">PC</option>
              <option value="GA">Gaming/Console</option>
              <option value="PH">Phones</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Province</label>
            <select
              id="country"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
            >
              <option value="HK">Hong Kong</option>
              <option value="TV">TV/Monitors</option>
              <option value="PC">PC</option>
              <option value="GA">Gaming/Console</option>
              <option value="PH">Phones</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Region</label>
            <select
              id="region"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
            >
              <option value="HK">Hong Kong</option>
              <option value="TV">TV/Monitors</option>
              <option value="PC">PC</option>
              <option value="GA">Gaming/Console</option>
              <option value="PH">Phones</option>
            </select>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-bold">Country</label>
            <select
              id="province"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
            >
              <option value="HK">Hong Kong</option>
              <option value="TV">TV/Monitors</option>
              <option value="PC">PC</option>
              <option value="GA">Gaming/Console</option>
              <option value="PH">Phones</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Postal Code</label>
            <input
              id="street"
              className="w-full h-10 bg-white rounded border border-stone-300 p-2"
              placeholder="1119"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="w-20 h-10 text-white bg-green-400 rounded-lg">
            Save
          </button>
          <button className="w-20 h-10 text-white bg-red-400 rounded-lg ml-2">
            Cancel
          </button>
        </div>
      </form>
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
      <div className="text-white font-bold text-center items-center py-4 [background-color:_#78CFDC] text-3xl">
        ADD PACKAGE
      </div>
      <div className="px-12 py-4 grid grid-rows-[auto_auto_1fr]">
        <Forms />
      </div>
    </div>
  )
}

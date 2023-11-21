import { Package } from "@/server/db/entities"
import { Check } from "@phosphor-icons/react/Check"
import { DateTime } from "luxon"

export function PackagesMultiStepImportWizardSummary({
  createdPackages,
  close,
}: {
  createdPackages: Package[]
  close: () => void
}) {
  return (
    <div className="h-[calc(100vh_-_6rem)] grid grid-rows-[auto_1fr_auto] grid-cols-[100%]">
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
            <p className="flex justify-center items-center h-8 w-8 bg-green-600 text-white rounded-full">
              <Check size={20} />
            </p>
            <p>Select columns</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-green-600 text-white rounded-full">
              <Check size={20} />
            </p>
            <p>Validate data</p>
          </div>
        </li>
        <li className="h-[2px] bg-white"></li>
        <li className="grid grid-cols-[auto_1fr] gap-1 items-center">
          <div className="flex items-center gap-2">
            <p className="flex justify-center items-center h-8 w-8 bg-white rounded-full border-2 border-green-600">
              5
            </p>
            <p>Success</p>
          </div>
        </li>
      </ul>
      <div className="px-12 py-6 overflow-auto grid grid-rows-[auto_1fr]">
        <p className="font-medium mb-3">Import summary</p>
        <div className="overflow-auto border border-gray-300">
          <div className="grid grid-cols-[repeat(28,_12rem)] font-semibold px-2 py-1">
            <div className="px-1 py-0.5">Package ID</div>
            <div className="px-1 py-0.5">Shipping Party</div>
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
            <div className="px-1 py-0.5">Created At</div>
            <div className="px-1 py-0.5">Created By ID</div>
            <div className="px-1 py-0.5">Updated At</div>
            <div className="px-1 py-0.5">Updated By ID</div>
            <div className="px-1 py-0.5">Archived</div>
          </div>
          {createdPackages.map((_package) => {
            return (
              <div
                key={_package.id}
                className="px-2 py-1"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${
                    Object.values(_package as object).length
                  }, 12rem)`,
                }}
              >
                {Object.keys(_package).map((key) => {
                  const packageKey = key as keyof Package
                  const packageField = _package[packageKey]

                  if (packageField instanceof Date)
                    return (
                      <div key={key} className="overflow-hidden text-ellipsis">
                        {DateTime.fromJSDate(packageField).toLocaleString(
                          DateTime.DATETIME_FULL,
                        )}
                      </div>
                    )

                  return (
                    <div key={key} className="overflow-hidden text-ellipsis">
                      {packageField}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
      <div className="px-12 py-4 [background-color:_#78CFDC] text-white flex justify-end">
        <button
          type="button"
          onClick={close}
          className="font-medium flex items-center gap-1 disabled:bg-green-300 bg-green-600 hover:bg-green-500 transition-colors duration-200 px-6 py-1 rounded-md"
        >
          Done
        </button>
      </div>
    </div>
  )
}

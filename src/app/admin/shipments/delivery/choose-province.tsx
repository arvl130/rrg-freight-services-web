import { AreaCodeDisplayName } from "@/components/area-code-display-name"
import { api } from "@/utils/api"
import type { PackageShippingType } from "@/utils/constants"

export function ChooseProvinceWithPackages({
  warehouseId,
  deliveryType,
  provinceId,
  onChange,
}: {
  warehouseId: number
  deliveryType: PackageShippingType
  provinceId: string
  onChange: (newProvinceId: string) => void
}) {
  const { status, data, error } =
    api.province.getHasPackagesToBeDelivered.useQuery({
      warehouseId,
      deliveryType,
    })

  return (
    <div className="text-gray-700 mt-3">
      <label className="block font-medium">Delivery Area</label>
      {status === "loading" && <>...</>}
      {status === "error" && <>Error occured: {error.message}</>}
      {status === "success" && (
        <>
          {data.length === 0 ? (
            <p className="text-red-500">
              No packages can be delivered with this criteria.
            </p>
          ) : (
            <select
              className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md"
              value={provinceId}
              onChange={(e) => {
                onChange(e.currentTarget.value)
              }}
            >
              <option value="">Choose a province ...</option>
              {data.map(({ areaCode, provinceName }) => (
                <option key={areaCode} value={areaCode}>
                  {provinceName}
                </option>
              ))}
            </select>
          )}
        </>
      )}
    </div>
  )
}

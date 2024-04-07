import type { PackageShippingType } from "@/utils/constants"
import { SUPPORTED_PACKAGE_SHIPPING_TYPES } from "@/utils/constants"
import { getHumanizedOfPackageShippingType } from "@/utils/humanize"

export function ChooseDeliveryType(props: {
  onChange: (deliveryType: PackageShippingType) => void
}) {
  return (
    <div>
      <label className="font-medium block">Delivery Type</label>
      <select
        className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md"
        onChange={(e) => {
          props.onChange(e.currentTarget.value as PackageShippingType)
        }}
      >
        {SUPPORTED_PACKAGE_SHIPPING_TYPES.map((shippingType) => (
          <option key={shippingType} value={shippingType}>
            {getHumanizedOfPackageShippingType(
              shippingType as PackageShippingType,
            )}
          </option>
        ))}
      </select>
    </div>
  )
}

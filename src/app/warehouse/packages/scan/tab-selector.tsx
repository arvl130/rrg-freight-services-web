import type { ShipmentType } from "@/utils/constants"

export type SelectedTab =
  | ShipmentType
  | "INCOMPLETE_DELIVERY"
  | "TRANSFER_WAREHOUSE_RECEIVING"

export function TabSelector(props: {
  selectedTab: SelectedTab
  onSelectTab: (newSelectedTab: SelectedTab) => void
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={`
        pb-1 font-semibold border-b-4 px-2
        ${
          props.selectedTab === "INCOMING"
            ? "border-b-4 text-brand-cyan-500 border-brand-cyan-500"
            : "text-gray-400 border-b-transparent"
        }
      `}
        onClick={() => props.onSelectTab("INCOMING")}
      >
        Incoming
      </button>
      <button
        type="button"
        className={`
        pb-1 font-semibold border-b-4 px-2
        ${
          props.selectedTab === "DELIVERY"
            ? "border-b-4 text-brand-cyan-500 border-brand-cyan-500"
            : "text-gray-400 border-b-transparent"
        }
      `}
        onClick={() => props.onSelectTab("DELIVERY")}
      >
        Delivery
      </button>
      <button
        type="button"
        className={`
        pb-1 font-semibold border-b-4 px-2
        ${
          props.selectedTab === "INCOMPLETE_DELIVERY"
            ? "border-b-4 text-brand-cyan-500 border-brand-cyan-500"
            : "text-gray-400 border-b-transparent"
        }
      `}
        onClick={() => props.onSelectTab("INCOMPLETE_DELIVERY")}
      >
        Incomplete Delivery
      </button>
      <button
        type="button"
        className={`
        pb-1 font-semibold border-b-4 px-2
        ${
          props.selectedTab === "TRANSFER_FORWARDER"
            ? "border-b-4 text-brand-cyan-500 border-brand-cyan-500"
            : "text-gray-400 border-b-transparent"
        }
      `}
        onClick={() => props.onSelectTab("TRANSFER_FORWARDER")}
      >
        Forwarder Transfer
      </button>
      <button
        type="button"
        className={`
        pb-1 font-semibold border-b-4 px-2
        ${
          props.selectedTab === "TRANSFER_WAREHOUSE"
            ? "border-b-4 text-brand-cyan-500 border-brand-cyan-500"
            : "text-gray-400 border-b-transparent"
        }
      `}
        onClick={() => props.onSelectTab("TRANSFER_WAREHOUSE")}
      >
        Warehouse Transfer
      </button>
      <button
        type="button"
        className={`
        pb-1 font-semibold border-b-4 px-2
        ${
          props.selectedTab === "TRANSFER_WAREHOUSE_RECEIVING"
            ? "border-b-4 text-brand-cyan-500 border-brand-cyan-500"
            : "text-gray-400 border-b-transparent"
        }
      `}
        onClick={() => props.onSelectTab("TRANSFER_WAREHOUSE_RECEIVING")}
      >
        Warehouse Transfer (Receiving)
      </button>
    </div>
  )
}

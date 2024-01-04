import { DeliveryTab } from "@/components/scan-package/delivery-tab"
import { IncomingTab } from "@/components/scan-package/incoming-tab"
import { ForwarderTransferTab } from "@/components/scan-package/forwarder-transfer-tab"
import { WarehouseLayout } from "@/layouts/warehouse"
import { useState } from "react"
import type { ShipmentType } from "@/utils/constants"
import { WarehouseTransferTab } from "@/components/scan-package/warehouse-transfer-tab"

export default function ScanPackagePage() {
  const [selectedTab, setSelectedTab] = useState<ShipmentType>("INCOMING")

  return (
    <WarehouseLayout title="Scan Package">
      <div className="flex	justify-between	my-4">
        <h1 className="text-3xl font-black [color:_#00203F] mb-4">
          Scan Package
        </h1>
      </div>
      {selectedTab === "INCOMING" && (
        <IncomingTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
      {selectedTab === "DELIVERY" && (
        <DeliveryTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
      {selectedTab === "TRANSFER_FORWARDER" && (
        <ForwarderTransferTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
      {selectedTab === "TRANSFER_WAREHOUSE" && (
        <WarehouseTransferTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
    </WarehouseLayout>
  )
}

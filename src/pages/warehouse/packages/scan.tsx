import { ScanPackageDeliveryTab } from "@/components/scan-package/delivery-tab"
import { ScanPackageIncomingTab } from "@/components/scan-package/incoming-tab"
import { ScanPackageForwarderTransferTab } from "@/components/scan-package/forwarder-transfer-tab"
import { WarehouseLayout } from "@/layouts/warehouse"
import { useState } from "react"
import type { ShipmentType } from "@/utils/constants"
import { ScanPackageWarehouseTransferTab } from "@/components/scan-package/warehouse-transfer-tab"

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
        <ScanPackageIncomingTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
      {selectedTab === "DELIVERY" && (
        <ScanPackageDeliveryTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
      {selectedTab === "TRANSFER_FORWARDER" && (
        <ScanPackageForwarderTransferTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
      {selectedTab === "TRANSFER_WAREHOUSE" && (
        <ScanPackageWarehouseTransferTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
    </WarehouseLayout>
  )
}

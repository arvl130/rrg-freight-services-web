import { ScanPackageTab } from "@/components/scan-package/common"
import { ScanPackageDeliveryTab } from "@/components/scan-package/delivery-tab"
import { ScanPackageIncomingTab } from "@/components/scan-package/incoming-tab"
import { ScanPackageTransferTab } from "@/components/scan-package/transfer-tab"
import { WarehouseLayout } from "@/layouts/warehouse"
import { useState } from "react"

export default function ScanPackagePage() {
  const [selectedTab, setSelectedTab] = useState<ScanPackageTab>("INCOMING")

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
      {selectedTab === "TRANSFER" && (
        <ScanPackageTransferTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
    </WarehouseLayout>
  )
}

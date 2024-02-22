"use client"

import type { ShipmentType } from "@/utils/constants"
import { WarehouseLayout } from "@/layouts/warehouse"
import { useState } from "react"
import { DeliveryTab } from "./delivery-tab"
import { IncomingTab } from "./incoming-tab"
import { ForwarderTransferTab } from "./forwarder-transfer-tab"
import { WarehouseTransferTab } from "./warehouse-transfer-tab"
import { IncompleteDeliveryTab } from "./incomplete-delivery-tab"
import type { SelectedTab } from "./tab-selector"
import { WarehouseTransferReceivingTab } from "./warehouse-transfer-receiving-tab"

export default function ScanPackagePage() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>("INCOMING")

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
      {selectedTab === "INCOMPLETE_DELIVERY" && (
        <IncompleteDeliveryTab
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
      {selectedTab === "TRANSFER_WAREHOUSE_RECEIVING" && (
        <WarehouseTransferReceivingTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}
    </WarehouseLayout>
  )
}

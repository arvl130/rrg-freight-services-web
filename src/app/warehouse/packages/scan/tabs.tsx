"use client"

import { useState } from "react"
import { DeliveryTab } from "./delivery-tab"
import { IncomingTab } from "./incoming-tab"
import { ForwarderTransferTab } from "./forwarder-transfer-tab"
import { WarehouseTransferTab } from "./warehouse-transfer-tab"
import { IncompleteDeliveryTab } from "./incomplete-delivery-tab"
import type { SelectedTab } from "./tab-selector"
import { WarehouseTransferReceivingTab } from "./warehouse-transfer-receiving-tab"

export function Tabs() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>("INCOMING")

  return (
    <>
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
    </>
  )
}

"use client"

import { useState } from "react"
import { DeliveryTab } from "./delivery-tab"
import { IncomingTab } from "./incoming-tab"
import { ForwarderTransferTab } from "./forwarder-transfer-tab"
import { WarehouseTransferTab } from "./warehouse-transfer-tab"
import { IncompleteDeliveryTab } from "./incomplete-delivery-tab"
import type { SelectedTab } from "./tab-selector"
import { WarehouseTransferReceivingTab } from "./warehouse-transfer-receiving-tab"

export function Tabs(props: { userId: string }) {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>("INCOMING")

  return (
    <>
      {selectedTab === "INCOMING" && (
        <IncomingTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          userId={props.userId}
        />
      )}
      {selectedTab === "DELIVERY" && (
        <DeliveryTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          userId={props.userId}
        />
      )}
      {selectedTab === "INCOMPLETE_DELIVERY" && (
        <IncompleteDeliveryTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          userId={props.userId}
        />
      )}
      {selectedTab === "TRANSFER_FORWARDER" && (
        <ForwarderTransferTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          userId={props.userId}
        />
      )}
      {selectedTab === "TRANSFER_WAREHOUSE" && (
        <WarehouseTransferTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          userId={props.userId}
        />
      )}
      {selectedTab === "TRANSFER_WAREHOUSE_RECEIVING" && (
        <WarehouseTransferReceivingTab
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          userId={props.userId}
        />
      )}
    </>
  )
}

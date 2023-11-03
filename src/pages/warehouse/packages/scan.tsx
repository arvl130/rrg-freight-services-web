import Incoming from "@/components/warehouse/scanIncoming"
import Outgoing from "@/components/warehouse/scanOutgoing"
import { useState } from "react"

export default function ScanPage() {
  const [selectedTab, setSelectedTab] = useState<"Incoming" | "Outgoing">(
    "Incoming",
  )

  if (selectedTab === "Incoming") {
    return (
      <Incoming
        switchTab={() => {
          setSelectedTab("Outgoing")
        }}
      ></Incoming>
    )
  } else {
    return (
      <Outgoing
        switchTab={() => {
          setSelectedTab("Incoming")
        }}
      ></Outgoing>
    )
  }
}

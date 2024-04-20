"use client"

import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple"
import { PDFDownloadLink } from "@react-pdf/renderer"
import PDFReportTemplate from "./pdf-report"
import { useState } from "react"
import { DateRangeModal } from "./date-range-modal"

export function PDFReportGeneratorBtn() {
  const [rangeModal, setRangeModal] = useState<null | "VIEW_RANGE_DATE">(null)

  return (
    <>
      <button
        onClick={() => setRangeModal("VIEW_RANGE_DATE")}
        type="button"
        className="bg-brand-cyan-500 text-white h-10  flex justify-center items-center rounded-md px-2"
      >
        <span className="px-1">Generate PDF Report</span>
        <DownloadSimple size={24} />
      </button>

      <DateRangeModal
        isOpen={rangeModal === "VIEW_RANGE_DATE"}
        close={() => setRangeModal(null)}
      />
    </>
  )
}

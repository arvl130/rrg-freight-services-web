import type { Package } from "@/server/db/entities"
import { Document } from "@react-pdf/renderer"
import { WaybillPdfPage } from "./shipments/incoming/waybill-pdf-page"

const WaybillPdf = ({ package: _package }: { package: Package }) => {
  return (
    <Document>
      <WaybillPdfPage package={_package} />
    </Document>
  )
}

export default WaybillPdf

import type { Package } from "@/server/db/entities"
import { Document } from "@react-pdf/renderer"
import { WaybillPdfPage } from "./waybill-pdf-page"

const WaybillsPdf = ({ package: _packages }: { package: Package[] }) => {
  return (
    <Document>
      {_packages.map((_package) => (
        <WaybillPdfPage key={_package.id} package={_package} />
      ))}
    </Document>
  )
}

export default WaybillsPdf

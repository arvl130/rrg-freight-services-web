"use client"

import * as Dialog from "@radix-ui/react-dialog"
import Image from "next/image"
import type { SetStateAction } from "react"
import { useState } from "react"
import QRCode from "react-qr-code"
import type { Package } from "@/server/db/entities"
import { PDFDownloadLink } from "@react-pdf/renderer"
import type { RangeKeyDict } from "react-date-range"
import { DateRangePicker } from "react-date-range"
import { addDays } from "date-fns"
import "react-date-range/dist/styles.css" // main css file
import "react-date-range/dist/theme/default.css" // theme css file
import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/server/db/client"
import {
  packages,
  warehouses,
  activities,
  users,
  vehicles,
  deliveryShipments,
  shipments,
} from "@/server/db/schema"
import { eq, and, count, like, desc, not, max } from "drizzle-orm"
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple"
import { api } from "@/utils/api"

import { DateTime } from "luxon"
import PDFReportTemplate from "./pdf-report"

export function DateRangeModal({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: () => void
}) {
  const [state, setState] = useState<
    { startDate: Date; endDate: Date; key: string }[]
  >([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ])

  const { data: allPackagesByDate } = api.getAllPackagesByDateRange.useQuery({
    startDate: DateTime.fromJSDate(state[0].startDate).toISO()!,
    endDate: DateTime.fromJSDate(state[0].endDate).toISO()!,
  })

  const { data: allShipmentByDate } =
    api.getAllIncomingShipmentsByDateRange.useQuery({
      startDate: DateTime.fromJSDate(state[0].startDate).toISO()!,
      endDate: DateTime.fromJSDate(state[0].endDate).toISO()!,
    })

  const handleDateRangeChange = (rangesByKey: RangeKeyDict) => {
    const ranges = Object.values(rangesByKey) as {
      startDate: Date
      endDate: Date
      key: string
    }[]
    setState(ranges)
  }

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white"
        >
          <Dialog.Title className="[background-color:_#78CFDC] px-4 py-2 rounded-t-lg text-white font-semibold text-center">
            Date Range Report
          </Dialog.Title>
          <div className="px-4 pt-2">
            <DateRangePicker
              onChange={handleDateRangeChange}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={state}
              direction="horizontal"
            />
          </div>
          <div className="flex justify-between px-4 pb-2">
            <Dialog.Close asChild>
              <button type="button" className="font-medium" onClick={close}>
                Close
              </button>
            </Dialog.Close>
            {allPackagesByDate !== undefined && allShipmentByDate !== undefined}
            <PDFDownloadLink
              document={
                <PDFReportTemplate
                  packagesByDate={allPackagesByDate!}
                  shipmentByDate={allShipmentByDate!}
                  startDate={DateTime.fromJSDate(state[0].startDate).toISO()!}
                  endDate={DateTime.fromJSDate(state[0].endDate).toISO()!}
                />
              }
              // {DateTime.fromISO(DateTime.fromJSDate(
              //   state[0].startDate,
              // ).toISO()!)}

              fileName={`RRG-ADMIN-REPORT-${DateTime.fromISO(
                DateTime.fromJSDate(state[0].startDate).toISO()!,
              ).toLocaleString(DateTime.DATE_MED)}-${DateTime.fromISO(
                DateTime.fromJSDate(state[0].endDate).toISO()!,
              ).toLocaleString(DateTime.DATE_MED)}.pdf`}
            >
              <button
                disabled={
                  allPackagesByDate !== undefined &&
                  allShipmentByDate !== undefined &&
                  state !== undefined
                    ? false
                    : true
                }
                className="px-2 py-1 rounded-lg	bg-[#3DE074] text-white flex"
              >
                {allPackagesByDate !== undefined &&
                allShipmentByDate !== undefined &&
                state !== undefined ? (
                  <>
                    Print Report
                    <DownloadSimple className="ml-2" size={24} />
                  </>
                ) : (
                  <>Loading...</>
                )}
              </button>
            </PDFDownloadLink>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

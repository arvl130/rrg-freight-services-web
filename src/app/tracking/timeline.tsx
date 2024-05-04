import type { PackageStatusLog } from "@/server/db/entities"
import { DropboxLogo } from "@phosphor-icons/react/dist/ssr/DropboxLogo"
import { Package } from "@phosphor-icons/react/dist/ssr/Package"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass"
import { Moped } from "@phosphor-icons/react/dist/ssr/Moped"
import { DateTime } from "luxon"
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck"
import { Star } from "@phosphor-icons/react/dist/ssr/Star"
import { Warehouse } from "@phosphor-icons/react/dist/ssr/Warehouse"
import { useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { json } from "stream/consumers"
import { SurveyRatings } from "../admin/dashboard/survey-ratings"

function TimelineItem({
  packageStatusLog,
}: {
  packageStatusLog: PackageStatusLog
}) {
  return (
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full outline black flex items-center justify-center p-2">
        {packageStatusLog.status === "DELIVERED" && (
          <DropboxLogo size={44} color="#1d798b" />
        )}
        {packageStatusLog.status === "OUT_FOR_DELIVERY" && (
          <Moped size={44} color="#1d798b" />
        )}
        {(packageStatusLog.status === "PREPARING_FOR_DELIVERY" ||
          packageStatusLog.status === "PREPARING_FOR_TRANSFER") && (
          <MagnifyingGlass size={44} color="#1d798b" />
        )}
        {(packageStatusLog.status === "INCOMING" ||
          packageStatusLog.status === "TRANSFERRING_FORWARDER" ||
          packageStatusLog.status === "TRANSFERRING_WAREHOUSE") && (
          <Truck size={44} color="#1d798b" />
        )}
        {packageStatusLog.status === "TRANSFERRED_FORWARDER" && (
          <Warehouse size={44} color="#1d798b" />
        )}
        {packageStatusLog.status === "IN_WAREHOUSE" && (
          <Package size={44} color="#1d798b" />
        )}
      </div>
      <div className="ml-4">
        <div className="text-gray-600">
          {DateTime.fromISO(packageStatusLog.createdAt).toLocaleString(
            DateTime.DATETIME_FULL,
          )}
        </div>
        <div className="text-lg font-semibold">
          {packageStatusLog.status.replaceAll("_", " ")}
        </div>
        <div className="text-lg">{packageStatusLog.description}</div>
      </div>
    </div>
  )
}

export function VerticalTimeline({
  packageStatusLogs,
}: {
  packageStatusLogs: PackageStatusLog[]
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-4 px-12 py-6">
      {packageStatusLogs.map((packageStatusLog) => (
        <TimelineItem
          key={packageStatusLog.id}
          packageStatusLog={packageStatusLog}
        />
      ))}
    </div>
  )
}

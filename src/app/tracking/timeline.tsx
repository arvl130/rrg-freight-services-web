import type { PackageStatusLog } from "@/server/db/entities"
import { Truck } from "@phosphor-icons/react/dist/ssr/Truck"
import { DropboxLogo } from "@phosphor-icons/react/dist/ssr/DropboxLogo"
import { Package } from "@phosphor-icons/react/dist/ssr/Package"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass"
import { Moped } from "@phosphor-icons/react/dist/ssr/Moped"
import { DateTime } from "luxon"

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
        {packageStatusLog.status === "DELIVERING" && (
          <Moped size={44} color="#1d798b" />
        )}
        {packageStatusLog.status === "SORTING" && (
          <MagnifyingGlass size={44} color="#1d798b" />
        )}
        {(packageStatusLog.status === "INCOMING" ||
          packageStatusLog.status === "TRANSFERRING_FORWARDER" ||
          packageStatusLog.status === "TRANSFERRING_WAREHOUSE") && (
          <Truck size={44} color="#1d798b" />
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

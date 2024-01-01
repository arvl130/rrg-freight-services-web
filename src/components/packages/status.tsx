import { api } from "@/utils/api"
import { getColorFromPackageStatus } from "@/utils/colors"

export function PackageStatus({ packageId }: { packageId: number }) {
  const {
    isLoading,
    isError,
    data: packageStatusLog,
  } = api.package.getLatestStatus.useQuery({
    id: packageId,
  })

  if (isLoading)
    return (
      <div className="w-36 py-0.5 text-white text-center rounded-md">...</div>
    )

  if (isError)
    return (
      <div className="w-36 py-0.5 text-white text-center rounded-md">error</div>
    )

  if (packageStatusLog === null)
    return (
      <div className="w-36 py-0.5 text-white text-center rounded-md">n/a</div>
    )

  return (
    <div
      className={`
        w-36 py-0.5 text-white text-center rounded-md
        ${getColorFromPackageStatus(packageStatusLog.status)}
      `}
    >
      {packageStatusLog.status.replaceAll("_", " ")}
    </div>
  )
}

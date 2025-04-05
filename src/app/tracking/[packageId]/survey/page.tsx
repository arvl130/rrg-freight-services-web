import { db } from "@/server/db/client"
import {
  packageMonitoringAccessKeys,
  packages,
  survey as surveys,
} from "@/server/db/schema"
import { and, eq } from "drizzle-orm"
import { MainSection } from "./main-section"
import Link from "next/link"

async function hasTakenSurvey(options: { packageId: string }) {
  const results = await db
    .select()
    .from(surveys)
    .where(eq(surveys.packageId, options.packageId))

  return results.length > 0
}

async function hasValidAccessKey(options: {
  packageId: string
  accessKey: string
}) {
  const matchingKeys = await db
    .select()
    .from(packageMonitoringAccessKeys)
    .where(
      and(
        eq(packageMonitoringAccessKeys.packageId, options.packageId),
        eq(packageMonitoringAccessKeys.accessKey, options.accessKey),
      ),
    )

  return matchingKeys.length !== 0
}

function ErrorView() {
  return (
    <div className="min-h-dvh flex flex-col justify-center items-center">
      <p className="font-semibold text-lg">Access denied</p>
      <p>Missing or invalid access key for viewing this page.</p>
    </div>
  )
}

function DoneView(props: { packageId: string }) {
  return (
    <div className="min-h-dvh flex flex-col justify-center items-center">
      <p className="font-semibold text-lg">
        This survey has already been filled out.
      </p>
      <p>
        <Link
          className="hover:underline"
          href={`/tracking?id=${props.packageId}`}
        >
          « Back to Tracking page
        </Link>
      </p>
    </div>
  )
}

export default async function Page(
  props: {
    params: Promise<{ packageId: string }>
    searchParams?: Promise<{
      accessKey?: string
    }>
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const accessKey = searchParams?.accessKey

  if (accessKey === undefined) return <ErrorView />

  const hasValid = await hasValidAccessKey({
    packageId: params.packageId,
    accessKey,
  })

  if (!hasValid) return <ErrorView />

  const hasTaken = await hasTakenSurvey({
    packageId: params.packageId,
  })

  if (hasTaken) return <DoneView packageId={params.packageId} />

  const [_package] = await db
    .select()
    .from(packages)
    .where(eq(packages.id, params.packageId))

  return <MainSection package={_package} />
}

import { db } from "@/server/db/client"
import {
  deliveryShipments,
  forwarderTransferShipments,
  incomingShipments,
  packageMonitoringAccessKeys,
  packages,
  shipmentPackages,
  shipments,
  warehouseTransferShipments,
  survey as surveys,
} from "@/server/db/schema"
import { and, eq, getTableColumns } from "drizzle-orm"
import { MainSection } from "./main-section"

async function getAllShipmentTypesByPackageId(input: { packageId: string }) {
  const shipmentColumns = getTableColumns(shipments)
  const { shipmentId: _, ...incomingShipmentColumns } =
    getTableColumns(incomingShipments)

  const { shipmentId: __, ...deliveryShipmentColumns } =
    getTableColumns(deliveryShipments)

  const { shipmentId: ___, ...forwarderTransferShipmentColumns } =
    getTableColumns(forwarderTransferShipments)

  const { shipmentId: ____, ...warehouseTransferShipmentColumns } =
    getTableColumns(warehouseTransferShipments)

  const incomingShipmentResults = await db
    .selectDistinct({
      ...shipmentColumns,
      ...incomingShipmentColumns,
    })
    .from(shipmentPackages)
    .innerJoin(shipments, eq(shipmentPackages.shipmentId, shipments.id))
    .innerJoin(
      incomingShipments,
      eq(shipmentPackages.shipmentId, incomingShipments.shipmentId),
    )
    .where(eq(shipmentPackages.packageId, input.packageId))

  const deliveryShipmentResults = await db
    .selectDistinct({
      ...shipmentColumns,
      ...deliveryShipmentColumns,
    })
    .from(shipmentPackages)
    .innerJoin(shipments, eq(shipmentPackages.shipmentId, shipments.id))
    .innerJoin(
      deliveryShipments,
      eq(shipmentPackages.shipmentId, deliveryShipments.shipmentId),
    )
    .where(eq(shipmentPackages.packageId, input.packageId))

  const forwarderTransferShipmentResults = await db
    .selectDistinct({
      ...shipmentColumns,
      ...forwarderTransferShipmentColumns,
    })
    .from(shipmentPackages)
    .innerJoin(shipments, eq(shipmentPackages.shipmentId, shipments.id))
    .innerJoin(
      forwarderTransferShipments,
      eq(shipmentPackages.shipmentId, forwarderTransferShipments.shipmentId),
    )
    .where(eq(shipmentPackages.packageId, input.packageId))

  const warehouseTransferShipmentResults = await db
    .selectDistinct({
      ...shipmentColumns,
      ...warehouseTransferShipmentColumns,
    })
    .from(shipmentPackages)
    .innerJoin(shipments, eq(shipmentPackages.shipmentId, shipments.id))
    .innerJoin(
      warehouseTransferShipments,
      eq(shipmentPackages.shipmentId, warehouseTransferShipments.shipmentId),
    )
    .where(eq(shipmentPackages.packageId, input.packageId))

  return {
    incomingShipments: incomingShipmentResults,
    deliveryShipments: deliveryShipmentResults,
    forwarderTransferShipments: forwarderTransferShipmentResults,
    warehouseTransferShipments: warehouseTransferShipmentResults,
  }
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

async function hasTakenSurvey(options: { packageId: string }) {
  const results = await db
    .select()
    .from(surveys)
    .where(eq(surveys.packageId, options.packageId))

  return results.length > 0
}

function ErrorView() {
  return (
    <div className="min-h-dvh flex flex-col justify-center items-center">
      <p className="font-semibold text-lg">Access denied</p>
      <p>Missing or invalid access key for viewing this page.</p>
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

  const {
    deliveryShipments,
    forwarderTransferShipments,
    warehouseTransferShipments,
  } = await getAllShipmentTypesByPackageId({
    packageId: params.packageId,
  })

  const [_package] = await db
    .select()
    .from(packages)
    .where(eq(packages.id, params.packageId))

  const hasTaken = await hasTakenSurvey({
    packageId: params.packageId,
  })

  return (
    <MainSection
      settledAt={_package.settledAt}
      package={_package}
      hasTakenSurvey={hasTaken}
      accessKey={accessKey}
    />
  )
}

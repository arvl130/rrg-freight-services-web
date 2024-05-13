import { AdminLayout } from "@/app/admin/auth"
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr/CalendarBlank"
import { FunnelSimple } from "@phosphor-icons/react/dist/ssr/FunnelSimple"
import {
  PackagesInWarehouseTile,
  SkeletonPackagesInWarehouseTile,
} from "./total-warehouse-packages"
import { unstable_noStore as noStore } from "next/cache"
import {
  DelayPackagesTile,
  SkeletonDelayPackagesTile,
} from "./total-delay-packages"
import {
  IncomingShipmentsTile,
  SkeletonIncomingShipmentsTile,
} from "./total-incoming-shipments"
import { WarehouseCapacityTile } from "./warehouse-capacity-tile"
import { VehicleStatusTile } from "./vehicle-status-tile"
import { RefreshButton } from "./refresh-button"
import { RevalidatedPageProvider } from "@/providers/revalidated-page"
import { RevalidatedPageBoundary } from "@/components/revalidated-page-boundary"
import { validateSessionWithCookies } from "@/server/auth"
import { redirect } from "next/navigation"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import { DriverStatusTile } from "./driver-status-tile"
import { PackagePerMonth } from "./package-per-month"
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
import { DateTime } from "luxon"
import { LogsTile } from "./logs-tile"
import { WarehouseLayout } from "@/app/warehouse/auth"
const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
]

export default async function DashboardPage() {
  const { user } = await validateSessionWithCookies()
  if (!user) {
    return redirect("/login")
  }

  if (user.role !== "WAREHOUSE") {
    const redirectPath = getUserRoleRedirectPath(user.role)
    return redirect(redirectPath)
  }
  noStore()
  const warehouseData = await db.select().from(warehouses)

  const meterCubePacakges = warehouseData.map(async (warehouse) => {
    const inWarehousePackages = await db
      .select()
      .from(packages)
      .where(
        and(
          eq(packages.status, "IN_WAREHOUSE"),
          eq(packages.lastWarehouseId, warehouse.id),
        ),
      )

    let meter = 0

    inWarehousePackages.map((volume) => {
      meter = meter + volume.volumeInCubicMeter
    })

    return { warehouseId: warehouse.id, totalVolume: meter }
  })

  const warehouseCapacity = await Promise.all(meterCubePacakges)

  const currentYear = DateTime.now().year

  const packagePerMonths = months.map(async (month, index) => {
    let monthIndex = ""
    if (index + 1 < 10) {
      monthIndex = "0" + (index + 1).toString()
    } else {
      monthIndex = (index + 1).toString()
    }

    const [{ value }] = await db
      .select({ value: count() })
      .from(packages)
      .where(like(packages.createdAt, `%${currentYear}-${monthIndex}%`))
    return value
  })

  const packagePerMonthsResult = await Promise.all(packagePerMonths)

  const logs = await db
    .select()
    .from(activities)
    .innerJoin(users, eq(activities.createdById, users.id))
    .orderBy(desc(activities.createdAt))
    .limit(6)
    .where(eq(activities.createdById, user.id))

  const latestDeliveryShipment = db
    .select({ value: max(deliveryShipments.createdAt) })
    .from(deliveryShipments)
    .where(eq(deliveryShipments.vehicleId, vehicles.id))

  const vehicleStatus = await db
    .select()
    .from(vehicles)
    .leftJoin(
      deliveryShipments,
      and(
        eq(vehicles.id, deliveryShipments.vehicleId),
        eq(deliveryShipments.createdAt, latestDeliveryShipment),
      ),
    )
    .leftJoin(shipments, eq(shipments.id, deliveryShipments.shipmentId))

  return (
    <WarehouseLayout title="Dashboard" user={user}>
      <h1 className="text-2xl font-black [color:_#00203F] mb-4">Dashboard</h1>
      <RevalidatedPageProvider>
        <section className="mb-6">
          <div className="mb-4 flex flex-wrap sm:justify-end gap-3">
            <RefreshButton />
          </div>

          <div className="grid sm:grid-cols-[repeat(3,_minmax(0,_24rem))] gap-x-8 gap-y-4 justify-center">
            <RevalidatedPageBoundary
              fallback={<SkeletonPackagesInWarehouseTile />}
            >
              <PackagesInWarehouseTile />
            </RevalidatedPageBoundary>
            <RevalidatedPageBoundary fallback={<SkeletonDelayPackagesTile />}>
              <DelayPackagesTile />
            </RevalidatedPageBoundary>
            <RevalidatedPageBoundary
              fallback={<SkeletonIncomingShipmentsTile />}
            >
              <IncomingShipmentsTile />
            </RevalidatedPageBoundary>
          </div>
        </section>
      </RevalidatedPageProvider>

      <section className="grid sm:grid-cols-2 gap-x-6 gap-y-4 [color:_#404040] mb-6">
        <PackagePerMonth
          packagesPerMonth={packagePerMonthsResult}
          monthsLabel={months}
        />
        <WarehouseCapacityTile
          warehouses={warehouseData}
          packages={warehouseCapacity}
        />
      </section>

      <section className="grid lg:grid-cols-[25rem_20rem_1fr] gap-x-6 gap-y-4 [color:_#404040]">
        <LogsTile logs={logs} />
        <VehicleStatusTile vehicleStatuses={vehicleStatus} />
        <DriverStatusTile />
      </section>
    </WarehouseLayout>
  )
}

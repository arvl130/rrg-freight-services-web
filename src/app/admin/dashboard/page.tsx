import { AdminLayout } from "@/layouts/admin"
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr/CalendarBlank"
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import { FunnelSimple } from "@phosphor-icons/react/dist/ssr/FunnelSimple"
import { User } from "@phosphor-icons/react/dist/ssr/User"
import {
  PackagesInWarehouseTile,
  SkeletonPackagesInWarehouseTile,
} from "./packages-in-warehouse-tile"
import { ActiveUsersTile, SkeletonActiveUsersTile } from "./active-users-tile"
import {
  ManifestsShippedTile,
  SkeletonManifestsShippedTile,
} from "./manifests-shipped-tile"
import { DeliverySummaryTile } from "./delivery-summary-tile"
import { UserStatusTile } from "./user-summary-tile"
import { RefreshButton } from "./refresh-button"
import { RevalidatedPageProvider } from "@/providers/revalidated-page"
import { RevalidatedPageBoundary } from "@/components/revalidated-page-boundary"

function RecentActivityTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[24rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Recent Activity</h2>
          <p className="flex items-center">
            See more <CaretRight size={16} />
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="text-sm">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_6rem] text-gray-400 mb-1">
          <div>User</div>
          <div>Role</div>
          <div>Action</div>
        </div>
        {/* Body */}
        <div>
          <div className="grid grid-cols-[1fr_1fr_6rem]">
            <div className="grid grid-cols-[2rem_1fr] gap-2">
              <div className="bg-gray-200 flex justify-center items-center h-8 rounded-md">
                <User size={16} />
              </div>
              <div className="flex items-center">John Doe</div>
            </div>
            <div className="flex items-center text-gray-400">
              Warehouse Staff
            </div>
            <div className="flex justify-center items-center uppercase bg-yellow-600 text-white rounded-md">
              Updated
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function ManifestSummaryTile() {
  return (
    <article className="bg-white rounded-lg px-6 py-4 shadow-md min-h-[20rem]">
      <div className="mb-2">
        <div className="flex justify-between">
          <h2 className="font-semibold">Manifest Summary</h2>
          <p className="flex items-center">
            See more <CaretRight size={16} />
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="text-sm">
        {/* Header */}
        <div className="grid grid-cols-5 text-gray-400 mb-1">
          <div>ID</div>
          <div>Date Issued</div>
          <div>Col 3</div>
          <div>Col 4</div>
          <div>Col 5</div>
        </div>
      </div>
    </article>
  )
}

export default function DashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <h1 className="text-2xl font-black [color:_#00203F] mb-4">Dashboard</h1>
      <RevalidatedPageProvider>
        <section className="mb-6">
          <div className="mb-4 flex justify-end gap-3">
            <div className="flex text-sm">
              <input
                type="date"
                className="rounded-l-md border-y border-l border-gray-300 pl-2"
              />
              <span className="bg-brand-cyan-500 text-white h-10 aspect-square flex justify-center items-center rounded-r-md">
                <CalendarBlank size={24} />
              </span>
            </div>

            <RefreshButton />

            <button
              type="button"
              className="bg-brand-cyan-500 text-white h-10 aspect-square flex justify-center items-center rounded-md"
            >
              <span className="sr-only">Filter</span>
              <FunnelSimple size={24} />
            </button>
          </div>

          <div className="grid grid-cols-[repeat(3,_minmax(0,_24rem))] gap-x-8">
            <RevalidatedPageBoundary
              fallback={<SkeletonPackagesInWarehouseTile />}
            >
              <PackagesInWarehouseTile />
            </RevalidatedPageBoundary>
            <RevalidatedPageBoundary fallback={<SkeletonActiveUsersTile />}>
              <ActiveUsersTile />
            </RevalidatedPageBoundary>
            <RevalidatedPageBoundary
              fallback={<SkeletonManifestsShippedTile />}
            >
              <ManifestsShippedTile />
            </RevalidatedPageBoundary>
          </div>
        </section>
      </RevalidatedPageProvider>

      <section className="grid grid-cols-[24rem_1fr] gap-x-6 [color:_#404040] mb-6">
        <RecentActivityTile />
        <DeliverySummaryTile />
      </section>

      <section className="grid grid-cols-[1fr_20rem] gap-x-6 [color:_#404040]">
        <ManifestSummaryTile />
        <UserStatusTile />
      </section>
    </AdminLayout>
  )
}

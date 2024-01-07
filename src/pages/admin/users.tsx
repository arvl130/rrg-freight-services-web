import { AdminLayout } from "@/layouts/admin"
import { useSession } from "@/utils/auth"
import { Plus } from "@phosphor-icons/react/Plus"
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple"
import { Export } from "@phosphor-icons/react/Export"
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass"
import { CaretLeft } from "@phosphor-icons/react/CaretLeft"
import { CaretDoubleLeft } from "@phosphor-icons/react/CaretDoubleLeft"
import { CaretRight } from "@phosphor-icons/react/CaretRight"
import { CaretDoubleRight } from "@phosphor-icons/react/CaretDoubleRight"
import * as Page from "@/components/page"
import * as Table from "@/components/table"
import { api } from "@/utils/api"
import { User } from "@/server/db/entities"
import { LoadingSpinner } from "@/components/spinner"
import { TableItem } from "@/components/users/table-item"
import { usePaginatedItems } from "@/hooks/paginated-items"
import { useState } from "react"
import { SUPPORTED_USER_ROLES, UserRole } from "@/utils/constants"
import { supportedRoleToHumanized } from "@/utils/humanize"

function PageHeader() {
  return (
    <div className="flex justify-between mb-4">
      <h1 className="text-2xl font-black [color:_#00203F] mb-2">Users</h1>
      <div>
        <button
          type="button"
          className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium"
        >
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </div>
    </div>
  )
}

function filterBySearchTerm(items: User[], searchTerm: string) {
  return items.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm),
  )
}

type ActiveStatus = "ACTIVE" | "NOT_ACTIVE"

function filterByActiveStatus(items: User[], status: ActiveStatus | "ALL") {
  if (status === "ACTIVE") return items.filter((item) => item.isEnabled)
  if (status === "NOT_ACTIVE") return items.filter((item) => !item.isEnabled)

  return items
}

function filterByRole(items: User[], role: UserRole | "ALL") {
  if (role === "ALL") return items

  return items.filter((item) => item.role === role)
}

function UsersTable({ items }: { items: User[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleActiveStatus, setVisibleActiveStatus] = useState<
    ActiveStatus | "ALL"
  >("ALL")
  const [visibleRole, setVisibleRole] = useState<UserRole | "ALL">("ALL")

  const visibleItems = filterBySearchTerm(
    filterByRole(filterByActiveStatus(items, visibleActiveStatus), visibleRole),
    searchTerm,
  )

  const {
    pageNumber,
    pageSize,
    pageCount,
    isOnFirstPage,
    isOnLastPage,
    paginatedItems,
    updatePageSize,
    resetPageNumber,
    gotoFirstPage,
    gotoLastPage,
    gotoPage,
    gotoNextPage,
    gotoPreviousPage,
  } = usePaginatedItems<User>({
    items: visibleItems,
  })

  return (
    <>
      <Table.Filters>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3">
          <div>
            <Table.SearchForm
              updateSearchTerm={(searchTerm) => setSearchTerm(searchTerm)}
              resetPageNumber={resetPageNumber}
            />
          </div>
          <div className="flex gap-3 text-sm">
            <select
              className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium"
              value={visibleRole}
              onChange={(e) => {
                for (const supportedUserRole of SUPPORTED_USER_ROLES) {
                  if (e.currentTarget.value === supportedUserRole) {
                    setVisibleRole(supportedUserRole)
                    return
                  }
                }

                setVisibleRole("ALL")
              }}
            >
              <option value="ALL">All Roles</option>
              {SUPPORTED_USER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {supportedRoleToHumanized(role)}
                </option>
              ))}
            </select>
            <select className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium">
              <option value="">All Permissions</option>
            </select>
            <select
              className="bg-white border border-gray-300 px-2 py-1.5 w-32 rounded-md text-gray-400 font-medium"
              value={visibleActiveStatus}
              onChange={(e) => {
                if (e.currentTarget.value === "ACTIVE") {
                  setVisibleActiveStatus("ACTIVE")
                  return
                }

                if (e.currentTarget.value === "NOT_ACTIVE") {
                  setVisibleActiveStatus("NOT_ACTIVE")
                  return
                }

                setVisibleActiveStatus("ALL")
              }}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="NOT_ACTIVE">Not Active</option>
            </select>
            <button
              type="button"
              className="bg-white border border-gray-300 px-3 py-1.5 rounded-md text-gray-400 font-medium"
            >
              Clear Filter
            </button>
          </div>
          <div className="flex justify-end gap-3 text-sm">
            <button
              type="button"
              className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium"
            >
              <DownloadSimple size={16} />
              <span>Import</span>
            </button>
            <Table.ExportButton records={paginatedItems} />
          </div>
        </div>
      </Table.Filters>
      <Table.Content>
        <div className="flex justify-end mb-3">
          <Table.Pagination
            pageNumber={pageNumber}
            pageSize={pageSize}
            pageCount={pageCount}
            isOnFirstPage={isOnFirstPage}
            isOnLastPage={isOnLastPage}
            updatePageSize={updatePageSize}
            gotoFirstPage={gotoFirstPage}
            gotoLastPage={gotoLastPage}
            gotoPage={gotoPage}
            gotoNextPage={gotoNextPage}
            gotoPreviousPage={gotoPreviousPage}
          />
        </div>
        <div>
          <Table.Header>
            <div className="grid grid-cols-4">
              <div className="uppercase px-4 py-2">Name</div>
              <div className="uppercase px-4 py-2">Email</div>
              <div className="uppercase px-4 py-2">Role</div>
              <div className="uppercase px-4 py-2">Status</div>
            </div>
          </Table.Header>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4">No users found.</div>
          ) : (
            <div>
              {paginatedItems.map((item) => (
                <TableItem key={item.id} user={item} />
              ))}
            </div>
          )}
        </div>
      </Table.Content>
    </>
  )
}

export default function UsersPage() {
  const { user, role } = useSession()
  const {
    isLoading,
    isError,
    data: users,
  } = api.user.getAll.useQuery(undefined, {
    enabled: user !== null && role === "ADMIN",
  })

  return (
    <AdminLayout title="Users">
      <PageHeader />
      {isLoading ? (
        <div className="flex justify-center pt-4">
          <LoadingSpinner />
        </div>
      ) : (
        <>{isError ? <>Error :{"("}</> : <UsersTable items={users} />}</>
      )}
    </AdminLayout>
  )
}

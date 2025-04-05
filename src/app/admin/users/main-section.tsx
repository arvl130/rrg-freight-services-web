"use client"

import { Plus } from "@phosphor-icons/react/dist/ssr/Plus"
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple"
import * as Table from "@/components/table"
import { api } from "@/utils/api"
import type { User } from "@/server/db/entities"
import { LoadingSpinner } from "@/components/spinner"
import { TableItem } from "./table-item"
import { usePaginatedItems } from "@/hooks/paginated-items"
import { useState } from "react"
import type { UserRole } from "@/utils/constants"
import { SUPPORTED_USER_ROLES } from "@/utils/constants"
import { getHumanizedOfUserRole } from "@/utils/humanize"
import { CreateModal } from "./create-modal"
import { ShowGeneratedPasswordModal } from "./show-generated-password-modal"

function filterBySearchTerm(items: User[], searchTerm: string) {
  return items.filter((item) => {
    const searchTermSearchable = searchTerm.toLowerCase()
    const displayName = item.displayName.toLowerCase()
    const email = item.emailAddress.toLowerCase()

    return (
      displayName.includes(searchTermSearchable) ||
      email.includes(searchTermSearchable)
    )
  })
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
        <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3">
          <div>
            <Table.SearchForm
              updateSearchTerm={(searchTerm) => setSearchTerm(searchTerm)}
              resetPageNumber={resetPageNumber}
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-[repeat(3,_minmax(0,_1fr))_auto] gap-3 text-sm">
            <select
              className="bg-white border border-gray-300 px-2 py-1.5 w-full sm:w-32 h-[2.375rem] rounded-md text-gray-400 font-medium"
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
                  {getHumanizedOfUserRole(role)}
                </option>
              ))}
            </select>
            <select
              className="bg-white border border-gray-300 px-2 py-1.5 w-full sm:w-32 h-[2.375rem] rounded-md text-gray-400 font-medium"
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
              className="bg-white border border-gray-300 px-3 py-1.5 w-full sm:w-auto rounded-md text-gray-400 font-medium"
            >
              Clear Filter
            </button>
          </div>
          <div className="flex flex-wrap items-start justify-end gap-3">
            <button
              type="button"
              className="inline-flex text-sm items-center gap-1 hover:bg-sky-400 bg-sky-500 disabled:bg-sky-300 text-white transition-colors px-6 py-2 font-medium"
              disabled={true}
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
        <div className="grid grid-cols-[repeat(4,_auto)_1fr] auto-rows-min overflow-auto">
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Name
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Email
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Role
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Status
          </div>
          <div className="uppercase px-4 py-2 border-y border-gray-300 font-medium">
            Actions
          </div>
          {paginatedItems.length === 0 ? (
            <div className="text-center pt-4 col-span-5">No users found.</div>
          ) : (
            <>
              {paginatedItems.map((item) => (
                <TableItem key={item.id} user={item} />
              ))}
            </>
          )}
        </div>
      </Table.Content>
    </>
  )
}

export function HeaderSection() {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState<null | string>(
    null,
  )

  return (
    <>
      <h1 className="text-2xl font-black mb-2 [color:_#00203F] flex items-center gap-1">
        Users
      </h1>
      <div className="grid">
        <button
          type="button"
          className="flex items-center gap-1 bg-brand-cyan-500 text-white px-6 py-2 font-medium mt-auto"
          onClick={() => setIsOpenCreateModal(true)}
        >
          <Plus size={16} />
          <span>Create User</span>
        </button>
      </div>
      <CreateModal
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
        onSuccess={({ generatedPassword: newGeneratedPassword }) => {
          setIsOpenCreateModal(false)
          if (newGeneratedPassword) setGeneratedPassword(newGeneratedPassword)
        }}
      />
      {generatedPassword && (
        <ShowGeneratedPasswordModal
          generatedPassword={generatedPassword}
          isOpen={true}
          onClose={() => setGeneratedPassword(null)}
        />
      )}
    </>
  )
}

export function MainSection() {
  const { status, data: users, error } = api.user.getAll.useQuery()

  if (status === "pending")
    return (
      <div className="flex justify-center pt-4">
        <LoadingSpinner />
      </div>
    )

  if (status === "error")
    return (
      <div className="flex justify-center pt-4">
        An error occured: {error.message}
      </div>
    )

  return <UsersTable items={users} />
}

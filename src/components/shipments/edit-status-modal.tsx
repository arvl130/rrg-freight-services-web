import * as Dialog from "@radix-ui/react-dialog"
import { Shipment, ShipmentStatusLog } from "@/server/db/entities"
import { api } from "@/utils/api"
import { TrashSimple } from "@phosphor-icons/react/TrashSimple"
import { DateTime } from "luxon"
import { getColorFromShipmentStatus } from "@/utils/colors"
import {
  ShipmentStatus,
  getDescriptionForNewShipmentStatusLog,
  supportedShipmentStatuses,
} from "@/utils/constants"
import { z } from "zod"
import { useSession } from "@/utils/auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

function StatusLogItem({
  shipmentId,
  isOnlyItem,
  isFirstItem,
  statusLog,
}: {
  shipmentId: number
  isOnlyItem: boolean
  isFirstItem: boolean
  statusLog: ShipmentStatusLog
}) {
  const apiUtils = api.useUtils()
  const { isLoading, mutate } = api.shipmentStatusLog.deleteById.useMutation({
    onSuccess: () =>
      apiUtils.shipmentStatusLog.getByShipmentId.invalidate({
        shipmentId,
      }),
  })

  return (
    <div
      className={`px-4 py-2 grid grid-cols-[1fr_10rem_auto] items-center ${
        isFirstItem ? "border" : "border-x border-b"
      } border-gray-300`}
    >
      <div className="text-sm">
        {DateTime.fromJSDate(statusLog.createdAt).toLocaleString(
          DateTime.DATETIME_FULL,
        )}
      </div>
      <div>
        <span
          className={`${getColorFromShipmentStatus(
            statusLog.status,
          )} inline-flex rounded-full text-white px-3`}
        >
          {statusLog.status}
        </span>
      </div>
      <button
        type="button"
        className="px-2 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 transition-colors duration-200 rounded-lg"
        title={
          isOnlyItem
            ? "Item cannot be deleted as it is the only status log in the shipment."
            : undefined
        }
        disabled={isLoading || isOnlyItem}
        onClick={() =>
          mutate({
            id: statusLog.id,
          })
        }
      >
        <TrashSimple size={20} />
        <span className="sr-only">Delete</span>
      </button>
    </div>
  )
}

const addStatusLogFormSchema = z.object({
  status: z.custom<ShipmentStatus>((val) =>
    supportedShipmentStatuses.includes(val as ShipmentStatus),
  ),
  createdAt: z.string().min(1),
  createdById: z.string().length(28),
})

type AddStatusLogFormType = z.infer<typeof addStatusLogFormSchema>

function getDateNowInputStr() {
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function AddStatusLogForm({ shipmentId }: { shipmentId: number }) {
  const { user } = useSession()
  const { status, data: users, error } = api.user.getAll.useQuery()

  const apiUtils = api.useUtils()
  const { isLoading, mutate } = api.shipmentStatusLog.create.useMutation({
    onSuccess: () =>
      apiUtils.shipmentStatusLog.getByShipmentId.invalidate({
        shipmentId,
      }),
  })

  const { handleSubmit, register } = useForm<AddStatusLogFormType>({
    resolver: zodResolver(addStatusLogFormSchema),
    defaultValues: {
      createdById: user?.uid,
      createdAt: getDateNowInputStr(),
    },
  })

  return (
    <form
      className="mb-6"
      onSubmit={handleSubmit((formData) => {
        const description = getDescriptionForNewShipmentStatusLog(
          formData.status,
        )

        mutate({
          shipmentId,
          createdAt: new Date(formData.createdAt),
          createdById: formData.createdById,
          status: formData.status,
          description,
        })
      })}
    >
      <div className="mb-3">
        <label className="block">Date & time</label>
        <input
          className="border border-gray-300 px-4 py-2 w-full"
          type="datetime-local"
          {...register("createdAt")}
        />
      </div>
      <div className="mb-3">
        <label className="block">Created By</label>
        <div>
          {status === "loading" && <p>Loading users ...</p>}
          {status === "error" && (
            <p>Could not retrieve users: {error.message}</p>
          )}
          {status === "success" && (
            <select
              className="border border-gray-300 px-4 py-2 bg-white w-full"
              {...register("createdById")}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.displayName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="mb-3">
        <label className="block">Status</label>
        <select
          className="border border-gray-300 px-4 py-2 bg-white w-full"
          {...register("status")}
        >
          {supportedShipmentStatuses.map((shipmentStatus) => (
            <option key={shipmentStatus} value={shipmentStatus}>
              {shipmentStatus}
            </option>
          ))}
        </select>
      </div>
      <div className="text-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 duration-200 transition-colors text-white font-medium rounded-md"
          disabled={isLoading}
        >
          Add
        </button>
      </div>
    </form>
  )
}

export function ShipmentsEditStatusModal({
  shipment,
  isOpen,
  close,
}: {
  shipment: Shipment
  isOpen: boolean
  close: () => void
}) {
  const {
    status,
    data: statusLogs,
    error,
  } = api.shipmentStatusLog.getByShipmentId.useQuery({
    shipmentId: shipment.id,
  })

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_2rem),_28rem)] rounded-lg bg-white"
        >
          <Dialog.Title className="[background-color:_#78CFDC] px-4 py-2 rounded-t-lg text-white font-semibold text-center">
            Edit Status
          </Dialog.Title>
          {status === "loading" && (
            <div className="flex justify-center items-center">Loading ...</div>
          )}
          {status === "error" && (
            <div className="flex justify-center items-center">
              An error occured: {error.message}
            </div>
          )}
          {status === "success" && (
            <div className="px-4 pt-2 pb-4">
              <AddStatusLogForm shipmentId={shipment.id} />
              <div>
                <p className="font-medium mb-1">Status Logs</p>
                {statusLogs.map((statusLog, index) => (
                  <StatusLogItem
                    key={statusLog.id}
                    shipmentId={shipment.id}
                    isOnlyItem={statusLogs.length === 1}
                    isFirstItem={index === 0}
                    statusLog={statusLog}
                  />
                ))}
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

import { Vehicle } from "@/server/db/entities"
import { api } from "@/utils/api"
import { SUPPORTED_VEHICLE_TYPES, VehicleType } from "@/utils/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "@phosphor-icons/react/X"
import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  type: z.custom<VehicleType>((val) =>
    SUPPORTED_VEHICLE_TYPES.includes(val as VehicleType),
  ),
  displayName: z.string().min(1).max(255),
  isExpressAllowed: z.boolean(),
})

type FormSchema = z.infer<typeof formSchema>

function EditForm({ vehicle, close }: { vehicle: Vehicle; close: () => void }) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: vehicle.type,
      displayName: vehicle.displayName,
      isExpressAllowed: vehicle.isExpressAllowed === 1,
    },
  })

  const apiUtils = api.useUtils()
  const { mutate, isLoading } = api.vehicle.updateById.useMutation({
    onSuccess: () => {
      apiUtils.vehicle.getById.invalidate({
        id: vehicle.id,
      })
      apiUtils.vehicle.getAll.invalidate()
      close()
      reset()
    },
  })

  return (
    <form
      className="px-4 pt-2 pb-4"
      onSubmit={handleSubmit((formData) =>
        mutate({
          ...formData,
          id: vehicle.id,
        }),
      )}
    >
      <div className="grid mb-3">
        <label className="font-medium">Display Name</label>
        <input
          type="text"
          className="px-2 py-1 border border-gray-300"
          {...register("displayName")}
        />
        {errors.displayName && (
          <div className="mt-1 text-red-500">{errors.displayName.message}.</div>
        )}
      </div>
      <div className="grid mb-3">
        <label className="font-medium">Type</label>
        <select
          className="bg-white px-2 py-2 border border-gray-300"
          {...register("type")}
        >
          {SUPPORTED_VEHICLE_TYPES.map((vehicleType) => (
            <option key={vehicleType} value={vehicleType}>
              {vehicleType}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="flex gap-2 font-medium">
          <span>Allow express shipments?</span>
          <input type="checkbox" {...register("isExpressAllowed")} />
        </label>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
          disabled={isLoading}
        >
          Edit
        </button>
      </div>
    </form>
  )
}

export function VehiclesEditModal({
  id,
  isOpen,
  close,
}: {
  id: number
  isOpen: boolean
  close: () => void
}) {
  const {
    status,
    data: vehicle,
    error,
  } = api.vehicle.getById.useQuery({
    id,
  })
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            Edit Vehicle
          </Dialog.Title>
          {status === "loading" && <div>Loading ...</div>}
          {status === "error" && <div>Error occured: {error.message}</div>}
          {status === "success" && <EditForm vehicle={vehicle} close={close} />}
          <Dialog.Close asChild>
            <button
              type="button"
              className="text-white absolute top-3 right-3"
              onClick={close}
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

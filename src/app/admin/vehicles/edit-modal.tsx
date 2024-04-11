import type { Vehicle } from "@/server/db/entities"
import { api } from "@/utils/api"
import type { VehicleType } from "@/utils/constants"
import {
  REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS,
  SUPPORTED_VEHICLE_TYPES,
} from "@/utils/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const formSchema = z.object({
  type: z.custom<VehicleType>((val) =>
    SUPPORTED_VEHICLE_TYPES.includes(val as VehicleType),
  ),
  displayName: z.string().min(1).max(100),
  plateNumber: z.string().min(1).max(15),
  weightCapacityInKg: z.string().regex(REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS),
  isExpressAllowed: z.boolean(),
})

const schemaRefined = formSchema.superRefine(
  ({ type, weightCapacityInKg }, ctx) => {
    if (type === "TRUCK") {
      const weight = parseFloat(weightCapacityInKg)
      if (weight < 2000) {
        ctx.addIssue({
          code: "custom",
          message: "Weight must be a minimum of 2000",
          path: ["weightCapacityInKg"],
        })
      } else if (weight > 4000) {
        ctx.addIssue({
          code: "custom",
          message: "Weight must be a maximum of 4000",
          path: ["weightCapacityInKg"],
        })
      }
    }

    if (type === "VAN") {
      const weight = parseFloat(weightCapacityInKg)
      if (weight < 500) {
        ctx.addIssue({
          code: "custom",
          message: "Weight must be a minimum of 500",
          path: ["weightCapacityInKg"],
        })
      } else if (weight > 1000) {
        ctx.addIssue({
          code: "custom",
          message: "Weight must be a maximum of 1000",
          path: ["weightCapacityInKg"],
        })
      }
    }
  },
)

type FormSchema = z.infer<typeof formSchema>

function EditForm({ vehicle, close }: { vehicle: Vehicle; close: () => void }) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schemaRefined),
    defaultValues: {
      type: vehicle.type,
      displayName: vehicle.displayName,
      plateNumber: vehicle.plateNumber,
      weightCapacityInKg: vehicle.weightCapacityInKg.toString(),
      isExpressAllowed: vehicle.isExpressAllowed === 1,
    },
  })

  const apiUtils = api.useUtils()
  const { mutate, isLoading } = api.vehicle.updateById.useMutation({
    onSuccess: () => {
      toast.success("Vehicle updated.")
      apiUtils.vehicle.getById.invalidate({
        id: vehicle.id,
      })
      apiUtils.vehicle.getAll.invalidate()
      close()
      reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <form
      className="px-4 pt-2 pb-4"
      onSubmit={handleSubmit((formData) =>
        mutate({
          ...formData,
          id: vehicle.id,
          weightCapacityInKg: Number(formData.weightCapacityInKg),
        }),
      )}
    >
      <div className="grid mb-3">
        <label className="font-medium mb-1">Display Name</label>
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
        <label className="font-medium mb-1">Plate No.</label>
        <input
          type="text"
          className="px-2 py-1 border border-gray-300"
          {...register("plateNumber")}
        />
        {errors.plateNumber && (
          <div className="mt-1 text-red-500">{errors.plateNumber.message}.</div>
        )}
      </div>
      <div className="grid mb-3">
        <label className="font-medium mb-1">Weight Capacity (in KG)</label>
        <input
          type="number"
          step={0.1}
          min={0.1}
          className="px-2 py-1 border border-gray-300"
          {...register("weightCapacityInKg")}
        />
        {errors.weightCapacityInKg && (
          <div className="mt-1 text-red-500">
            {errors.weightCapacityInKg.message}.
          </div>
        )}
      </div>
      <div className="grid mb-3">
        <label className="font-medium mb-1">Type</label>
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

export function EditModal({
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
        <Dialog.Overlay className="bg-black/40 fixed inset-0" onClick={close} />
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

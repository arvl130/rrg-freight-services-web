import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import * as Dialog from "@radix-ui/react-dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import type { VehicleType } from "@/utils/constants"
import {
  SUPPORTED_VEHICLE_TYPES,
  REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS,
} from "@/utils/constants"

const formSchema = z.object({
  type: z.custom<VehicleType>((val) =>
    SUPPORTED_VEHICLE_TYPES.includes(val as VehicleType),
  ),
  displayName: z.string().min(1).max(100),
  plateNumber: z.string().min(1).max(15),
  weightCapacityInKg: z.string().regex(REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS),
  isExpressAllowed: z.boolean(),
  isMaintenance: z.boolean(),
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

const defaultWeightCapacityInKg = {
  VAN: "500",
  TRUCK: "2000",
}

function CreateForm({ onClose }: { onClose: () => void }) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schemaRefined),
    defaultValues: {
      weightCapacityInKg:
        defaultWeightCapacityInKg.VAN || defaultWeightCapacityInKg.TRUCK,
    },
  })

  const apiUtils = api.useUtils()
  const { mutate, isPending } = api.vehicle.create.useMutation({
    onSuccess: () => {
      toast.success("Vehicle created.")
      apiUtils.vehicle.getAll.invalidate()
      onClose()
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
          type="text"
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
      <div className="mb-3">
        <label className="flex gap-2 font-medium">
          <span>Has Ongoing Maintenance?</span>
          <input type="checkbox" {...register("isMaintenance")} />
        </label>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
          disabled={isPending}
        >
          Create
        </button>
      </div>
    </form>
  )
}

export function CreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="bg-black/40 fixed inset-0"
          onClick={onClose}
        />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            New Vehicle
          </Dialog.Title>
          <CreateForm onClose={onClose} />
          <Dialog.Close asChild>
            <button
              type="button"
              className="text-white absolute top-3 right-3"
              onClick={onClose}
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

import { api } from "@/utils/api"
import { REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS } from "@/utils/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const formSchema = z.object({
  displayName: z.string().min(1).max(100),
  volumeCapacityInCubicMeter: z
    .string()
    .regex(REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS),
  targetUtilization: z.string().regex(REGEX_ONE_OR_MORE_DIGITS_WITH_DECIMALS),
})

type FormSchema = z.infer<typeof formSchema>

function CreateForm({ onClose }: { onClose: () => void }) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volumeCapacityInCubicMeter: "10",
      targetUtilization: "50",
    },
  })

  const apiUtils = api.useUtils()
  const { mutate, isPending } = api.warehouse.create.useMutation({
    onSuccess: () => {
      toast.success("Warehouse created.")
      apiUtils.warehouse.getAll.invalidate()
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
          volumeCapacityInCubicMeter: Number(
            formData.volumeCapacityInCubicMeter,
          ),
          targetUtilization: Number(formData.targetUtilization),
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
        <label className="font-medium mb-1">Space Capacity (in m³)</label>
        <input
          type="number"
          step={1}
          min={10}
          className="px-2 py-1 border border-gray-300"
          {...register("volumeCapacityInCubicMeter")}
        />
        {errors.volumeCapacityInCubicMeter && (
          <div className="mt-1 text-red-500">
            {errors.volumeCapacityInCubicMeter.message}.
          </div>
        )}
      </div>
      <div className="grid mb-3">
        <label className="font-medium mb-1">Target Utilization (in %)</label>
        <input
          type="number"
          step={1}
          max={100}
          min={20}
          className="px-2 py-1 border border-gray-300"
          {...register("targetUtilization")}
        />
        {errors.targetUtilization && (
          <div className="mt-1 text-red-500">
            {errors.targetUtilization.message}.
          </div>
        )}
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
            New Warehouse
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

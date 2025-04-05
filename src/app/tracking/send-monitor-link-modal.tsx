import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import * as Dialog from "@radix-ui/react-dialog"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  requestedBy: z.literal("SENDER").or(z.literal("RECEIVER")),
})

type FormSchema = z.infer<typeof formSchema>

function RequestForm({
  packageId,
  onClose,
}: {
  packageId: string
  onClose: () => void
}) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestedBy: "RECEIVER",
    },
  })

  const { mutate, isPending } = api.monitoringLink.sendEmail.useMutation({
    onSuccess: () => {
      toast.success("Monitoring link sent.")
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
          packageId,
          requestedBy: formData.requestedBy,
        }),
      )}
    >
      <p className="mb-3">
        Only the shipper and consignee of the package can view its location
        history. Please tell us which of these people are making the request.
      </p>
      <div className="grid mb-3">
        <label className="font-medium mb-1">I am the:</label>
        <select
          className="bg-white px-2 py-2 border border-gray-300"
          {...register("requestedBy")}
        >
          <option value={"RECEIVER"}>Consignee</option>
          <option value={"SENDER"}>Shipper</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
          disabled={isPending}
        >
          Request
        </button>
      </div>
    </form>
  )
}

export function SendMonitoringLinkModal({
  packageId,
  isOpen,
  onClose,
}: {
  packageId: string
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="bg-black/40 fixed z-50 inset-0"
          onClick={onClose}
        />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_34rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            Request Monitoring Link for Location History
          </Dialog.Title>
          <RequestForm packageId={packageId} onClose={onClose} />
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

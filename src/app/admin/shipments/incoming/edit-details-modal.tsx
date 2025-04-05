import * as Dialog from "@radix-ui/react-dialog"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import type {
  NormalizedIncomingShipment,
  NormalizedPublicOverseasAgentUser,
} from "@/server/db/entities"
import { api } from "@/utils/api"
import { LoadingSpinner } from "@/components/spinner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"

const formSchema = z.object({
  sentByAgentId: z.string(),
})

type FormSchema = z.infer<typeof formSchema>

function EditForm({
  agents,
  shipment,
  onClose,
}: {
  agents: NormalizedPublicOverseasAgentUser[]
  shipment: NormalizedIncomingShipment
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
      sentByAgentId: shipment.sentByAgentId,
    },
  })

  const apiUtils = api.useUtils()
  const { mutate, isPending } =
    api.shipment.incoming.updateDetailsById.useMutation({
      onSuccess: () => {
        toast.success("Shipment updated.")
        apiUtils.shipment.incoming.getAll.invalidate()
        onClose()
        reset()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  return (
    <form
      className="px-4 py-3"
      onSubmit={handleSubmit((formData) => {
        mutate({
          id: shipment.id,
          sentByAgentId: formData.sentByAgentId,
        })
      })}
    >
      <div>
        <label className="block font-medium mb-1">Monitoring Agent</label>
        <select
          className="block w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          {...register("sentByAgentId")}
        >
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.displayName} ({agent.companyName})
            </option>
          ))}
        </select>

        <p className="text-gray-500 mt-1">
          Typically, this is the agent that sent the packages.
        </p>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
        >
          Update
        </button>
      </div>
    </form>
  )
}

export function EditDetailsModal({
  isOpen,
  onClose,
  shipment,
}: {
  isOpen: boolean
  onClose: () => void
  shipment: NormalizedIncomingShipment
}) {
  const { status, data, error } = api.user.getOverseasAgents.useQuery()

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            Edit Shipment
          </Dialog.Title>
          {status === "pending" && (
            <div className="flex justify-center items-center px-4 py-3">
              <LoadingSpinner />
              <p>Loading agents ...</p>
            </div>
          )}
          {status === "error" && <div>Error occured: {error.message}</div>}
          {status === "success" && (
            <EditForm shipment={shipment} agents={data} onClose={onClose} />
          )}
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

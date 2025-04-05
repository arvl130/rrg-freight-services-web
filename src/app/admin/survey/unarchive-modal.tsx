import type { Survey } from "@/server/db/entities"
import { api } from "@/utils/api"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import * as Dialog from "@radix-ui/react-dialog"
import toast from "react-hot-toast"

function UpdateForm({ survey, close }: { survey: Survey; close: () => void }) {
  const apiUtils = api.useUtils()
  const { mutate, isPending } = api.survey.unarchiveById.useMutation({
    onSuccess: () => {
      apiUtils.survey.getAll.invalidate()
      close()
      toast.success("Survey unarchived.")
    },
  })

  return (
    <form
      className="px-4 pt-2 pb-4"
      onSubmit={(e) => {
        e.preventDefault()
        mutate({
          id: survey.id,
        })
      }}
    >
      <div className="mb-3">
        Are you sure you want to unarchive this survey?{" "}
        <span className="font-medium">{survey.message}</span>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
          disabled={isPending}
        >
          Unarchive
        </button>
      </div>
    </form>
  )
}

export function UnarchiveModal({
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
    data: survey,
    error,
  } = api.survey.getById.useQuery({
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
            Unarchive Survey
          </Dialog.Title>
          {status === "pending" && <div>Loading ...</div>}
          {status === "error" && <div>Error occured: {error.message}</div>}
          {status === "success" && <UpdateForm survey={survey} close={close} />}
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

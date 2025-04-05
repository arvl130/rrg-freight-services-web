import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import * as Dialog from "@radix-ui/react-dialog"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  remarks: z
    .string()
    .min(1, {
      message: "Please enter your remarks.",
    })
    .max(100, {
      message: "Your remarks should not be longer than 100 characters.",
    }),
})

type FormSchema = z.infer<typeof formSchema>

function CreateForm({
  uploadedManifestId,
  onClose,
}: {
  uploadedManifestId: number
  onClose: () => void
}) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const apiUtils = api.useUtils()
  const { isPending, mutate } =
    api.uploadedManifest.updateStatusToRequestReuploadById.useMutation({
      onSuccess: () => {
        apiUtils.uploadedManifest.getAll.invalidate()
        toast.success("Re-upload requested.")
        reset()
        onClose()
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
          id: uploadedManifestId,
        }),
      )}
    >
      <div className="grid mb-3">
        <label className="font-medium mb-1">
          Please explain why you are requesting the file to be re-uploaded.
        </label>
        <input
          type="text"
          className="px-2 py-1 border border-gray-300"
          {...register("remarks")}
        />
        {errors.remarks && (
          <div className="mt-1 text-red-500">{errors.remarks.message}</div>
        )}
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

export function RequestReuploadModal({
  isOpen,
  uploadedManifestId,
  onClose,
}: {
  isOpen: boolean
  uploadedManifestId: number
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
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_33rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            Request Reupload
          </Dialog.Title>
          <CreateForm
            uploadedManifestId={uploadedManifestId}
            onClose={onClose}
          />
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

import { api } from "@/utils/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "@phosphor-icons/react/X"
import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  displayName: z.string().min(1).max(255),
})

type FormSchema = z.infer<typeof formSchema>

function CreateForm({ close }: { close: () => void }) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const apiUtils = api.useUtils()
  const { mutate, isLoading } = api.packageCategories.create.useMutation({
    onSuccess: () => {
      apiUtils.packageCategories.getAll.invalidate()
      close()
      reset()
    },
  })

  return (
    <form
      className="px-4 pt-2 pb-4"
      onSubmit={handleSubmit((formData) => mutate(formData))}
    >
      <div className="grid mb-3">
        <label className="font-medium mb-1">Display Name</label>
        <input
          type="text"
          className="px-2 py-1 border border-gray-300"
          {...register("displayName")}
        />
        {errors.displayName && <div className="mt-1 text-red-500">{}.</div>}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
          disabled={isLoading}
        >
          Create
        </button>
      </div>
    </form>
  )
}

export function CreateModal({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: () => void
}) {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" onClick={close} />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            Package Categories
          </Dialog.Title>
          <CreateForm close={close} />
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

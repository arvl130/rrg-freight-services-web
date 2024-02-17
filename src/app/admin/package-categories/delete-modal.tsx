import { PackageCategory } from "@/server/db/entities"
import { api } from "@/utils/api"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import * as Dialog from "@radix-ui/react-dialog"

function DeleteForm({
  category,
  close,
}: {
  category: PackageCategory
  close: () => void
}) {
  const apiUtils = api.useUtils()
  const { mutate, isLoading } = api.packageCategories.deleteById.useMutation({
    onSuccess: () => {
      apiUtils.packageCategories.getAll.invalidate()
      close()
    },
  })

  return (
    <form
      className="px-4 pt-2 pb-4"
      onSubmit={(e) => {
        e.preventDefault()
        mutate({
          id: category.id,
        })
      }}
    >
      <div className="mb-3">
        Are you sure you want to delete this Category?{" "}
        <span className="font-medium">{category.displayName}</span>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 hover:bg-red-400 transition-colors duration-200 disabled:bg-red-300 rounded-md text-white font-medium"
          disabled={isLoading}
        >
          Delete
        </button>
      </div>
    </form>
  )
}

export function DeleteModal({
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
    data: category,
    error,
  } = api.packageCategories.getById.useQuery({
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
            Delete Category
          </Dialog.Title>
          {status === "loading" && <div>Loading ...</div>}
          {status === "error" && <div>Error occured: {error.message}</div>}
          {status === "success" && (
            <DeleteForm category={category} close={close} />
          )}
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

import { api } from "@/utils/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import * as Dialog from "@radix-ui/react-dialog"
import { startRegistration } from "@simplewebauthn/browser"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const formSchema = z.object({
  displayName: z.string().min(1).max(255),
})

type FormSchema = z.infer<typeof formSchema>

function RegisterForm({ onClose }: { onClose: () => void }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const [isRegistering, setIsRegistering] = useState(false)

  const apiUtils = api.useUtils()
  const generateRegistrationOptionsMutation =
    api.webauthn.generateRegistrationOptions.useMutation({
      onError: ({ message }) => {
        toast.error(message)
      },
    })

  const verifyRegistrationResponseMutation =
    api.webauthn.verifyRegistrationResponse.useMutation({
      onSuccess: () => {
        apiUtils.webauthn.getCredentials.invalidate()
        onClose()
        toast.success("Authenticator registered.")
      },
      onError: ({ message }) => {
        toast.error(message)
      },
    })

  return (
    <form
      className="px-4 pt-2 pb-4"
      onSubmit={handleSubmit((formData) =>
        generateRegistrationOptionsMutation.mutate(undefined, {
          onSuccess: async (options) => {
            setIsRegistering(true)
            try {
              const response = await startRegistration(options)
              verifyRegistrationResponseMutation.mutate({
                response,
                displayName: formData.displayName,
              })
            } finally {
              setIsRegistering(false)
            }
          },
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

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
          disabled={
            isRegistering ||
            generateRegistrationOptionsMutation.isLoading ||
            verifyRegistrationResponseMutation.isLoading
          }
        >
          Register
        </button>
      </div>
    </form>
  )
}

export function RegisterModal({
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
            New Authenticator
          </Dialog.Title>
          <RegisterForm onClose={onClose} />
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

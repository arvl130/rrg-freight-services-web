import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import type {
  Gender,
  UserRole} from "@/utils/constants";
import {
  SUPPORTED_GENDERS,
  SUPPORTED_USER_ROLES,
} from "@/utils/constants"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { X } from "@phosphor-icons/react/dist/ssr/X"

const createUserFormSchema = z.object({
  displayName: z.string().min(1),
  contactNumber: z.string().min(1),
  emailAddress: z.string().min(1).max(100).email(),
  password: z.string().min(8),
  gender: z.custom<Gender>((val) => SUPPORTED_GENDERS.includes(val as Gender)),
  role: z.custom<UserRole>((val) =>
    SUPPORTED_USER_ROLES.includes(val as UserRole),
  ),
})

type CreateUserFormSchema = z.infer<typeof createUserFormSchema>

function CreateUserForm(props: { close: () => void }) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormSchema>({
    resolver: zodResolver(createUserFormSchema),
  })

  const apiUtils = api.useUtils()
  const { mutate, status, error } = api.user.create.useMutation({
    onSuccess: () => {
      apiUtils.user.getAll.invalidate()
      props.close()
      reset()
    },
  })

  return (
    <form
      className="px-4 py-3"
      onSubmit={handleSubmit((formData) => mutate(formData))}
    >
      {status === "error" && (
        <div>
          <p className="text-red-500 text-center text-sm">{error.message}</p>
        </div>
      )}
      <div className="grid grid-cols-[auto_1fr] gap-x-3">
        <div className="flex items-center justify-end">
          <label>Display name:</label>
        </div>
        <input
          type="text"
          className="block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          {...register("displayName")}
        />
        {errors.displayName && (
          <div className="mt-1 text-red-500 col-start-2">
            {errors.displayName.message}.
          </div>
        )}

        <div className="flex items-center justify-end">
          <label>Email:</label>
        </div>
        <input
          type="email"
          className="block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          {...register("emailAddress")}
        />
        {errors.emailAddress && (
          <div className="mt-1 text-red-500 col-start-2">
            {errors.emailAddress.message}.
          </div>
        )}

        <div className="flex items-center justify-end">
          <label>Password:</label>
        </div>
        <input
          type="password"
          className="block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          {...register("password")}
        />
        {errors.password && (
          <div className="mt-1 text-red-500 col-start-2">
            {errors.password.message}.
          </div>
        )}

        <div className="flex items-center justify-end">
          <label>Contact number:</label>
        </div>
        <input
          type="text"
          className="block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          {...register("contactNumber")}
        />
        {errors.contactNumber && (
          <div className="mt-1 text-red-500 col-start-2">
            {errors.contactNumber.message}.
          </div>
        )}

        <div className="flex items-center justify-end">
          <label>Gender:</label>
        </div>
        <select
          className="block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          {...register("gender")}
        >
          {SUPPORTED_GENDERS.map((gender) => (
            <option key={gender}>{gender}</option>
          ))}
        </select>
        {errors.gender && (
          <div className="mt-1 text-red-500 col-start-2">
            {errors.gender.message}.
          </div>
        )}

        <div className="flex items-center justify-end">
          <label>Role:</label>
        </div>
        <select
          className="block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          {...register("role")}
        >
          {SUPPORTED_USER_ROLES.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
        {errors.role && (
          <div className="mt-1 text-red-500 col-start-2">
            {errors.role.message}.
          </div>
        )}
      </div>
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 disabled:bg-blue-300 hover:bg-blue-400 rounded-md font-medium transition-colors duration-200 text-white"
          disabled={status === "loading"}
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
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content
          onEscapeKeyDown={close}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            New User
          </Dialog.Title>
          <CreateUserForm close={close} />
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

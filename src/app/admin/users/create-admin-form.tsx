import { useForm } from "react-hook-form"
import type { Gender } from "@/utils/constants"
import { SUPPORTED_GENDERS } from "@/utils/constants"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { generateRandomPassword } from "@/utils/uuid"
import { useEffect } from "react"

export const createAdminFormSchema = z.object({
  displayName: z.string().min(1),
  contactNumber: z.string().min(1),
  emailAddress: z.string().min(1).max(100).email(),
  password: z.string().min(8).optional(),
  gender: z.custom<Gender>((val) => SUPPORTED_GENDERS.includes(val as Gender)),
  isPasswordRandom: z.boolean(),
})

const schemaRefined = createAdminFormSchema.superRefine(
  ({ isPasswordRandom, password }, ctx) => {
    if (!isPasswordRandom && typeof password === "undefined") {
      ctx.addIssue({
        code: "custom",
        message: "Password must be supplied.",
        path: ["password"],
      })
    }
  },
)

type CreateAdminFormSchema = z.infer<typeof schemaRefined>

export function CreateAdminForm(props: {
  onSuccess: (options: { generatedPassword?: string }) => void
}) {
  const {
    watch,
    resetField,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateAdminFormSchema>({
    resolver: zodResolver(schemaRefined),
    defaultValues: {
      isPasswordRandom: true,
    },
  })

  const isPasswordRandomWatched = watch("isPasswordRandom")
  useEffect(() => {
    if (isPasswordRandomWatched) {
      resetField("password")
    }
  }, [isPasswordRandomWatched, resetField])

  const apiUtils = api.useUtils()
  const { mutate, status, error } = api.user.create.useMutation({
    onSuccess: (_, values) => {
      apiUtils.user.getAll.invalidate()
      if (isPasswordRandomWatched)
        props.onSuccess({
          generatedPassword: values.password,
        })
      else props.onSuccess({})
      reset()
      toast.success("User created successfully.")
    },
  })
  return (
    <form
      className="grid grid-cols-subgrid col-span-2 gap-y-2"
      onSubmit={handleSubmit((formData) => {
        if (formData.isPasswordRandom) {
          mutate({
            role: "ADMIN",
            ...formData,
            password: generateRandomPassword(),
          })
        } else {
          mutate({
            role: "ADMIN",
            ...formData,
            password: formData.password!,
          })
        }
      })}
    >
      {status === "error" && (
        <div className="col-span-2">
          <p className="text-red-500 text-center text-sm">{error.message}</p>
        </div>
      )}
      <div className="flex items-center justify-end">
        <label>Display name:</label>
      </div>
      <input
        type="text"
        className="block w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
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
        className="block w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
        {...register("emailAddress")}
      />
      {errors.emailAddress && (
        <div className="mt-1 text-red-500 col-start-2">
          {errors.emailAddress.message}.
        </div>
      )}

      <div></div>
      <div>
        <label>
          <input type="checkbox" {...register("isPasswordRandom")} />
          <span className="ml-2">Use random password</span>
        </label>
      </div>

      {!isPasswordRandomWatched && (
        <>
          <div className="flex items-center justify-end">
            <label>Password:</label>
          </div>
          <input
            type="password"
            className="block w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            {...register("password")}
          />
          {errors.password && (
            <div className="mt-1 text-red-500 col-start-2">
              {errors.password.message}.
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-end">
        <label>Contact number:</label>
      </div>
      <input
        type="text"
        className="block w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
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
        className="block w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
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
      <div className="col-span-2 flex justify-end mt-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 disabled:bg-blue-300 hover:bg-blue-400 rounded-md font-medium transition-colors duration-200 text-white"
          disabled={status === "pending"}
        >
          Create
        </button>
      </div>
    </form>
  )
}

import { User, getAuth, signOut } from "firebase/auth"
import { api } from "@/utils/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Gender,
  Role,
  supportedGenders,
  supportedRoles,
} from "@/utils/constants"

const createUserProfileFormSchema = z.object({
  displayName: z.string().min(1),
  contactNumber: z.string().min(1),
  emailAddress: z.string().min(1).max(100).email(),
  gender: z.custom<Gender>((val) => supportedGenders.includes(val as Gender)),
  role: z.custom<Role>((val) => supportedRoles.includes(val as Role)),
})

type CreateUserProfileFormType = z.infer<typeof createUserProfileFormSchema>

export function CreateUserProfileForm({
  user,
  role,
}: {
  user: User
  role: "CUSTOMER"
}) {
  const apiUtils = api.useUtils()
  const { isLoading, mutate } = api.user.createDetails.useMutation({
    onSuccess: () => {
      apiUtils.user.getById.invalidate({
        id: user.uid,
      })
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserProfileFormType>({
    resolver: zodResolver(createUserProfileFormSchema),
    defaultValues: {
      displayName: user.displayName!,
      emailAddress: user.email!,
      role,
    },
  })

  return (
    <div className="max-w-md mx-auto bg-white px-8 py-6 rounded-lg drop-shadow-md">
      <p className="mb-3">
        Please enter the following details to complete your registration.
      </p>
      {JSON.stringify(errors)}
      <form onSubmit={handleSubmit((formData) => mutate(formData))}>
        <div className="mb-3">
          <label className="block mb-1">Contact Number</label>
          <input
            type="text"
            className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            {...register("contactNumber")}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Gender</label>
          <select
            className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            {...register("gender")}
          >
            {supportedGenders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 text-white	w-full bg-blue-500 transition-colors disabled:bg-blue-300 hover:bg-blue-400 rounded-lg font-medium"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  )
}

import { User } from "firebase/auth"
import { api } from "@/utils/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Gender,
  REGEX_ONE_OR_MORE_DIGITS,
  supportedGenders,
} from "@/utils/constants"
import { countryCodeToName, supportedCountryCodes } from "@/utils/country-code"

const createUserProfileFormSchema = z.object({
  contactNumber: z.string().min(1),
  gender: z.custom<Gender>((val) => supportedGenders.includes(val as Gender)),
  streetAddress: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  stateOrProvince: z.string().min(1).max(100),
  countryCode: z.string().min(1).max(3),
  postalCode: z.string().min(1).regex(REGEX_ONE_OR_MORE_DIGITS),
})

type CreateUserProfileFormType = z.infer<typeof createUserProfileFormSchema>

export function CreateUserProfileForm({ user }: { user: User }) {
  const apiUtils = api.useUtils()
  const { isLoading, mutate } = api.user.createDetailsWithAddress.useMutation({
    onSuccess: () => {
      apiUtils.user.getWithAddressById.invalidate({
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
  })

  return (
    <div className="max-w-md mx-auto bg-white px-8 py-6 rounded-lg drop-shadow-md">
      <p className="mb-3">
        Please enter the following details to complete your registration.
      </p>
      <form
        onSubmit={handleSubmit((formData) =>
          mutate({
            ...formData,
            displayName: user.displayName!,
            emailAddress: user.email!,
            postalCode: Number(formData.postalCode),
          }),
        )}
      >
        <div className="mb-3">
          <label className="block mb-1">Street Address</label>
          <input
            type="text"
            className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            {...register("streetAddress")}
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">City</label>
          <input
            type="text"
            className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            {...register("city")}
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">State / Province</label>
          <input
            type="text"
            className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            {...register("stateOrProvince")}
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Country</label>
          <select
            {...register("countryCode")}
            className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            defaultValue={"ARE"}
          >
            {supportedCountryCodes.map((countryCode) => (
              <option key={countryCode} value={countryCode}>
                {countryCodeToName(countryCode)} ({countryCode})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1">Postal Code</label>
          <input
            type="number"
            className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            {...register("postalCode")}
          />
        </div>
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

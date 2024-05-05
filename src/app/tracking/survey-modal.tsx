import { Star } from "@phosphor-icons/react/dist/ssr/Star"
import { useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  serviceRate: z.number().gt(0),
  message: z.string().min(1).max(100),
})

type FormSchema = z.infer<typeof formSchema>

export function SurveyModal({
  packageId,
  onClose,
}: {
  packageId: string
  onClose: () => void
}) {
  const [rating, setRating] = useState(0)

  const handleRatingChange = (value: number) => {
    setRating(value)
    setValue("serviceRate", value)
  }
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const apiUtils = api.useUtils()
  const { mutate, isLoading } = api.survey.create.useMutation({
    onSuccess: () => {
      toast.success("Answer submitted!")
      apiUtils.survey.getAll.invalidate()
      onClose()
      reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <form
      className="px-4 pt-2 pb-4"
      onSubmit={handleSubmit((formData) => {
        mutate({
          packageId,
          ...formData,
        })
      })}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center rounded-lg overflow-x-hidden overflow-y-auto">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative w-full max-w-lg mx-auto my-6">
          <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-center bg-[#78CFDC] p-5 border-b border-solid border-blueGray-200 rounded-t">
              <div className="flex justify-center mb-2">
                <Image
                  src="/assets/img/logos/new-logo-nav-bar.png"
                  alt="RRG Freight Services logo with its name on the right"
                  className="w-[180px] h-[60px] object-contain"
                  width={168}
                  height={60}
                />
              </div>
              <h2 className="font-bold mt-4 ml-10 text-lg text-white text-center">
                Customer Survey{" "}
              </h2>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onClose}
              >
                <span className="text-white h-10 w-10  text-3xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>

            <div className="relative p-6 flex-auto">
              <div className="mb-2">
                <label className="block text-lg font-semibold mb-2">
                  How would you rate our services?
                </label>
                <div className="flex items-center justify-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`mr-2 p-2 text-3xl focus:outline-none ${
                        value <= rating ? "text-[#78CFDC]" : "text-gray-300"
                      }`}
                      onClick={() => handleRatingChange(value)}
                    >
                      <Star size={32} weight="fill" />
                    </button>
                  ))}
                  {errors.serviceRate && (
                    <div className="mt-1 text-red-500">
                      {errors.serviceRate.message}.
                    </div>
                  )}
                </div>
              </div>
              <label className="block text-lg font-semibold mb-2 text-justify">
                Leave us a comment or suggestion to help us improve.
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                {...register("message")}
              ></textarea>
              {errors.message && (
                <div className="mt-1 text-red-500">
                  {errors.message.message}.
                </div>
              )}
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="bg-slate-500 text-white active:bg-green-600 font-bold uppercase text-sm px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-4 ease-linear transition-all duration-150"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

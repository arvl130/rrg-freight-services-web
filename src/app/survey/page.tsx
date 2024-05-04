"use client"

import { Star } from "@phosphor-icons/react/dist/ssr/Star"
import { useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "@/utils/api"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr/CaretLeft"

const formSchema = z.object({
  serviceRate: z.number().gt(0),
  message: z.string().min(1).max(100),
})

type FormSchema = z.infer<typeof formSchema>

export default function CustomerSurvey() {
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
      toast.success("Survey updated.")
      apiUtils.survey.getAll.invalidate()
      reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  return (
    <>
      <title>Customer Survey &#x2013; RRG Freight Services</title>
      <main className="bg-gradient-to-b from-[#79CFDC] to-white">
        <form
          className="px-4 pt-2 pb-4"
          onSubmit={handleSubmit((formData) => {
            console.log("hello")
            mutate({
              ...formData,
            })
          })}
        >
          <div className="flex flex-col justify-center  text-white font-semibold">
            <p className="text-4xl w-full text-center mt-5 font-bold">
              Customer Survey
            </p>
          </div>
          <div className=" mx-20 my-8 flex flex-col content-center">
            <div className="relative w-full max-w-[600px] mx-auto ">
              <div className="relative flex flex-col w-full  bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
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
                </div>

                <div className="relative p-6 flex-auto">
                  <div className="mb-2">
                    <label className="block text-lg font-semibold mb-2">
                      How would you rate the RRG Freight Services
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
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
                  <label className="block text-lg font-semibold mb-2">
                    Leave us a comment or suggestion to help improve our
                    service.
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
        <div className="flex flex-col justify-center items-center">
          <Link
            href="/"
            className="font-bold text-blue-400 inline-flex items-center text-sm"
            passHref
          >
            <CaretLeft height={12} /> Back to Homepage
          </Link>
        </div>
      </main>
    </>
  )
}

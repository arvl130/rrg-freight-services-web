import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "@/utils/api"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import * as Dialog from "@radix-ui/react-dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import type { City, Province } from "@/server/db/entities"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const formSchema = z.object({
  cityId: z.string(),
  provinceId: z.string(),
})

type FormSchema = z.infer<typeof formSchema>

function AddForm({
  provinces,
  onClose,
  onAddAreaCode,
}: {
  provinces: Province[]
  onClose: () => void
  onAddAreaCode: (newAreaCode: string) => void
}) {
  const {
    watch,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cityId: "",
    },
  })

  const selectedCityIdWatched = watch("cityId")
  const selectedProvinceIdWatched = watch("provinceId")
  const [selectedProvinceId, setSelectedProvinceId] = useState("")

  const {
    status,
    data: citiesData,
    error,
  } = api.city.getByProvinceId.useQuery({
    provinceId: selectedProvinceId,
  })

  useEffect(() => {
    reset()
  }, [selectedProvinceId, reset])

  return (
    <form
      className="px-4 pt-2 pb-4"
      onSubmit={(e) => {
        e.stopPropagation()

        handleSubmit((formData) => {
          if (
            selectedCityIdWatched !== "" &&
            selectedProvinceIdWatched !== ""
          ) {
            onAddAreaCode(formData.cityId)
            onClose()
          } else {
            toast.error("All inputs are required")
          }
        })(e)
      }}
    >
      <div className="grid mb-3">
        <label className="font-medium mb-1">Province</label>
        <select
          {...register("provinceId")}
          onChange={(e) => {
            setSelectedProvinceId(e.currentTarget.value)
          }}
          value={selectedProvinceId}
          className="bg-white px-2 py-2 border border-gray-300"
        >
          <option value="">Choose a province ...</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.provinceId}>
              {province.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid mb-3">
        <label className="font-medium mb-1">City</label>
        <select
          className="bg-white px-2 py-2 border border-gray-300"
          {...register("cityId")}
        >
          <option value="">Choose a city ...</option>
          {citiesData?.map((city) => (
            <option key={city.cityId} value={city.cityId}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
        >
          Add
        </button>
      </div>
    </form>
  )
}

export function AddAssignedAreaModal({
  isOpen,
  onClose,
  onAddAreaCode,
}: {
  isOpen: boolean
  onClose: () => void
  onAddAreaCode: (newAreaCode: string) => void
}) {
  // const { status, data, error } = api.city.getAll.useQuery()
  const { status, data, error } = api.province.getAll.useQuery()
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="bg-black/40 fixed inset-0"
          onClick={onClose}
        />
        <Dialog.Content
          onEscapeKeyDown={onClose}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_40rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
        >
          <Dialog.Title className="text-white font-bold text-center items-center py-2 [background-color:_#78CFDC] h-full rounded-t-2xl">
            Add Assigned Area
          </Dialog.Title>
          {status === "loading" && <p>...</p>}
          {status === "error" && <p>Error occured: {error.message}</p>}
          {status === "success" && (
            <AddForm
              provinces={data}
              onAddAreaCode={onAddAreaCode}
              onClose={onClose}
            />
          )}
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

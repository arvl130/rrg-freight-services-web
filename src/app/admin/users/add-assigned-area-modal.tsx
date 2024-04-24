import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "@/utils/api"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import * as Dialog from "@radix-ui/react-dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Province } from "@/server/db/entities"

const formSchema = z.object({
  provinceId: z.string().min(1),
  cityId: z.string(),
  barangayId: z.string(),
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
      provinceId: "",
      cityId: "",
      barangayId: "",
    },
  })

  const selectedProvinceIdWatched = watch("provinceId")
  const selectedCityIdWatched = watch("cityId")
  const selectedBarangayIdWatched = watch("barangayId")

  const citiesQuery = api.city.getByProvinceId.useQuery(
    {
      provinceId: selectedProvinceIdWatched,
    },
    {
      enabled: selectedProvinceIdWatched !== "",
    },
  )

  const barangaysQuery = api.barangay.getByProvinceIdAndCityId.useQuery(
    {
      provinceId: selectedProvinceIdWatched,
      cityId: selectedCityIdWatched,
    },
    {
      enabled: selectedProvinceIdWatched !== "" && selectedCityIdWatched !== "",
    },
  )

  return (
    <form
      className="px-4 pt-2 pb-4"
      onSubmit={(e) => {
        e.stopPropagation()

        handleSubmit((formData) => {
          if (selectedBarangayIdWatched !== "") {
            onAddAreaCode(formData.barangayId)
          } else if (selectedCityIdWatched !== "") {
            onAddAreaCode(formData.cityId)
          } else if (selectedProvinceIdWatched !== "") {
            onAddAreaCode(formData.provinceId)
          }
          onClose()
        })(e)
      }}
    >
      <div className="grid mb-3">
        <label className="font-medium mb-1">Province</label>
        <select
          className="bg-white px-2 py-2 border border-gray-300"
          {...register("provinceId")}
        >
          <option value="">Choose a province ...</option>
          {provinces.map((province) => (
            <option key={province.provinceId} value={province.provinceId}>
              {province.name}
            </option>
          ))}
        </select>
      </div>
      {selectedProvinceIdWatched !== "" && (
        <>
          {citiesQuery.status === "loading" && <div>...</div>}
          {citiesQuery.status === "error" && (
            <div>Error occured: {citiesQuery.error.message}</div>
          )}
          {citiesQuery.status === "success" && (
            <div className="grid mb-3">
              <label className="font-medium mb-1">City/Municipality</label>
              <select
                className="bg-white px-2 py-2 border border-gray-300"
                {...register("cityId")}
              >
                <option value="">All Cities / Municipalities</option>
                {citiesQuery.data.map((city) => (
                  <option key={city.cityId} value={city.cityId}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      {selectedCityIdWatched !== "" && (
        <>
          {barangaysQuery.status === "loading" && <div>...</div>}
          {barangaysQuery.status === "error" && (
            <div>Error occured: {barangaysQuery.error.message}</div>
          )}
          {barangaysQuery.status === "success" && (
            <div className="grid mb-3">
              <label className="font-medium mb-1">Barangay</label>
              <select
                className="bg-white px-2 py-2 border border-gray-300"
                {...register("barangayId")}
              >
                <option value="">All Barangays</option>
                {barangaysQuery.data.map((barangay) => (
                  <option key={barangay.code} value={barangay.code}>
                    {barangay.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition-colors duration-200 disabled:bg-blue-300 rounded-md text-white font-medium"
        >
          Create
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
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100%_-_3rem),_32rem)] grid grid-rows-[auto_1fr] rounded-2xl bg-white"
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

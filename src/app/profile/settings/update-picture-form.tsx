import type { User } from "@/server/db/entities"
import { useSession } from "@/utils/auth"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { UserCircle } from "@phosphor-icons/react/UserCircle"
import { useState } from "react"
import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/app/api"

const updatePictureFormSchema = z.object({
  imageFiles: z.custom<FileList>(
    (val) => {
      return (val as FileList).length === 1
    },
    {
      message: "Please select a file.",
    },
  ),
})

type UpdatePictureFormType = z.infer<typeof updatePictureFormSchema>

export function UpdatePictureForm({ user }: { user: User }) {
  const { reload, role } = useSession()
  const {
    reset,
    register,
    formState: { isValid },
    handleSubmit,
  } = useForm<UpdatePictureFormType>({
    resolver: zodResolver(updatePictureFormSchema),
  })

  const [isUploading, setIsUploading] = useState(false)

  const utils = api.useUtils()
  const { isLoading: isLoadingUpdatePhotoUrl, mutate: updatePhotoUrl } =
    api.user.updatePhotoUrl.useMutation({
      onSuccess: async () => {
        reset()
        utils.user.getById.invalidate({
          id: user.id,
        })
        reload()
      },
    })

  const { isLoading: isLoadingRemovePhotoUrl, mutate: removePhotoUrl } =
    api.user.removePhotoUrl.useMutation({
      onSuccess: async () => {
        reset()
        utils.user.getById.invalidate({
          id: user.id,
        })
        reload()
      },
    })

  const isLoading =
    isLoadingUpdatePhotoUrl || isLoadingRemovePhotoUrl || isUploading

  return (
    <form
      className="grid grid-cols-[1fr_auto] justify-between mb-4 px-4 py-4 bg-white rounded-lg"
      onSubmit={handleSubmit(async (formData) => {
        const [imageFile] = formData.imageFiles

        setIsUploading(true)
        try {
          const storage = getStorage()
          const imageRef = ref(storage, `profile-photos/${user.id}`)

          await uploadBytes(imageRef, imageFile, {
            contentType: imageFile.type,
          })
          const downloadUrl = await getDownloadURL(imageRef)

          updatePhotoUrl({
            photoUrl: downloadUrl,
          })
        } finally {
          setIsUploading(false)
        }
      })}
    >
      <div>
        <div className="flex gap-3 items-center">
          <div className="aspect-square h-20">
            {typeof user.photoUrl === "string" ? (
              <Image
                height={80}
                width={80}
                alt="Profile picture"
                src={user.photoUrl}
                className="rounded-full h-full"
              />
            ) : (
              <UserCircle size={80} />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{user.displayName}</h2>
            <p className="text-sm	text-gray-400">{role}</p>
          </div>
        </div>
        <div className="text-sm pl-2 mt-3">
          <input
            type="file"
            accept="image/jpg,image/jpeg,image/png"
            {...register("imageFiles")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        {typeof user.photoUrl === "string" && (
          <button
            onClick={() => removePhotoUrl()}
            disabled={isLoading}
            className="py-2 px-3 rounded-lg font-medium text-sm text-red-500 border border-red-500 disabled:text-red-300 disabled:border-red-300"
          >
            DELETE
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !isValid}
          className="py-2 px-3 rounded-lg font-medium text-sm text-green-500 border border-green-500 disabled:text-green-300 disabled:border-green-300"
        >
          UPDATE
        </button>
      </div>
    </form>
  )
}

import { User } from "@/server/db/entities"
import { useSession } from "@/hooks/session"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr/CaretLeft"
import { X } from "@phosphor-icons/react/dist/ssr/X"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import Image from "next/image"
import { useState } from "react"

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

export function UpdatePhotoScreen({
  user,
  goBack,
  close,
}: {
  user: User
  goBack: () => void
  close: () => void
}) {
  const { user: firebaseUser, reload } = useSession()
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
      onSuccess: () => {
        reset()
        utils.user.getAll.invalidate()
        if (firebaseUser!.uid === user.id) reload()
      },
    })

  const { isLoading: isLoadingRemovePhotoUrl, mutate: removePhotoUrl } =
    api.user.removePhotoUrl.useMutation({
      onSuccess: () => {
        reset()
        utils.user.getAll.invalidate()
        if (firebaseUser!.uid === user.id) reload()
      },
    })

  const isLoading =
    isLoadingUpdatePhotoUrl || isLoadingRemovePhotoUrl || isUploading

  return (
    <form
      className="grid grid-rows-[1fr_auto]"
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
      <div className="mb-2 flex justify-between">
        <button type="button" onClick={goBack}>
          <CaretLeft size={20} />
        </button>
        <X size={20} onClick={close} />
      </div>
      <div className="font-semibold text-lg mb-3">Profile Picture</div>
      <div className="mb-6 flex flex-col items-center">
        <div className="aspect-square h-40">
          {user.photoUrl === null ? (
            <UserCircle size={160} />
          ) : (
            <Image
              height={160}
              width={160}
              alt="Profile picture"
              src={user.photoUrl}
              className="rounded-full"
            />
          )}
        </div>
        <input
          type="file"
          accept="image/jpg,image/jpeg,image/png"
          {...register("imageFiles")}
        />
      </div>
      <div>
        {typeof user.photoUrl === "string" && (
          <button
            onClick={() => removePhotoUrl()}
            disabled={isLoading}
            className="p-2 mb-3 text-white	w-full bg-red-500 transition-colors disabled:bg-red-300 hover:bg-red-400 rounded-lg font-medium"
          >
            {isLoadingRemovePhotoUrl || isUploading ? "Deleting ..." : "Delete"}
          </button>
        )}

        <button
          type="submit"
          className="p-2 text-white	w-full bg-cyan-500 transition-colors disabled:bg-cyan-300 hover:bg-cyan-400 rounded-lg font-medium"
          disabled={isLoading || !isValid}
        >
          {isLoadingUpdatePhotoUrl || isUploading ? "Saving ..." : "Save"}
        </button>
      </div>
    </form>
  )
}

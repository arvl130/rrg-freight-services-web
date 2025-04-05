import "@/utils/firebase"
import type { User } from "@/server/db/entities"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react"
import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { removePhotoUrlAction, updatePhotoUrlAction } from "./actions"
import { getHumanizedOfUserRole } from "@/utils/humanize"

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
  const [isPending, startTransition] = useTransition()
  const [removeActionState, removeFormAction] = useActionState(
    removePhotoUrlAction,
    {
      success: false,
      message: "",
    },
  )

  const [updateActionState, updateFormAction] = useActionState(
    updatePhotoUrlAction,
    {
      success: false,
      message: "",
    },
  )

  const {
    reset,
    register,
    formState: { isValid, isSubmitSuccessful },
    handleSubmit,
  } = useForm<UpdatePictureFormType>({
    resolver: zodResolver(updatePictureFormSchema),
  })

  const formRef = useRef<HTMLFormElement>(null)
  const utils = api.useUtils()

  useEffect(() => {
    if (removeActionState.success || updateActionState.success) {
      utils.user.getById.invalidate({
        id: user.id,
      })

      if (updateActionState.success && isSubmitSuccessful) {
        reset()
      }
    }
  }, [
    removeActionState.success,
    updateActionState.success,
    utils.user.getById,
    user.id,
    isSubmitSuccessful,
    reset,
  ])

  const [isUploading, setIsUploading] = useState(false)

  return (
    <form
      ref={formRef}
      className="grid sm:grid-cols-[1fr_auto] gap-y-3 justify-between mb-4 px-4 py-4 bg-white rounded-lg"
      onSubmit={(e) => {
        e.preventDefault()

        handleSubmit(async (formData) => {
          if (formRef.current) {
            const [imageFile] = formData.imageFiles

            setIsUploading(true)
            try {
              const storage = getStorage()
              const imageRef = ref(storage, `profile-photos/${user.id}`)

              await uploadBytes(imageRef, imageFile, {
                contentType: imageFile.type,
              })

              const downloadUrl = await getDownloadURL(imageRef)
              const newFormData = new FormData()
              newFormData.set("photoUrl", downloadUrl)

              startTransition(() => {
                updateFormAction(newFormData)
              })
            } finally {
              setIsUploading(false)
            }
          }
        })(e)
      }}
    >
      <div>
        <div className="sm:flex gap-3 items-center">
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
            <p className="text-sm	text-gray-500">
              {getHumanizedOfUserRole(user.role)}
            </p>
          </div>
        </div>
        <div className="text-sm pl-2 mt-3">
          <input
            type="file"
            accept="image/jpg,image/jpeg,image/png"
            className="w-full"
            {...register("imageFiles")}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center">
        {typeof user.photoUrl === "string" && (
          <button
            type="button"
            disabled={isUploading || isPending}
            className="py-2 px-3 rounded-lg font-medium text-sm text-red-500 border border-red-500 disabled:text-red-300 disabled:border-red-300 uppercase"
            onClick={() => {
              startTransition(() => {
                removeFormAction()
              })
            }}
          >
            Delete
          </button>
        )}
        <button
          type="submit"
          disabled={isUploading || isPending || !isValid}
          className="py-2 px-3 rounded-lg font-medium text-sm text-green-500 border border-green-500 disabled:text-green-300 disabled:border-green-300 uppercase"
        >
          Update
        </button>
      </div>
    </form>
  )
}

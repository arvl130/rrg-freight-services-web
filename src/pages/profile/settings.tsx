import { UserCircleGear } from "@phosphor-icons/react/UserCircleGear"
import { GenericLayout } from "@/layouts/generic"
import { User as FirebaseUser } from "firebase/auth"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { User } from "@/server/db/entities"
import { useSession } from "@/utils/auth"
import { ProfileSideNav } from "@/components/profile/sidenav"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { useState } from "react"
import Image from "next/image"

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

function UpdatePictureForm({ user }: { user: User }) {
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
                className="rounded-full"
              />
            ) : (
              <UserCircleGear size={80} />
            )}
          </div>
          <div>
            <h2 className="font-semibold">{user.displayName}</h2>
            <p className="text-sm	text-gray-400">{role}</p>
          </div>
        </div>
        <div className="text-sm pl-2 mt-3">
          <input type="file" {...register("imageFiles")} />
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

const updateInformationFormSchema = z.object({
  displayName: z.string().min(1),
  emailAddress: z.string().min(1).email(),
  contactNumber: z.string().min(1).max(15),
  gender: z.union([
    z.literal("MALE"),
    z.literal("FEMALE"),
    z.literal("OTHER"),
    z.literal("UNKNOWN"),
  ]),
})

type UpdateInformationFormType = z.infer<typeof updateInformationFormSchema>

function UpdateInformationForm({ user }: { user: User }) {
  const { reload } = useSession()
  const {
    reset,
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<UpdateInformationFormType>({
    resolver: zodResolver(updateInformationFormSchema),
    defaultValues: {
      displayName: user.displayName,
      contactNumber: user.contactNumber,
      emailAddress: user.emailAddress,
      gender: user.gender === null ? "UNKNOWN" : user.gender,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  })

  const utils = api.useUtils()
  const { isLoading, mutate } = api.user.updateDetails.useMutation({
    onSuccess: async () => {
      reset()
      utils.user.getById.invalidate({
        id: user.id,
      })
      reload()
    },
  })

  return (
    <div className="rounded-lg bg-white px-6 pt-4 pb-6">
      <div className="">
        <h1 className="font-semibold pb-2">Personal Information</h1>
        <form
          onSubmit={handleSubmit((formData) => {
            mutate({
              displayName: formData.displayName,
              contactNumber: formData.contactNumber,
              emailAddress: formData.emailAddress,
              gender: formData.gender === "UNKNOWN" ? null : formData.gender,
            })
          })}
        >
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1">Full Name</label>
            <input
              className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              {...register("displayName")}
              disabled={isLoading}
            />
            {errors.displayName && (
              <div className="text-sm text-red-500 mt-1">
                {errors.displayName.message}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1 ">
              Email Address
            </label>
            <input
              className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              {...register("emailAddress")}
              disabled={isLoading}
            />
            {errors.emailAddress && (
              <div className="text-sm text-red-500 mt-1">
                {errors.emailAddress.message}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1 ">
              Mobile Number
            </label>
            <input
              className="rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              {...register("contactNumber")}
              disabled={isLoading}
            />
            {errors.contactNumber && (
              <div className="text-sm text-red-500 mt-1">
                {errors.contactNumber.message}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="block text-sm	text-gray-500 mb-1">Gender</label>
            <select
              className="block rounded-lg text-sm w-full px-4 py-2 text-gray-700 disabled:bg-gray-50 bg-white border border-cyan-500 focus:border-cyan-400 focus:ring-cyan-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              {...register("gender")}
              disabled={isLoading}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="UNKNOWN">Rather not say</option>
            </select>
          </div>
          <button
            className="p-2 text-white	w-full bg-cyan-500 transition-colors disabled:bg-cyan-300 hover:bg-cyan-400 rounded-lg font-medium"
            disabled={isLoading || !isDirty || !isValid}
          >
            {isLoading ? "Saving ..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  )
}

function RightColumn({ firebaseUser }: { firebaseUser: FirebaseUser }) {
  const {
    isLoading,
    isError,
    data: user,
  } = api.user.getById.useQuery({
    id: firebaseUser.uid,
  })

  if (isLoading || isError) {
    return <article></article>
  }

  return (
    <article>
      <UpdatePictureForm user={user} />
      <UpdateInformationForm user={user} />
    </article>
  )
}

export default function ProfileSettingsPage() {
  return (
    <GenericLayout title="Dashboard" hasSession>
      {({ user }) => (
        <main className="pt-2 pb-6">
          <section className="grid grid-cols-[22rem_1fr] gap-6 max-w-4xl mx-auto">
            <ProfileSideNav />
            <RightColumn firebaseUser={user} />
          </section>
        </main>
      )}
    </GenericLayout>
  )
}

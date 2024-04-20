import { api } from "@/utils/api"
import { startAuthentication } from "@simplewebauthn/browser"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { useState } from "react"
import { formSchema } from "./form-schema"
import { signInWithWebauthnResponseAction } from "./actions"
import toast from "react-hot-toast"
import { type SavedUser } from "@/components/saved-users"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle"
import { Trash } from "@phosphor-icons/react/dist/ssr/Trash"
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight"
import { Fingerprint } from "@phosphor-icons/react/dist/ssr/Fingerprint"
import { FingerprintSimple } from "@phosphor-icons/react/dist/ssr/FingerprintSimple"
import { LoadingSpinner } from "@/components/spinner"

type FormType = z.infer<typeof formSchema>

function NoUsers(props: {
  onAddUser: (newUser: SavedUser) => void
  onSignInSuccess: () => void
}) {
  const router = useRouter()

  const generateAuthenticationOptionsMutation =
    api.webauthn.generateAuthenticationOptions.useMutation({
      onSuccess: async (options) => {
        setIsSigningIn(true)
        try {
          const response = await startAuthentication(options)
          const { data } = await signInWithWebauthnResponseAction(response)
          if (data) {
            props.onSignInSuccess()
            router.replace(data.redirectPath)
            props.onAddUser({
              id: data.user.id,
              email: data.user.email,
              displayName: data.user.displayName,
              photoUrl: data.user.photoUrl,
            })
          }
        } catch {
          toast.error("Sign in error occured.")
        } finally {
          setIsSigningIn(false)
        }
      },
      onError: async (error) => {
        if (error.data?.code === "NOT_FOUND") {
          toast.error(
            "This user may be invalid or fingerprint sign in has not been configured.",
          )
        } else {
          toast.error(error.message)
        }
      },
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  })

  const [isSigningIn, setIsSigningIn] = useState(false)
  const isBtnDisabled =
    generateAuthenticationOptionsMutation.isLoading || isSigningIn

  return (
    <form
      onSubmit={handleSubmit(async (formData) => {
        generateAuthenticationOptionsMutation.mutate({
          email: formData.email,
        })
      })}
    >
      <div>
        <label className="font-medium block mb-1">Email</label>
        <input
          type="text"
          className="text-sm w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>
        )}
      </div>

      {isBtnDisabled ? (
        <div className="flex flex-col items-center mt-4">
          <p className="text-center text-lg font-semibold">
            Please scan your fingerprint now
          </p>
          <Fingerprint size={72} className="text-brand-cyan-500" />
        </div>
      ) : (
        <button
          type="submit"
          className="grid grid-cols-[3rem_1fr_3rem] font-medium w-full mt-4 px-6 py-2.5 leading-5 text-white transition-colors duration-200 transform bg-brand-cyan-500 rounded-md hover:bg-brand-cyan-600 focus:outline-none focus:bg-brand-cyan-600 disabled:bg-brand-cyan-350"
        >
          <div className="flex justify-center items-center">
            <FingerprintSimple size={36} />
          </div>
          <div>
            <p>Click here &</p>
            <p className="font-bold">Scan your Fingerprint</p>
          </div>
          <div></div>
        </button>
      )}
    </form>
  )
}

function LoginWithSelection(props: {
  savedUsers: SavedUser[]
  onAddUser: (newUser: SavedUser) => void
  onRemoveUser: (email: string) => void
  onSignInSuccess: () => void
}) {
  const [selectedUserId, setSelectedUserId] = useState(
    props.savedUsers.length === 1 ? props.savedUsers[0].id : null,
  )
  const router = useRouter()

  const generateAuthenticationOptionsMutation =
    api.webauthn.generateAuthenticationOptions.useMutation({
      onSuccess: async (options) => {
        setIsSigningIn(true)
        try {
          const response = await startAuthentication(options)
          const { data } = await signInWithWebauthnResponseAction(response)

          if (data) {
            props.onSignInSuccess()
            router.replace(data.redirectPath)
            props.onAddUser({
              id: data.user.id,
              email: data.user.email,
              displayName: data.user.displayName,
              photoUrl: data.user.photoUrl,
            })
          }
        } catch {
          toast.error("Sign in error occured.")
        } finally {
          setIsSigningIn(false)
        }
      },
    })

  const [isSigningIn, setIsSigningIn] = useState(false)
  const isBtnDisabled =
    generateAuthenticationOptionsMutation.isLoading || isSigningIn

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const selectedUser = props.savedUsers.find(
          ({ id }) => id === selectedUserId,
        )

        if (selectedUser)
          generateAuthenticationOptionsMutation.mutate({
            email: selectedUser.email,
          })
      }}
    >
      <div className="space-y-3">
        {props.savedUsers.map((savedUser) => (
          <div
            key={savedUser.id}
            className={`grid ${
              savedUser.id === selectedUserId
                ? "grid-cols-[3rem_1fr_3rem]"
                : "grid-cols-[3rem_1fr]"
            } gap-1`}
          >
            <button
              type="button"
              className={`grid grid-cols-subgrid col-span-2 border border-gray-300 ${
                savedUser.id === selectedUserId ? "bg-gray-100" : ""
              } transition-colors rounded-md`}
              onClick={() => {
                setSelectedUserId(savedUser.id)
              }}
            >
              <div className="flex justify-center items-center pl-1 py-1">
                {savedUser.photoUrl ? (
                  <Image
                    alt={`Photo of ${savedUser.displayName}`}
                    src={savedUser.photoUrl}
                    height={48}
                    width={48}
                    className="aspect-square rounded-full"
                  />
                ) : (
                  <UserCircle size={48} />
                )}
              </div>
              <div className="overflow-hidden p-1">
                <p className="font-semibold">{savedUser.displayName}</p>
                <p className="text-sm text-gray-500 overflow-hidden text-ellipsis">
                  {savedUser.email}
                </p>
              </div>
            </button>
            {savedUser.id === selectedUserId && (
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  className="border border-red-500 hover:bg-red-100 transition-colors p-1 rounded-md"
                  onClick={() => {
                    props.onRemoveUser(savedUser.id)
                  }}
                >
                  <Trash size={24} className="text-red-500" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedUserId === null ? (
        <p className="mt-4 text-center font-semibold">
          Please choose a user to sign in.
        </p>
      ) : (
        <>
          {isBtnDisabled ? (
            <div className="flex flex-col items-center mt-4">
              <p className="text-center text-lg font-semibold">
                Please scan your fingerprint now
              </p>
              <Fingerprint size={72} className="text-brand-cyan-500" />
            </div>
          ) : (
            <button
              type="submit"
              className="grid grid-cols-[3rem_1fr_3rem] font-medium w-full mt-4 px-6 py-2.5 leading-5 text-white transition-colors duration-200 transform bg-brand-cyan-500 rounded-md hover:bg-brand-cyan-600 focus:outline-none focus:bg-brand-cyan-600 disabled:bg-brand-cyan-350"
            >
              <div className="flex justify-center items-center">
                <FingerprintSimple size={36} />
              </div>
              <div>
                <p>Click here &</p>
                <p className="font-bold">Scan your Fingerprint</p>
              </div>
              <div></div>
            </button>
          )}
        </>
      )}
    </form>
  )
}

function HasUsers(props: {
  savedUsers: SavedUser[]
  onAddUser: (newUser: SavedUser) => void
  onRemoveUser: (email: string) => void
  onSignInSuccess: () => void
}) {
  const [chooseUserFrom, setChooseUserFrom] = useState<"SELECTION" | "PROMPT">(
    "SELECTION",
  )

  if (chooseUserFrom === "SELECTION")
    return (
      <>
        <LoginWithSelection
          savedUsers={props.savedUsers}
          onAddUser={props.onAddUser}
          onRemoveUser={props.onRemoveUser}
          onSignInSuccess={props.onSignInSuccess}
        />
        <div className="mt-3">
          <button
            type="button"
            className="text-sm font-medium inline-flex items-center"
            onClick={() => {
              setChooseUserFrom("PROMPT")
            }}
          >
            Login with a new user <CaretRight height={12} />
          </button>
        </div>
      </>
    )

  return (
    <>
      <NoUsers
        onAddUser={props.onAddUser}
        onSignInSuccess={props.onSignInSuccess}
      />
      <div className="mt-3">
        <button
          type="button"
          className="text-sm font-medium inline-flex items-center"
          onClick={() => {
            setChooseUserFrom("SELECTION")
          }}
        >
          Choose from remembered users <CaretRight height={12} />
        </button>
      </div>
    </>
  )
}

export function LoginForm(props: {
  savedUsers: SavedUser[]
  onAddUser: (newUser: SavedUser) => void
  onRemoveUser: (id: string) => void
}) {
  const [isSignInSuccess, setIsSignInSuccess] = useState(false)

  if (isSignInSuccess)
    return (
      <div className="pt-4">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
        <div className="mt-3 text-center">
          <p className="font-medium">Sign in successful.</p>
          <p>You will be redirected in a moment ...</p>
        </div>
      </div>
    )

  if (props.savedUsers.length === 0)
    return (
      <NoUsers
        onAddUser={props.onAddUser}
        onSignInSuccess={() => {
          setIsSignInSuccess(true)
        }}
      />
    )

  return (
    <HasUsers
      savedUsers={props.savedUsers}
      onAddUser={props.onAddUser}
      onRemoveUser={props.onRemoveUser}
      onSignInSuccess={() => {
        setIsSignInSuccess(true)
      }}
    />
  )
}

import type { WebauthnCredential } from "@/server/db/entities"
import { api } from "@/utils/api"
import { startRegistration } from "@simplewebauthn/browser"
import toast from "react-hot-toast"

function CredentialsList(props: { credentials: WebauthnCredential[] }) {
  const apiUtils = api.useUtils()
  const { isLoading, mutate } = api.webauthn.deleteCredentialById.useMutation({
    onSuccess: () => {
      apiUtils.webauthn.getCredentials.invalidate()
    },
  })

  if (props.credentials.length === 0)
    return <div>No authenticators registered.</div>

  return (
    <div>
      {props.credentials.map((credential) => (
        <div key={credential.id} className="">
          <div className="overflow-hidden text-ellipsis bg-rose-500 px-4 py-2 rounded-t-lg text-white font-semibold">
            {credential.id}
          </div>
          <div className="border-x border-gray-300 px-4 py-2">
            <span className="font-semibold">Transport:</span>{" "}
            {credential.transports}
          </div>
          <div className="border-x border-b border-gray-300 px-4 pb-2 pt-1">
            <button
              type="button"
              disabled={isLoading}
              className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-400 disabled:bg-red-300 transition-colors text-white font-medium w-full"
              onClick={() => {
                mutate({
                  id: credential.id,
                })
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SecurityKeysSection() {
  const credentialsQuery = api.webauthn.getCredentials.useQuery()
  const generateRegistrationOptionsMutation =
    api.webauthn.generateRegistrationOptions.useMutation({
      onSuccess: async (options) => {
        const response = await startRegistration(options)
        verifyRegistrationResponseMutation.mutate({
          response,
        })
      },
      onError: ({ message }) => {
        toast.error(message)
      },
    })

  const verifyRegistrationResponseMutation =
    api.webauthn.verifyRegistrationResponse.useMutation({
      onSuccess: () => {
        credentialsQuery.refetch()
        toast.success("Authenticator registered.")
      },
      onError: ({ message }) => {
        toast.error(message)
      },
    })

  return (
    <section className="mt-6">
      <h2 className="font-semibold mb-3">Authenticators</h2>
      {credentialsQuery.status === "loading" && <div>Loading ...</div>}
      {credentialsQuery.status === "error" && (
        <div>Error: {credentialsQuery.error.message}</div>
      )}
      {credentialsQuery.status === "success" && (
        <CredentialsList credentials={credentialsQuery.data} />
      )}
      <button
        type="button"
        className="mt-3 px-4 py-2 rounded-md bg-green-500 hover:bg-green-400 disabled:bg-green-300 transition-colors text-white font-medium w-full"
        disabled={
          credentialsQuery.isLoading ||
          generateRegistrationOptionsMutation.isLoading ||
          verifyRegistrationResponseMutation.isLoading
        }
        onClick={() => {
          generateRegistrationOptionsMutation.mutate()
        }}
      >
        Register Authenticator
      </button>
    </section>
  )
}

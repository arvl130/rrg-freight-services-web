import type { WebauthnCredential } from "@/server/db/entities"
import { api } from "@/utils/api"
import { useState } from "react"
import { RegisterModal } from "./register-authenticator-modal"

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
    <div className="space-y-3">
      {props.credentials.map((credential) => (
        <div key={credential.id} className="">
          <div className=" bg-rose-500 px-4 py-2 rounded-t-lg text-white text-center font-semibold">
            {credential.displayName}
          </div>
          <div className="border-x border-gray-300 px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-semibold">ID:</span>{" "}
            <span>{credential.id}</span>
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
  const [isModalVisible, setIsModalVisible] = useState(false)

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
        onClick={() => {
          setIsModalVisible(true)
        }}
      >
        Register an Authenticator
      </button>

      <RegisterModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </section>
  )
}

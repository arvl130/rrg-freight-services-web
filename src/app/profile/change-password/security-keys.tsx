import type { WebauthnCredential } from "@/server/db/entities"
import { api } from "@/utils/api"
import { useState } from "react"
import { RegisterModal } from "./register-authenticator-modal"
import { EditModal } from "./edit-authenticator-modal"
import { DeleteModal } from "./delete-authenticator-modal"

function CredentialsListItem(props: { credential: WebauthnCredential }) {
  const [visibleModal, setVisibleModal] = useState<"" | "EDIT" | "DELETE">("")

  return (
    <div key={props.credential.deviceName}>
      <div className=" bg-rose-500 px-4 py-2 rounded-t-lg text-white text-center font-semibold">
        {props.credential.deviceName}
      </div>
      <div className="border-x border-gray-300 px-4 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="font-semibold">ID:</span>{" "}
        <span>{props.credential.id}</span>
      </div>
      <div className="border-x border-gray-300 px-4 py-2">
        <span className="font-semibold">Transport:</span>{" "}
        {props.credential.transports}
      </div>
      <div className="border-x border-b border-gray-300 px-4 pb-2 pt-1 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 transition-colors text-white font-medium w-full"
          onClick={() => setVisibleModal("EDIT")}
        >
          Edit
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-400 disabled:bg-red-300 transition-colors text-white font-medium w-full"
          onClick={() => setVisibleModal("DELETE")}
        >
          Remove
        </button>
      </div>

      <EditModal
        isOpen={visibleModal === "EDIT"}
        onClose={() => setVisibleModal("")}
        credential={props.credential}
      />
      <DeleteModal
        isOpen={visibleModal === "DELETE"}
        onClose={() => setVisibleModal("")}
        credential={props.credential}
      />
    </div>
  )
}

function CredentialsList(props: { credentials: WebauthnCredential[] }) {
  if (props.credentials.length === 0)
    return <div>No authenticators registered.</div>

  return (
    <div className="space-y-3">
      {props.credentials.map((credential) => (
        <CredentialsListItem
          key={credential.deviceName}
          credential={credential}
        />
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

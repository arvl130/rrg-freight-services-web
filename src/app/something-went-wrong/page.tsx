"use client"

import { useSession } from "@/hooks/session"
import { getAuth, signOut } from "firebase/auth"

export default function SomethingWentWrongPage() {
  const { isLoading, user } = useSession({
    required: true,
  })

  return (
    <>
      <p>Something went wrong. Please try again.</p>
      <button
        type="button"
        disabled={isLoading || user === null}
        onClick={() => {
          const auth = getAuth()
          signOut(auth)
        }}
      >
        logout
      </button>
    </>
  )
}

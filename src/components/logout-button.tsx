"use client"

import { useState } from "react"
import { SignOut } from "@phosphor-icons/react/dist/ssr/SignOut"
import { getAuth, signOut } from "firebase/auth"

export function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <button
      type="button"
      className="flex items-center gap-2 px-4 h-10 w-full hover:bg-sky-200 transition duration-200 text-white font-semibold"
      disabled={isSigningOut}
      onClick={async () => {
        setIsSigningOut(true)
        try {
          const auth = getAuth()
          await signOut(auth)
        } finally {
          setIsSigningOut(false)
        }
      }}
    >
      <SignOut
        size={24}
        className={isSigningOut ? "text-sky-200" : "text-white"}
      />
      <span>Logout</span>
    </button>
  )
}

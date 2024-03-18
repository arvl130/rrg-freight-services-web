"use client"

import { useState } from "react"
import { SignOut } from "@phosphor-icons/react/dist/ssr/SignOut"
import { signOutAction } from "@/server/actions/auth"

export function LogoutButton(props: { isMinimized: boolean }) {
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <button
      type="button"
      className={`grid ${
        props.isMinimized
          ? "grid-cols-[4rem] group-hover:grid-cols-[4rem_1fr]"
          : "grid-cols-[4rem_1fr]"
      } items-center h-10 w-full hover:bg-sky-200 transition duration-200 text-white font-semibold`}
      disabled={isSigningOut}
      onClick={async () => {
        setIsSigningOut(true)
        try {
          await signOutAction()
        } catch {
          setIsSigningOut(false)
        }
      }}
    >
      <div className="flex justify-center items-center">
        <SignOut
          size={32}
          className={isSigningOut ? "text-sky-200" : "text-white"}
        />
      </div>
      <div
        className={`text-left ${
          props.isMinimized ? "hidden group-hover:block" : ""
        }`}
      >
        Logout
      </div>
    </button>
  )
}

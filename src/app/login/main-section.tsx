"use client"

import { useSavedUser } from "@/components/saved-users"
import { LoginForm } from "./login-form"
import { LoadingSpinner } from "@/components/spinner"

export function MainSection() {
  const {
    isLoading,
    savedUsers,
    addUser,
    removeUserById: removeUserByEmail,
  } = useSavedUser()

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="mb-3 text-sm">Loading your options ...</p>
        <LoadingSpinner />
      </div>
    )

  return (
    <LoginForm
      savedUsers={savedUsers?.users ?? []}
      onAddUser={addUser}
      onRemoveUser={removeUserByEmail}
    />
  )
}

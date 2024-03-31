import { useEffect, useState } from "react"

const LOCAL_STORAGE_KEY = "saved-users"

export type SavedUser = {
  id: string
  displayName: string
  email: string
  photoUrl: string | null
}

type SavedUsersJSON = {
  users: SavedUser[]
}

export function useSavedUser() {
  const [isLoading, setIsLoading] = useState(true)
  const [savedUsers, setSavedUsers] = useState<null | SavedUsersJSON>(null)

  useEffect(() => {
    if (isLoading) {
      const savedUsersStr = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (savedUsersStr)
        setSavedUsers(JSON.parse(savedUsersStr) as SavedUsersJSON)

      setIsLoading(false)
    }
  }, [isLoading])

  return {
    isLoading,
    savedUsers,
    addUser(newUser: SavedUser) {
      setSavedUsers((currSavedUsers) => {
        if (currSavedUsers) {
          const isSavedAlready = currSavedUsers.users.some(
            ({ id }) => id === newUser.id,
          )

          if (isSavedAlready) return currSavedUsers
          else {
            const newSavedUsers = {
              users: [...currSavedUsers.users, newUser],
            }

            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify(newSavedUsers),
            )
            return newSavedUsers
          }
        } else {
          const newSavedUsers = {
            users: [newUser],
          }

          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSavedUsers))
          return newSavedUsers
        }
      })
    },
    removeUserById(idToDelete: string) {
      setSavedUsers((currSavedUsers) => {
        if (currSavedUsers) {
          const newSavedUsers = {
            users: currSavedUsers.users.filter(({ id }) => id !== idToDelete),
          }

          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSavedUsers))
          return {
            ...newSavedUsers,
          }
        } else {
          return currSavedUsers
        }
      })
    },
  }
}

"use client"

import { AuthContext } from "@/providers/auth"
import { SUPPORTED_USER_ROLES, UserRole } from "./constants"
import { useContext, useEffect } from "react"
import { useRouter } from "next/navigation"

const userRoleRedirectPaths: Record<UserRole, string> = {
  ADMIN: "/admin/dashboard",
  WAREHOUSE: "/warehouse/dashboard",
  OVERSEAS_AGENT: "/overseas/dashboard",
  DOMESTIC_AGENT: "/domestic/dashboard",
  DRIVER: "/driver/dashboard",
}

export function getUserRoleRedirectPath(role: UserRole | null) {
  if (role === null) return "/something-went-wrong"

  return userRoleRedirectPaths[role]
}

export function useSession(
  {
    required,
  }: {
    required:
      | false // Session is not required.
      | true // Session is required, but any user is allowed.
      // Session is required, with a particular type.
      | {
          role: UserRole
        }
  } = {
    required: false,
  },
) {
  const session = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (session.isLoading) return

    // If a session is required, but there is no session user,
    // then redirect to the login page.
    if (typeof required === "boolean" && required && session.user === null) {
      router.push("/login")
      return
    }

    if (typeof required === "object") {
      if (session.user === null) {
        router.push("/login")

        return
      }

      for (const sessionRole of SUPPORTED_USER_ROLES) {
        if (required.role === sessionRole && session.role !== sessionRole) {
          const redirectPath = getUserRoleRedirectPath(session.role)
          router.push(redirectPath)

          return
        }
      }
    }

    // TODO: Handle return urls.
  }, [router, required, session])

  return session
}

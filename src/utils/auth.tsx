import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { useRouter } from "next/router"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)

const sessionRoles = ["ADMIN", "WAREHOUSE", "SENDER", "RECEIVER"] as const
type SessionRole = (typeof sessionRoles)[number]

const sessionRoleRedirectPaths: Record<SessionRole, string> = {
  ADMIN: "/admin/dashboard",
  WAREHOUSE: "/warehouse/dashboard",
  SENDER: "/sender/dashboard",
  RECEIVER: "/receiver/dashboard",
}

export function getSessionRoleRedirectPath(role: SessionRole | null) {
  if (role === null) return "/something-went-wrong"

  return sessionRoleRedirectPaths[role]
}

type AuthContextType =
  // Initial state
  | {
      isLoading: true
      user: null
      role: null
    }
  // Unauthenticated state
  | {
      isLoading: false
      user: null
      role: null
    }
  // Authenticated state
  | {
      isLoading: false
      user: User
      role: SessionRole | null
    }

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  user: null,
  role: null,
})

export function AuthProvider(props: { children: ReactNode; [x: string]: any }) {
  const [session, setSession] = useState<AuthContextType>({
    isLoading: true,
    user: null,
    role: null,
  })

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user === null) {
        setSession({
          isLoading: false,
          user: null,
          role: null,
        })
        return
      }

      try {
        const idTokenResult = await user.getIdTokenResult()
        setSession({
          isLoading: false,
          user,
          role: (idTokenResult.claims.role as SessionRole) ?? null,
        })
      } catch {
        setSession({
          isLoading: false,
          user: null,
          role: null,
        })
      }
    })
  }, [])

  return <AuthContext.Provider value={session} {...props} />
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
          role: SessionRole
        }
  } = {
    required: false,
  }
) {
  const session = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
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

      for (const key in sessionRoles) {
        const sessionRole = sessionRoles[key]

        if (required.role === sessionRole && session.role !== sessionRole) {
          const redirectPath = getSessionRoleRedirectPath(session.role)
          router.push(redirectPath)

          return
        }
      }
    }

    // TODO: Handle return urls.
  }, [router, required, session])

  return session
}

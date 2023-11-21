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
import { Role, supportedRoles } from "./constants"

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

const sessionRoleRedirectPaths: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  WAREHOUSE: "/warehouse/dashboard",
  OVERSEAS_AGENT: "/overseas/dashboard",
  DOMESTIC_AGENT: "/domestic/dashboard",
  RIDER: "/rider/dashboard",
}

export function getSessionRoleRedirectPath(role: Role | null) {
  if (role === null) return "/something-went-wrong"

  return sessionRoleRedirectPaths[role]
}

type AuthContextType = {
  reload: () => Promise<void>
} & (
  | {
      // Initial state
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
      role: Role
    }
)

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  user: null,
  role: null,
  reload: Promise.resolve,
})

export function AuthProvider(props: { children: ReactNode; [x: string]: any }) {
  const [session, setSession] = useState<AuthContextType>({
    isLoading: true,
    user: null,
    role: null,
    reload: Promise.resolve,
  })

  async function reload() {
    const { currentUser } = getAuth()
    await currentUser?.reload()
    setSession((currSession) => ({
      ...currSession,
    }))
  }

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user === null) {
        setSession({
          isLoading: false,
          user: null,
          role: null,
          reload,
        })
        return
      }

      try {
        const idTokenResult = await user.getIdTokenResult()
        setSession({
          isLoading: false,
          user,
          role: (idTokenResult.claims.role as Role) ?? "CUSTOMER",
          reload,
        })
      } catch {
        setSession({
          isLoading: false,
          user: null,
          role: null,
          reload,
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
          role: Role
        }
  } = {
    required: false,
  },
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

      for (const sessionRole of supportedRoles) {
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

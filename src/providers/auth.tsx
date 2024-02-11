import { UserRole } from "@/utils/constants"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { ReactNode, useState } from "react"
import { getApp, getApps, initializeApp } from "firebase/app"
import { User } from "firebase/auth"
import { createContext, useEffect } from "react"

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

type AuthContext = {
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
      role: UserRole
    }
)

export const AuthContext = createContext<AuthContext>({
  isLoading: true,
  user: null,
  role: null,
  reload: Promise.resolve,
})

export function AuthProvider(props: { children: ReactNode; [x: string]: any }) {
  const [session, setSession] = useState<AuthContext>({
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
          role: idTokenResult.claims.role as UserRole,
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

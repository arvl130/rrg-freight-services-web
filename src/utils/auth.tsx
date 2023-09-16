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
export const auth = getAuth(app)

const AuthContext = createContext<{
  isLoading: boolean
  user: User | null
}>({
  isLoading: true,
  user: null,
})

export function AuthProvider(props: { children: ReactNode; [x: string]: any }) {
  const [session, setSession] = useState<{
    isLoading: boolean
    user: User | null
  }>({
    isLoading: true,
    user: null,
  })

  useEffect(() => {
    return onAuthStateChanged(auth, (user) =>
      setSession({
        isLoading: false,
        user,
      })
    )
  }, [])

  return <AuthContext.Provider value={session} {...props} />
}

export function useSession(
  { required }: { required: boolean } = { required: false }
) {
  const session = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    if (session.isLoading) return

    // If a session is required, but there is no session user,
    // then redirect to the login page.
    if (required && session.user === null) router.push("/login")

    // TODO: Handle return urls.
  }, [router, required, session])

  return session
}

import { getApps, getApp, initializeApp, cert } from "firebase-admin/app"
import type { CreateRequest, UserRecord } from "firebase-admin/auth"
import { getAuth } from "firebase-admin/auth"
import { getStorage, getDownloadURL } from "firebase-admin/storage"
import { serverEnv } from "./env.mjs"
import { clientEnv } from "@/utils/env.mjs"
import { Lucia } from "lucia"
import { DrizzleMySQLAdapter } from "@lucia-auth/adapter-drizzle"
import { cache } from "react"
import { cookies } from "next/headers"
import type { UserRole } from "@/utils/constants"
import { db } from "./db/client"
import { sessions, users } from "./db/schema"

const {
  FIREBASE_ADMIN_PROJECT_ID,
  FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_ADMIN_CLIENT_EMAIL,
} = serverEnv

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: FIREBASE_ADMIN_PROJECT_ID,
          privateKey: FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
          clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
        }),
        storageBucket: clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      })
    : getApp()

const auth = getAuth(app)
const storage = getStorage(app)

export async function uploadJsonToBucket(options: {
  filename: string
  body: string
}) {
  const bucket = storage.bucket()
  const file = bucket.file(options.filename)

  await file.save(options.body)

  const downloadUrl = await getDownloadURL(file)
  return downloadUrl
}

export function createCustomToken(uid: string) {
  return auth.createCustomToken(uid)
}

export function getUserByEmail(email: string) {
  return auth.getUserByEmail(email)
}

export async function createUser(props: {
  options: CreateRequest
  role: UserRole
}) {
  const userRecord = await auth.createUser(props.options)
  auth.setCustomUserClaims(userRecord.uid, {
    role: props.role,
  })

  return userRecord
}

export async function updateProfile(
  user: UserRecord,
  {
    displayName,
    photoURL,
    email,
  }: {
    displayName?: string | null
    photoURL?: string | null
    email?: string
  },
) {
  await auth.updateUser(user.uid, {
    displayName,
    photoURL,
    email,
  })
}

export async function getServerSession({ req }: { req: Request }) {
  const authorization = req.headers.get("Authorization")
  if (!authorization) return null

  try {
    const idToken = authorization.split(" ")[1]
    const token = await auth.verifyIdToken(idToken)
    const user = await auth.getUser(token.uid)

    return {
      user,
      token,
    }
  } catch {
    // If verification fails, then we have no session.
    return null
  }
}

const adapter = new DrizzleMySQLAdapter(db, sessions, users)
const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      role: attributes.role,
      photoUrl: attributes.photoUrl,
      displayName: attributes.displayName,
    }
  },
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  role: UserRole
  displayName: string
  photoUrl: string | null
}

export async function createSessionForUserId(userId: string) {
  const session = await lucia.createSession(userId, {})
  const sessionCookie = lucia.createSessionCookie(session.id)

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )
}

export const validateSessionFromCookies = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
  if (!sessionId) {
    return null
  }

  const { user, session } = await lucia.validateSession(sessionId)
  if (!user) {
    return null
  }

  // Next.js throws when you attempt to set a cookie when rendering page.
  try {
    if (session) {
      if (session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id)
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        )
      }
    } else {
      const sessionCookie = lucia.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )
    }
  } catch {}

  return {
    user,
    session,
  }
})

export async function invalidateSessionById(sessionId: string) {
  await lucia.invalidateSession(sessionId)
  const sessionCookie = lucia.createBlankSessionCookie()

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )
}

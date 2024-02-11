import { getApps, getApp, initializeApp, cert } from "firebase-admin/app"
import { UserRecord, getAuth } from "firebase-admin/auth"
import { GetServerSidePropsContext } from "next"
import { serverEnv } from "./env.mjs"

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
      })
    : getApp()

const auth = getAuth(app)

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

export async function getServerSession({
  req,
}: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) {
  const { authorization } = req.headers
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

export async function getServerSessionFetch({ req }: { req: Request }) {
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

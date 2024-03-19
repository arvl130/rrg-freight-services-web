"use server"

import { redirect } from "next/navigation"
import {
  validateSessionFromCookies,
  invalidateSessionById,
  createSessionForUserId,
} from "../auth"
import { Scrypt } from "lucia"
import { z } from "zod"
import { db } from "@/server/db/client"
import {
  users,
  webauthnChallenges,
  webauthnCredentials,
} from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { getUserRoleRedirectPath } from "@/utils/redirects"
import type { AuthenticationResponseJSON } from "@simplewebauthn/types"
import { isoBase64URL, isoUint8Array } from "@simplewebauthn/server/helpers"
import { serverEnv } from "../env.mjs"
import { verifyAuthenticationResponse } from "@simplewebauthn/server"

const signInInputSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Please enter your email.",
    })
    .email({
      message: "This email has an invalid format.",
    }),
  password: z.string().min(1, {
    message: "Please enter your password.",
  }),
})

export async function signInWithEmailAndPasswordAction(formData: FormData) {
  const parseResult = signInInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parseResult.success) {
    return {
      error: "Username or password has invalid format.",
    }
  }

  const { email, password } = parseResult.data
  const userRecords = await db
    .select()
    .from(users)
    .where(eq(users.emailAddress, email))

  if (userRecords.length !== 1) {
    return {
      error: "Incorrect username or password",
    }
  }

  const [userRecord] = userRecords
  const passwordIsValid = await new Scrypt().verify(
    userRecord.hashedPassword,
    password,
  )

  if (!passwordIsValid) {
    return {
      error: "Incorrect username or password",
    }
  }

  await createSessionForUserId(userRecord.id)

  const redirectPath = getUserRoleRedirectPath(userRecord.role)
  return redirect(redirectPath)
}

export async function signInWithWebauthnResponseAction(
  response: AuthenticationResponseJSON,
) {
  const credentialIdBuffer = isoBase64URL.toBuffer(response.rawId)
  const credential = await db.query.webauthnCredentials.findFirst({
    where: eq(webauthnCredentials.id, isoUint8Array.toHex(credentialIdBuffer)),
  })

  if (!credential) {
    return {
      message: "No such credential.",
    }
  }

  const challenge = await db.query.webauthnChallenges.findFirst({
    where: eq(webauthnChallenges.userId, credential.userId),
  })

  if (!challenge) {
    return {
      message: "No challenge found for user.",
    }
  }

  const url = new URL(serverEnv.APP_ORIGIN)
  const { verified, authenticationInfo: info } =
    await verifyAuthenticationResponse({
      response,
      expectedChallenge: challenge.challenge,
      expectedOrigin: url.origin,
      expectedRPID: url.hostname,
      authenticator: {
        credentialPublicKey: new Uint8Array(Buffer.from(credential.key, "hex")),
        credentialID: isoUint8Array.fromHex(credential.id),
        counter: credential.counter,
      },
    })

  if (!verified || !info) {
    return {
      message: "Missing verified or info from authentication response.",
    }
  }

  await db
    .update(webauthnCredentials)
    .set({
      counter: info.newCounter,
    })
    .where(eq(webauthnCredentials.id, credential.id))

  const userRecords = await db
    .select()
    .from(users)
    .where(eq(users.id, credential.userId))

  if (userRecords.length === 0) {
    return {
      message: "No such user.",
    }
  }

  if (userRecords.length > 1) {
    return {
      message: "Expected 1 user, but got multiple.",
    }
  }

  const [userRecord] = userRecords
  await createSessionForUserId(userRecord.id)

  const redirectPath = getUserRoleRedirectPath(userRecord.role)
  return redirect(redirectPath)
}

export async function signOutAction() {
  const session = await validateSessionFromCookies()
  if (!session) {
    return {
      error: "Unauthorized",
    }
  }

  await invalidateSessionById(session.session.id)
  return redirect("/login")
}

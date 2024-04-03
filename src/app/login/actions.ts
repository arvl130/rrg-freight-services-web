"use server"

import { redirect } from "next/navigation"
import { createSessionForUserId } from "@/server/auth"
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
import { serverEnv } from "@/server/env.mjs"
import { verifyAuthenticationResponse } from "@simplewebauthn/server"

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
      requireUserVerification: false,
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

  return {
    message: "Login succeeded.",
    data: {
      redirectPath,
      user: {
        id: userRecord.id,
        displayName: userRecord.displayName,
        email: userRecord.emailAddress,
        photoUrl: userRecord.photoUrl,
      },
    },
  }
}

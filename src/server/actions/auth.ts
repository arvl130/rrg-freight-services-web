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
import { users } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { getUserRoleRedirectPath } from "@/utils/redirects"

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

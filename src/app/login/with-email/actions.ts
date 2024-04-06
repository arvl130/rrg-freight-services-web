"use server"

import { redirect } from "next/navigation"
import { createSessionForUserId } from "@/server/auth"
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

type FormState = {
  message: string
  fields?: Record<string, string>
  issues?: string[]
}

export async function signInWithEmailAndPasswordAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const parseResult = signInInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parseResult.success) {
    const fields: Record<string, string> = {}
    for (const key of formData.keys()) {
      fields[key] = formData.get(key)?.toString() ?? ""
    }

    return {
      message: "Email or Password has invalid format.",
      fields,
      issues: parseResult.error.issues.map((issue) => issue.message),
    }
  }

  const { email, password } = parseResult.data
  const userRecords = await db
    .select()
    .from(users)
    .where(eq(users.emailAddress, email))

  if (userRecords.length !== 1) {
    return {
      message: "Incorrect Email or Password.",
      fields: parseResult.data,
    }
  }

  const [userRecord] = userRecords
  const passwordIsValid = await new Scrypt().verify(
    userRecord.hashedPassword,
    password,
  )

  if (!passwordIsValid) {
    return {
      message: "Incorrect Email or Password.",
      fields: parseResult.data,
    }
  }

  await createSessionForUserId(userRecord.id)

  const redirectPath = getUserRoleRedirectPath(userRecord.role)
  return redirect(redirectPath)
}

"use server"

import { db } from "@/server/db/client"
import { users } from "@/server/db/schema"
import { createLog } from "@/utils/logging"
import { updateDetailsInputSchema } from "./form-schema"
import { eq } from "drizzle-orm"
import { validateSessionFromCookies } from "@/server/auth"
import { revalidatePath } from "next/cache"

type FormState = {
  success: boolean
  message: string
  fields?: Record<string, string> | undefined
  issues?: string[] | undefined
}

export async function updateDetailsAction(_: FormState, formData: FormData) {
  const session = await validateSessionFromCookies()
  if (!session) {
    return {
      success: false,
      message: "Unauthorized.",
    }
  }

  const parseResult = updateDetailsInputSchema.safeParse({
    displayName: formData.get("displayName"),
    contactNumber: formData.get("contactNumber"),
    emailAddress: formData.get("emailAddress"),
    gender: formData.get("gender"),
  })

  if (!parseResult.success) {
    const fields: Record<string, string> = {}
    for (const key of formData.keys()) {
      fields[key] = formData.get(key)?.toString() ?? ""
    }

    return {
      success: false,
      message: "One or more fields has invalid format.",
      fields,
      issues: parseResult.error.issues.map((issue) => issue.message),
    }
  }

  const { displayName, contactNumber, emailAddress, gender } = parseResult.data
  await db
    .update(users)
    .set({
      displayName,
      contactNumber,
      emailAddress,
      gender: gender === "UNKNOWN" ? null : gender,
    })
    .where(eq(users.id, session.user.id))

  await createLog(db, {
    verb: "UPDATE",
    entity: "USER",
    createdById: session.user.id,
  })

  revalidatePath("/", "layout")
  return {
    success: true,
    message: "User details updated.",
  }
}

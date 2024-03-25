"use server"

import { db } from "@/server/db/client"
import { users } from "@/server/db/schema"
import { createLog } from "@/utils/logging"
import { updateDetailsInputSchema } from "./form-schema"
import { eq } from "drizzle-orm"
import { validateSessionWithCookies } from "@/server/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { MYSQL_TEXT_COLUMN_DEFAULT_LIMIT } from "@/utils/constants"
import { getStorage } from "firebase-admin/storage"
import { clientEnv } from "@/utils/env.mjs"

type FormState = {
  success: boolean
  message: string
  fields?: Record<string, string> | undefined
  issues?: string[] | undefined
}

export async function updateDetailsAction(_: FormState, formData: FormData) {
  const { user } = await validateSessionWithCookies()
  if (!user) {
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
      gender,
    })
    .where(eq(users.id, user.id))

  await createLog(db, {
    verb: "UPDATE",
    entity: "USER",
    createdById: user.id,
  })

  revalidatePath("/", "layout")
  return {
    success: true,
    message: "User details updated.",
  }
}

const updatePhotoUrlInputSchema = z.object({
  photoUrl: z.string().min(1).url().max(MYSQL_TEXT_COLUMN_DEFAULT_LIMIT),
})

export async function updatePhotoUrlAction(_: FormState, formData: FormData) {
  const { user } = await validateSessionWithCookies()
  if (!user) {
    return {
      success: false,
      message: "Unauthorized.",
    }
  }

  const parseResult = updatePhotoUrlInputSchema.safeParse({
    photoUrl: formData.get("photoUrl"),
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

  const { photoUrl } = parseResult.data
  await db
    .update(users)
    .set({
      photoUrl,
    })
    .where(eq(users.id, user.id))

  await createLog(db, {
    verb: "UPDATE",
    entity: "USER",
    createdById: user.id,
  })

  revalidatePath("/", "layout")
  return {
    success: true,
    message: "User photo url updated.",
  }
}

export async function removePhotoUrlAction(_: FormState) {
  console.log("triggered")
  const { user } = await validateSessionWithCookies()
  if (!user) {
    return {
      success: false,
      message: "Unauthorized.",
    }
  }

  const storage = getStorage()
  await storage
    .bucket(clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
    .file(`profile-photos/${user.id}`)
    .delete()

  await db
    .update(users)
    .set({
      photoUrl: null,
    })
    .where(eq(users.id, user.id))

  await createLog(db, {
    verb: "UPDATE",
    entity: "USER",
    createdById: user.id,
  })

  revalidatePath("/", "layout")
  return {
    success: true,
    message: "User photo url removed.",
  }
}

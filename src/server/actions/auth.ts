"use server"

import { redirect } from "next/navigation"
import { validateSessionWithCookies, invalidateSessionById } from "../auth"
import { revalidatePath } from "next/cache"

export async function signOutAction() {
  const { session } = await validateSessionWithCookies()
  if (!session) {
    return {
      error: "Unauthorized",
    }
  }

  await invalidateSessionById(session.id)

  revalidatePath("/", "layout")
  return redirect("/login")
}

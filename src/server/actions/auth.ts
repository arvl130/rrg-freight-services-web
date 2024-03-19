"use server"

import { redirect } from "next/navigation"
import { validateSessionFromCookies, invalidateSessionById } from "../auth"
import { revalidatePath } from "next/cache"

export async function signOutAction() {
  const session = await validateSessionFromCookies()
  if (!session) {
    return {
      error: "Unauthorized",
    }
  }

  await invalidateSessionById(session.session.id)

  revalidatePath("/", "layout")
  return redirect("/login")
}

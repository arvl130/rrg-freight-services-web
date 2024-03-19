"use server"

import { redirect } from "next/navigation"
import { validateSessionFromCookies, invalidateSessionById } from "../auth"

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

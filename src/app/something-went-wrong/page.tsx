import { signOutAction } from "@/server/actions/auth"
import { validateSessionFromCookies } from "@/server/auth"
import { redirect } from "next/navigation"

export default async function SomethingWentWrongPage() {
  const session = await validateSessionFromCookies()
  if (!session) {
    return redirect("/login")
  }

  return (
    <form action={signOutAction}>
      <p>Something went wrong. Please try again.</p>
      <button type="submit">logout</button>
    </form>
  )
}

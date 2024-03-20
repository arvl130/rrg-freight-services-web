import { signOutAction } from "@/server/actions/auth"
import { validateSessionWithCookies } from "@/server/auth"
import { redirect } from "next/navigation"

export default async function SomethingWentWrongPage() {
  const session = await validateSessionWithCookies()
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

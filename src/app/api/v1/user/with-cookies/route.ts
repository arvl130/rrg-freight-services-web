import { validateSessionWithCookies } from "@/server/auth"

export async function GET() {
  const { user, session } = await validateSessionWithCookies()
  if (user === null) {
    return Response.json(
      { message: "Unauthorized." },
      {
        status: 401,
      },
    )
  }

  try {
    return Response.json({
      message: "Current user retrieved.",
      session,
      user,
    })
  } catch (e) {
    return Response.json(
      {
        message: "Unknown error occured",
        error: e,
      },
      {
        status: 500,
      },
    )
  }
}

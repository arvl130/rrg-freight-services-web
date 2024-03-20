import { validateSessionWithHeaders } from "@/server/auth"

export async function GET(req: Request) {
  const { user, session } = await validateSessionWithHeaders({ req })
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

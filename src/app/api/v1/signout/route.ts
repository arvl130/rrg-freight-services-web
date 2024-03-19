import {
  invalidateSessionByIdWithoutCookie,
  validateSessionFromHeaders,
} from "@/server/auth"

export async function GET(req: Request) {
  const session = await validateSessionFromHeaders({ req })
  if (session === null) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    await invalidateSessionByIdWithoutCookie(session.session.id)

    return Response.json({
      message: "Sign out succedeed.",
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

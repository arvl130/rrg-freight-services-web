import { validateSessionFromHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { users } from "@/server/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
  const session = await validateSessionFromHeaders({ req })
  if (session === null) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))

    if (userRecords.length === 0) {
      return Response.json(
        { message: "No such user." },
        {
          status: 404,
        },
      )
    }

    if (userRecords.length > 1) {
      return Response.json(
        { message: "Expected 1 result, but got more." },
        {
          status: 412,
        },
      )
    }

    const [userRecord] = userRecords

    return Response.json({
      message: "Current user retrieved.",
      sessionId: session.session.id,
      user: {
        id: userRecord.id,
        role: userRecord.role,
      },
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

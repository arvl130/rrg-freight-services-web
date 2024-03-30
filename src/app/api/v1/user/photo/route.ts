import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { users } from "@/server/db/schema"
import { createLog } from "@/utils/logging"
import { eq } from "drizzle-orm"
import { ZodError, z } from "zod"

export async function DELETE(req: Request) {
  const { user } = await validateSessionWithHeaders({ req })
  if (user === null) {
    return Response.json(
      { message: "Unauthorized." },
      {
        status: 401,
      },
    )
  }

  try {
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

    return Response.json({
      message: "User photo removed.",
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

const inputSchema = z.object({
  photoUrl: z.string().min(1),
})

export async function POST(req: Request) {
  const { user } = await validateSessionWithHeaders({ req })
  if (user === null) {
    return Response.json(
      { message: "Unauthorized." },
      {
        status: 401,
      },
    )
  }

  try {
    const body = await req.json()
    const input = inputSchema.parse({
      photoUrl: body.photoUrl,
    })

    await db
      .update(users)
      .set({
        photoUrl: input.photoUrl,
      })
      .where(eq(users.id, user.id))

    await createLog(db, {
      verb: "UPDATE",
      entity: "USER",
      createdById: user.id,
    })

    return Response.json({
      message: "User photo updated.",
    })
  } catch (e) {
    if (e instanceof ZodError) {
      return Response.json(
        {
          message: "Invalid input",
          error: e.flatten(),
        },
        {
          status: 400,
        },
      )
    } else {
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
}

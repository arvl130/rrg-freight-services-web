import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { users } from "@/server/db/schema"
import type { Gender } from "@/utils/constants"
import { SUPPORTED_GENDERS } from "@/utils/constants"
import { createLog } from "@/utils/logging"
import { eq, getTableColumns } from "drizzle-orm"
import { ZodError, z } from "zod"

export async function GET(req: Request) {
  const { session } = await validateSessionWithHeaders({ req })
  if (session === null) {
    return Response.json(
      { message: "Unauthorized." },
      {
        status: 401,
      },
    )
  }

  const { hashedPassword, ...usersTableColumns } = getTableColumns(users)

  const [user] = await db
    .select(usersTableColumns)
    .from(users)
    .where(eq(users.id, session.userId))

  try {
    return Response.json({
      message: "User profile retrieved.",
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
  displayName: z.string().min(1).max(100),
  emailAddress: z.string().min(1).max(100).email(),
  contactNumber: z.string().min(1).max(15),
  gender: z.custom<Gender>((val) => SUPPORTED_GENDERS.includes(val as Gender)),
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
      displayName: body.displayName,
      emailAddress: body.emailAddress,
      contactNumber: body.contactNumber,
      gender: body.gender,
    })

    await db
      .update(users)
      .set({
        displayName: input.displayName,
        contactNumber: input.contactNumber,
        emailAddress: input.emailAddress,
        gender: input.gender,
      })
      .where(eq(users.id, user.id))

    await createLog(db, {
      verb: "UPDATE",
      entity: "USER",
      createdById: user.id,
    })

    return Response.json({
      message: "User profile updated.",
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

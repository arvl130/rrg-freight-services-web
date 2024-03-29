import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { users } from "@/server/db/schema"
import { createLog } from "@/utils/logging"
import { eq } from "drizzle-orm"
import { Scrypt } from "lucia"
import { ZodError, z } from "zod"

const inputSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
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
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    })

    const scrypt = new Scrypt()
    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))

    if (userRecords.length !== 1) {
      return Response.json(
        {
          message: "No such user.",
        },
        {
          status: 404,
        },
      )
    }

    const [userRecord] = userRecords
    const passwordIsCorrect = await scrypt.verify(
      userRecord.hashedPassword,
      input.currentPassword,
    )

    if (!passwordIsCorrect) {
      return Response.json(
        {
          message: "Incorrect password.",
        },
        {
          status: 400,
        },
      )
    }

    const hashedPassword = await scrypt.hash(input.newPassword)
    await db
      .update(users)
      .set({
        hashedPassword,
      })
      .where(eq(users.id, user.id))

    await createLog(db, {
      verb: "UPDATE",
      entity: "USER",
      createdById: user.id,
    })

    return Response.json({
      message: "User password updated.",
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

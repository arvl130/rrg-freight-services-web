import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { expopushTokens } from "@/server/db/schema"
import { and, eq } from "drizzle-orm"
import { ZodError, z } from "zod"
import { Expo } from "expo-server-sdk"

const inputSchema = z.object({
  token: z.string().min(1),
})

export async function DELETE(req: Request, ctx: { params: { token: string } }) {
  const { session } = await validateSessionWithHeaders({ req })
  if (session === null) {
    return Response.json(
      { message: "Unauthorized." },
      {
        status: 401,
      },
    )
  }

  try {
    const { token } = inputSchema.parse({
      token: ctx.params.token,
    })

    if (!Expo.isExpoPushToken(token)) {
      return Response.json(
        {
          message: "Invalid token.",
        },
        {
          status: 400,
        },
      )
    }

    await db
      .delete(expopushTokens)
      .where(
        and(
          eq(expopushTokens.userId, session.userId),
          eq(expopushTokens.data, token),
        ),
      )

    return Response.json({
      message: "Token unregistered.",
      token,
    })
  } catch (e) {
    if (e instanceof ZodError) {
      return Response.json(
        {
          message: "Invalid input.",
          error: e.flatten(),
        },
        {
          status: 400,
        },
      )
    } else {
      return Response.json(
        {
          message: "Unknown error occured.",
          error: e,
        },
        {
          status: 500,
        },
      )
    }
  }
}

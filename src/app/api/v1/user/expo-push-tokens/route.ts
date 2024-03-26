import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { expopushTokens } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { ZodError, z } from "zod"
import { Expo } from "expo-server-sdk"

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

  try {
    const expopushTokenResults = await db
      .select()
      .from(expopushTokens)
      .where(eq(expopushTokens.userId, session.userId))

    return Response.json({
      message: "Tokens retrieved.",
      tokens: expopushTokenResults.map(({ data }) => data),
    })
  } catch (e) {
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

const inputSchema = z.object({
  token: z.string().min(1),
})

export async function POST(req: Request) {
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
    const body = await req.json()
    const { token } = inputSchema.parse({
      token: body.token,
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
      .insert(expopushTokens)
      .values({
        userId: session.userId,
        data: token,
      })
      .onDuplicateKeyUpdate({
        set: {
          data: token,
        },
      })

    return Response.json({
      message: "Token registered.",
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

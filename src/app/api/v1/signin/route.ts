import { createSessionForUserIdWithoutCookie } from "@/server/auth"
import { db } from "@/server/db/client"
import { users } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { Scrypt } from "lucia"
import { ZodError, z } from "zod"

const signInInputSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Please enter your email.",
    })
    .email({
      message: "This email has an invalid format.",
    }),
  password: z.string().min(1, {
    message: "Please enter your password.",
  }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = signInInputSchema.parse({
      email: body.email,
      password: body.password,
    })

    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.emailAddress, email))

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
    const passwordIsValid = await new Scrypt().verify(
      userRecord.hashedPassword,
      password,
    )

    if (!passwordIsValid) {
      return Response.json(
        { message: "Incorrect username or password." },
        {
          status: 400,
        },
      )
    }

    const session = await createSessionForUserIdWithoutCookie(userRecord.id)
    return Response.json({
      message: "Sign in succedeed.",
      session,
      user: {
        id: userRecord.id,
        role: userRecord.role,
        displayName: userRecord.displayName,
        photoUrl: userRecord.photoUrl,
      },
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

export async function OPTIONS() {
  return new Response("OK", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

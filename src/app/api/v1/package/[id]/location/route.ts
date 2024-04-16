import { validateSessionWithHeaders } from "@/server/auth"
import { db } from "@/server/db/client"
import { packages } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { getLongitudeLatitudeWithGoogle } from "@/server/geocoding"
const inputSchema = z.object({ packageId: z.string() })

export async function GET(req: Request, ctx: { params: { id: string } }) {
  try {
    const { user } = await validateSessionWithHeaders({ req })
    if (user === null) {
      return Response.json(
        { message: "Unauthorized." },
        {
          status: 401,
        },
      )
    }

    const input = inputSchema.parse({
      packageId: ctx.params.id,
    })

    const [_package] = await db
      .select()
      .from(packages)
      .where(eq(packages.id, input.packageId))

    const packageAddress = `${_package.receiverStreetAddress}, ${_package.receiverCity}, ${_package.receiverStateOrProvince}, ${_package.receiverCountryCode}`
    const result = await getLongitudeLatitudeWithGoogle(packageAddress)

    return Response.json({
      packageCoordinate: {
        lat: result.lat,
        lon: result.long,
      },
      packageAddress,
      message: "Package retrieved",
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

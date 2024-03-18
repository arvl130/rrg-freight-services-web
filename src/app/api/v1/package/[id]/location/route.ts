import { getServerSession } from "@/server/auth"
import { db } from "@/server/db/client"
import { packages } from "@/server/db/schema"
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { serverEnv } from "@/server/env.mjs"
const inputSchema = z.object({ packageId: z.string() })

async function AddressToCoordintaesConvertion(addresses: string[]) {
  const coordinatesPromises = addresses.map(async (address) => {
    const response = await fetch(
      `${serverEnv.GEOAPIFY_API_URL}${encodeURI(
        address,
      )}&limit=1&format=json&apiKey=${serverEnv.GEOAPIFY_API_KEY}`,
    )

    const { results } = await response.json()
    return { lat: results[0].lat, lon: results[0].lon }
  })
  return await Promise.all(coordinatesPromises)
}

export async function GET(req: Request, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSession({ req })
    if (session === null) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const input = inputSchema.parse({
      packageId: ctx.params.id,
    })

    const packageByIdResult = await db
      .select()
      .from(packages)
      .where(eq(packages.id, input.packageId))

    const recieverAddress = packageByIdResult.map((item) => {
      return `${item.receiverStreetAddress} ${item.receiverCity} ${item.receiverCountryCode}`
    })

    const coordinate = await AddressToCoordintaesConvertion(recieverAddress)

    return Response.json({
      packageCoordinate: coordinate[0],
      packageAddress: recieverAddress[0],
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

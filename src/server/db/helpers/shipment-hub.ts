import * as schema from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { MySql2Database } from "drizzle-orm/mysql2"
import { UserRecord } from "firebase-admin/auth"

export async function getShipmentHubIdOfUser(
  db: MySql2Database<typeof schema>,
  user: UserRecord,
) {
  const shipmentHubsOfThisUser = await db
    .select()
    .from(schema.shipmentHubAgents)
    .where(eq(schema.shipmentHubAgents.userId, user.uid))

  if (shipmentHubsOfThisUser.length === 0) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Expected 1 shipment hub for this user, but got none",
    })
  }

  if (shipmentHubsOfThisUser.length > 1) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Expected 1 shipment hub for this user, but got more",
    })
  }

  const [{ shipmentHubId }] = shipmentHubsOfThisUser
  return shipmentHubId
}

import { and, eq, inArray, ne } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { shipmentHubs } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { getShipmentHubOfUserId } from "@/server/db/helpers/shipment-hub"

export const shipmentHubRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(shipmentHubs)
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(shipmentHubs)
        .where(eq(shipmentHubs.id, input.id))

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      return results[0]
    }),
  getDestinations: protectedProcedure.query(async ({ ctx }) => {
    const shipmentHubOfUser = await getShipmentHubOfUserId(ctx.db, ctx.user.uid)

    // If a user belongs to a sending hub,
    // they can only ship items to our main hubs.
    if (shipmentHubOfUser.role === "SENDING") {
      return await ctx.db
        .select()
        .from(shipmentHubs)
        .where(
          and(
            ne(shipmentHubs.id, shipmentHubOfUser.id),
            eq(shipmentHubs.isMainHub, 1),
          ),
        )
    }

    // If a user belongs to a sending & receiving hub,
    // they can only ship items to other sending & receiving hubs,
    // as well as receiving hubs.
    if (shipmentHubOfUser.role === "SENDING_RECEIVING") {
      return await ctx.db
        .select()
        .from(shipmentHubs)
        .where(
          and(
            ne(shipmentHubs.id, shipmentHubOfUser.id),
            inArray(shipmentHubs.role, ["RECEIVING", "SENDING_RECEIVING"]),
          ),
        )
    }

    // At this point, we assume the user belongs to a receiving hub,
    // in which case, they are not allowed to send to any other hubs.
    return []
  }),
})

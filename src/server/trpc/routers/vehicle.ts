import { eq, isNull, inArray } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { vehicles, shipments, deliveryShipments } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { SUPPORTED_VEHICLE_TYPES, VehicleType } from "@/utils/constants"

export const vehicleRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(vehicles)
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
        .from(vehicles)
        .where(eq(vehicles.id, input.id))

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
  getAvailable: protectedProcedure.query(async ({ ctx }) => {
    // FIXME: This db query should also consider transfers in progress.
    const deliveriesInProgress = ctx.db
      .select()
      .from(shipments)
      .innerJoin(
        deliveryShipments,
        eq(shipments.id, deliveryShipments.shipmentId),
      )
      .where(inArray(shipments.status, ["PREPARING", "IN_TRANSIT"]))
      .as("deliveries_in_progress")

    const results = await ctx.db
      .select()
      .from(vehicles)
      .leftJoin(
        deliveriesInProgress,
        eq(vehicles.id, deliveriesInProgress.delivery_shipments.vehicleId),
      )
      .where(isNull(deliveriesInProgress.shipments.id))

    return results.map(({ vehicles }) => vehicles)
  }),
  create: protectedProcedure
    .input(
      z.object({
        type: z.custom<VehicleType>((val) =>
          SUPPORTED_VEHICLE_TYPES.includes(val as VehicleType),
        ),
        displayName: z.string().min(1).max(255),
        isExpressAllowed: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(vehicles).values({
        ...input,
        isExpressAllowed: input.isExpressAllowed ? 1 : 0,
      })
    }),
  updateById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        type: z.custom<VehicleType>((val) =>
          SUPPORTED_VEHICLE_TYPES.includes(val as VehicleType),
        ),
        displayName: z.string().min(1).max(255),
        isExpressAllowed: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(vehicles)
        .set({
          ...input,
          isExpressAllowed: input.isExpressAllowed ? 1 : 0,
        })
        .where(eq(vehicles.id, input.id))
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(vehicles).where(eq(vehicles.id, input.id))
    }),
})

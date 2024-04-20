import { eq, isNull, inArray, and, getTableColumns } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import {
  vehicles,
  shipments,
  deliveryShipments,
  assignedVehicles,
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import type { VehicleType } from "@/utils/constants"
import {
  MYSQL_ERROR_DUPLICATE_ENTRY,
  SUPPORTED_VEHICLE_TYPES,
} from "@/utils/constants"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"
import type { QueryError } from "mysql2"

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
    const vehicleColumns = getTableColumns(vehicles)

    return await ctx.db
      .select(vehicleColumns)
      .from(vehicles)
      .leftJoin(assignedVehicles, eq(vehicles.id, assignedVehicles.vehicleId))
      .where(
        and(isNull(assignedVehicles.vehicleId), eq(vehicles.isMaintenance, 0)),
      )
  }),
  create: protectedProcedure
    .input(
      z.object({
        type: z.custom<VehicleType>((val) =>
          SUPPORTED_VEHICLE_TYPES.includes(val as VehicleType),
        ),
        displayName: z.string().min(1).max(100),
        plateNumber: z.string().min(1).max(15),
        weightCapacityInKg: z.number().gt(0),
        isExpressAllowed: z.boolean(),
        isMaintenance: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const createdAt = DateTime.now().toISO()
        const result = await ctx.db.insert(vehicles).values({
          ...input,
          isExpressAllowed: input.isExpressAllowed ? 1 : 0,
          isMaintenance: input.isMaintenance ? 1 : 0,
          createdAt,
        })

        await createLog(ctx.db, {
          verb: "CREATE",
          entity: "VEHICLE",
          createdById: ctx.user.id,
        })

        return result
      } catch (e) {
        if ((e as QueryError).errno === MYSQL_ERROR_DUPLICATE_ENTRY) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ID and Plate Number must be unique.",
          })
        } else {
          throw e
        }
      }
    }),
  updateById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        type: z.custom<VehicleType>((val) =>
          SUPPORTED_VEHICLE_TYPES.includes(val as VehicleType),
        ),
        displayName: z.string().min(1).max(100),
        plateNumber: z.string().min(1).max(15),
        weightCapacityInKg: z.number().gt(0),
        isExpressAllowed: z.boolean(),
        isMaintenance: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db
          .update(vehicles)
          .set({
            ...input,
            isExpressAllowed: input.isExpressAllowed ? 1 : 0,
            isMaintenance: input.isMaintenance ? 1 : 0,
          })
          .where(eq(vehicles.id, input.id))

        await createLog(ctx.db, {
          verb: "UPDATE",
          entity: "VEHICLE",
          createdById: ctx.user.id,
        })

        return result
      } catch (e) {
        if ((e as QueryError).errno === MYSQL_ERROR_DUPLICATE_ENTRY) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "ID and Plate Number must be unique.",
          })
        } else {
          throw e
        }
      }
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(vehicles)
        .where(eq(vehicles.id, input.id))

      await createLog(ctx.db, {
        verb: "DELETE",
        entity: "VEHICLE",
        createdById: ctx.user.id,
      })

      return result
    }),
})

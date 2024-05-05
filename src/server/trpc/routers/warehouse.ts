import { eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { packages, warehouses } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"

export const warehouseRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(warehouses)
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
        .from(warehouses)
        .where(eq(warehouses.id, input.id))

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
  getRemainingCapacityById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(warehouses)
        .where(eq(warehouses.id, input.id))

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      const [warehouse] = results
      const packagesInsideWarehouse = await ctx.db
        .select()
        .from(packages)
        .where(eq(packages.lastWarehouseId, warehouse.id))

      const totalSpaceUsed = packagesInsideWarehouse.reduce((prev, curr) => {
        return prev + curr.volumeInCubicMeter
      }, 0)

      return {
        total: warehouse.volumeCapacityInCubicMeter,
        used: totalSpaceUsed,
        free: warehouse.volumeCapacityInCubicMeter - totalSpaceUsed,
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1).max(100),
        volumeCapacityInCubicMeter: z.number().gt(0),
        targetUtilization: z.number().gte(20).lte(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()
      const result = await ctx.db.insert(warehouses).values({
        ...input,
        createdAt,
      })

      await createLog(ctx.db, {
        verb: "CREATE",
        entity: "WAREHOUSE",
        createdById: ctx.user.id,
      })

      return result
    }),
  updateById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        displayName: z.string().min(1).max(100),
        volumeCapacityInCubicMeter: z.number().gt(0),
        targetUtilization: z.number().gte(20).lte(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(warehouses)
        .set(input)
        .where(eq(warehouses.id, input.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "WAREHOUSE",
        createdById: ctx.user.id,
      })

      return result
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(warehouses)
        .where(eq(warehouses.id, input.id))

      await createLog(ctx.db, {
        verb: "DELETE",
        entity: "WAREHOUSE",
        createdById: ctx.user.id,
      })

      return result
    }),
  archiveById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(warehouses)
          .set({
            isArchived: 1,
          })
          .where(eq(warehouses.id, input.id))

        await createLog(tx, {
          verb: "UPDATE",
          entity: "WAREHOUSE",
          createdById: ctx.user.id,
        })
      })
    }),
  unarchiveById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(warehouses)
          .set({
            isArchived: 0,
          })
          .where(eq(warehouses.id, input.id))

        await createLog(tx, {
          verb: "UPDATE",
          entity: "WAREHOUSE",
          createdById: ctx.user.id,
        })
      })
    }),
})

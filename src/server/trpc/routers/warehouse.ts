import { eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { warehouses } from "@/server/db/schema"
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
  create: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1).max(100),
        weightCapacityInKg: z.number().gt(0),
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
        weightCapacityInKg: z.number().gt(0),
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
})

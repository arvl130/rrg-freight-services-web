import { z } from "zod"
import { protectedProcedure, router } from "../trpc"
import { packageCategories } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { TRPCError } from "@trpc/server"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"

export const packageCategoryRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(packageCategories)
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
        .from(packageCategories)
        .where(eq(packageCategories.id, input.id))

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
        displayName: z.string().min(1).max(255),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()

      const result = await ctx.db
        .insert(packageCategories)
        .values({ ...input, createdAt })

      await createLog(ctx.db, {
        verb: "CREATE",
        entity: "PACKAGE_CATEGORY",
        createdById: ctx.user.uid,
      })

      return result
    }),
  updateById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        displayName: z.string().min(1).max(255),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(packageCategories)
        .set(input)
        .where(eq(packageCategories.id, input.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "PACKAGE_CATEGORY",
        createdById: ctx.user.uid,
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
        .delete(packageCategories)
        .where(eq(packageCategories.id, input.id))

      await createLog(ctx.db, {
        verb: "DELETE",
        entity: "PACKAGE_CATEGORY",
        createdById: ctx.user.uid,
      })

      return result
    }),
})

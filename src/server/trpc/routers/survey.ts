import { eq } from "drizzle-orm"
import { protectedProcedure, publicProcedure, router } from "../trpc"
import { survey } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"

export const surveyRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(survey)
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
        .from(survey)
        .where(eq(survey.id, input.id))

      if (results.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Survey not found.",
        })
      }

      if (results.length > 1) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })
      }

      return results[0]
    }),

  create: publicProcedure
    .input(
      z.object({
        packageId: z.string(),
        serviceRate: z.number().gt(0),
        message: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()

      return await ctx.db.insert(survey).values({ ...input, createdAt })
    }),

  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.delete(survey).where(eq(survey.id, input.id))

      await createLog(ctx.db, {
        verb: "DELETE",
        entity: "PACKAGE",
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
          .update(survey)
          .set({
            isArchived: 1,
          })
          .where(eq(survey.id, input.id))

        await createLog(tx, {
          verb: "UPDATE",
          entity: "PACKAGE",
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
          .update(survey)
          .set({
            isArchived: 0,
          })
          .where(eq(survey.id, input.id))

        await createLog(tx, {
          verb: "UPDATE",
          entity: "PACKAGE",
          createdById: ctx.user.id,
        })
      })
    }),
})

import { eq } from "drizzle-orm"
import { protectedProcedure, publicProcedure, router } from "../trpc"
import { inquiries } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"

export const inquiriesRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(inquiries)
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
        .from(inquiries)
        .where(eq(inquiries.id, input.id))

      if (results.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Inquiries not found.",
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
        fullName: z.string(),
        emailAddress: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()

      return await ctx.db.insert(inquiries).values({ ...input, createdAt })
    }),

  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(inquiries)
        .where(eq(inquiries.id, input.id))

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
          .update(inquiries)
          .set({
            isArchived: 1,
          })
          .where(eq(inquiries.id, input.id))

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
          .update(inquiries)
          .set({
            isArchived: 0,
          })
          .where(eq(inquiries.id, input.id))

        await createLog(tx, {
          verb: "UPDATE",
          entity: "PACKAGE",
          createdById: ctx.user.id,
        })
      })
    }),
})

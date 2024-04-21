import { eq } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { inquiries } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { MYSQL_ERROR_DUPLICATE_ENTRY } from "@/utils/constants"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"
import type { QueryError } from "mysql2"

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
          message: "Inquiry not found.",
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

  create: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(1).max(100),
        emailAddress: z.string().min(1).max(100),
        message: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const createdAt = DateTime.now().toISO()
        const result = await ctx.db.insert(inquiries).values({
          ...input,
          createdAt,
        })

        await createLog(ctx.db, {
          verb: "CREATE",
          createdById: ctx.user.id,
        })

        return result
      } catch (e) {
        if ((e as QueryError).errno === MYSQL_ERROR_DUPLICATE_ENTRY) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Inquiry already exists.",
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
        .delete(inquiries)
        .where(eq(inquiries.id, input.id))

      await createLog(ctx.db, {
        verb: "DELETE",
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
          createdById: ctx.user.id,
        })
      })
    }),
})

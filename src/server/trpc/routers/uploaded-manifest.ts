import { eq, getTableColumns } from "drizzle-orm"
import { protectedProcedure, router } from "../trpc"
import { uploadedManifests, users } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { DateTime } from "luxon"

export const uploadedManifestRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const uploadedManifestColumns = getTableColumns(uploadedManifests)
    return await ctx.db
      .select({
        ...uploadedManifestColumns,
        agentName: users.displayName,
      })
      .from(uploadedManifests)
      .innerJoin(users, eq(uploadedManifests.userId, users.id))
  }),
  getByCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(uploadedManifests)
      .where(eq(uploadedManifests.userId, ctx.user.id))
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
        .from(uploadedManifests)
        .where(eq(uploadedManifests.id, input.id))

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
        downloadUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()
      return await ctx.db.insert(uploadedManifests).values({
        ...input,
        createdAt,
        userId: ctx.user.id,
        status: "PENDING_REVIEW",
      })
    }),
  updateById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        downloadUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(uploadedManifests)
        .set({
          ...input,
          status: "PENDING_REVIEW",
        })
        .where(eq(uploadedManifests.id, input.id))
    }),
  updateStatusToRequestReuploadById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(uploadedManifests)
        .set({
          status: "REUPLOAD_REQUESTED",
        })
        .where(eq(uploadedManifests.id, input.id))
    }),
  deleteById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(uploadedManifests)
        .where(eq(uploadedManifests.id, input.id))
    }),
})

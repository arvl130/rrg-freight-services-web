import { z } from "zod"
import { protectedProcedure, router } from "../trpc"
import { users } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { updateProfile } from "@/server/auth"

export const userRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(users)
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().length(28),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, input.id))

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
  updateDetails: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1).max(100),
        contactNumber: z.string().min(1).max(15),
        emailAddress: z.string().min(1).email(),
        gender: z
          .union([z.literal("MALE"), z.literal("FEMALE"), z.literal("OTHER")])
          .nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({
          displayName: input.displayName,
          contactNumber: input.contactNumber,
          emailAddress: input.emailAddress,
          gender: input.gender,
        })
        .where(eq(users.id, ctx.user.uid))

      await updateProfile(ctx.user, {
        displayName: input.displayName,
      })
    }),
})

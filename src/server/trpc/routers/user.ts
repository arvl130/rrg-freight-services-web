import { z } from "zod"
import { protectedProcedure, router } from "../trpc"
import { users } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { updateProfile } from "@/server/auth"
import { getStorage } from "firebase-admin/storage"
import { clientEnv } from "@/utils/env.mjs"
import {
  Gender,
  Role,
  supportedGenders,
  supportedRoles,
} from "@/utils/constants"

// Source: https://dev.mysql.com/doc/refman/8.0/en/string-type-syntax.html
const TEXT_COLUMN_DEFAULT_LIMIT = 65_535

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

      if (results.length === 0) return null
      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      return results[0]
    }),
  createDetails: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1),
        contactNumber: z.string().min(1),
        emailAddress: z.string().min(1).max(100).email(),
        gender: z.custom<Gender>((val) =>
          supportedGenders.includes(val as Gender),
        ),
        role: z.custom<Role>((val) => supportedRoles.includes(val as Role)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await updateProfile(ctx.user, {
        displayName: input.displayName,
        email: input.emailAddress,
      })

      await ctx.db.insert(users).values({
        id: ctx.user.uid,
        displayName: input.displayName,
        contactNumber: input.contactNumber,
        emailAddress: input.emailAddress,
        gender: input.gender,
        role: input.role,
      })
    }),
  updateDetails: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1).max(100),
        contactNumber: z.string().min(1).max(15),
        emailAddress: z.string().min(1).max(100).email(),
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
        email: input.emailAddress,
      })
    }),
  updatePhotoUrl: protectedProcedure
    .input(
      z.object({
        photoUrl: z.string().min(1).url().max(TEXT_COLUMN_DEFAULT_LIMIT),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await updateProfile(ctx.user, {
        photoURL: input.photoUrl,
      })

      await ctx.db
        .update(users)
        .set({
          photoUrl: input.photoUrl,
        })
        .where(eq(users.id, ctx.user.uid))
    }),
  removePhotoUrl: protectedProcedure.mutation(async ({ ctx }) => {
    const storage = getStorage()
    await storage
      .bucket(clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
      .file(`profile-photos/${ctx.user.uid}`)
      .delete()

    await updateProfile(ctx.user, {
      photoURL: null,
    })

    await ctx.db
      .update(users)
      .set({
        photoUrl: null,
      })
      .where(eq(users.id, ctx.user.uid))
  }),
  updateRoleAndEnabledById: protectedProcedure
    .input(
      z.object({
        id: z.string().length(28),
        role: z.custom<Role>((val) => {
          return supportedRoles.includes(val as Role)
        }),
        isEnabled: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({
          role: input.role,
          isEnabled: input.isEnabled ? 1 : 0,
        })
        .where(eq(users.id, input.id))
    }),
})

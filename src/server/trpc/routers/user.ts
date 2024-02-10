import { z } from "zod"
import { protectedProcedure, router } from "../trpc"
import { shipments, deliveryShipments, users } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { and, count, eq, inArray, isNull } from "drizzle-orm"
import { updateProfile } from "@/server/auth"
import { getStorage } from "firebase-admin/storage"
import { clientEnv } from "@/utils/env.mjs"
import {
  Gender,
  UserRole,
  SUPPORTED_GENDERS,
  SUPPORTED_USER_ROLES,
} from "@/utils/constants"

// Source: https://dev.mysql.com/doc/refman/8.0/en/string-type-syntax.html
const TEXT_COLUMN_DEFAULT_LIMIT = 65_535

export const userRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(users)
  }),
  getOverseasAgents: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(users)
      .where(eq(users.role, "OVERSEAS_AGENT"))
  }),
  getDomesticAgents: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(users)
      .where(eq(users.role, "DOMESTIC_AGENT"))
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
          SUPPORTED_GENDERS.includes(val as Gender),
        ),
        role: z.custom<UserRole>((val) =>
          SUPPORTED_USER_ROLES.includes(val as UserRole),
        ),
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
        role: z.custom<UserRole>((val) => {
          return SUPPORTED_USER_ROLES.includes(val as UserRole)
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
  getAvailableDrivers: protectedProcedure.query(async ({ ctx }) => {
    // FIXME: This db query should also consider transfers in progress.
    const deliveriesInProgress = ctx.db
      .select()
      .from(shipments)
      .innerJoin(
        deliveryShipments,
        eq(shipments.id, deliveryShipments.shipmentId),
      )
      .where(inArray(shipments.status, ["PREPARING", "IN_TRANSIT"]))
      .as("deliveries_in_progress")

    const results = await ctx.db
      .select()
      .from(users)
      .leftJoin(
        deliveriesInProgress,
        eq(users.id, deliveriesInProgress.delivery_shipments.driverId),
      )
      .where(
        and(
          eq(users.role, "DRIVER"),
          isNull(deliveriesInProgress.shipments.id),
        ),
      )

    return results.map(({ users }) => users)
  }),
  getTotalActiveUsers: protectedProcedure.query(async ({ ctx }) => {
    const [{ value }] = await ctx.db
      .select({
        value: count(),
      })
      .from(users)
      .where(eq(users.isEnabled, 1))

    return {
      count: value,
    }
  }),

  getTotalUserStatus: protectedProcedure.query(async ({ ctx }) => {
    const activeUsersCount = await ctx.db
      .select({
        active: count(),
      })
      .from(users)
      .where(eq(users.isEnabled, 1))

    const inactiveUsersCount = await ctx.db
      .select({
        inactive: count(),
      })
      .from(users)
      .where(eq(users.isEnabled, 0))

    return {
      activeUsersCount,
      inactiveUsersCount,
    }
  }),
})

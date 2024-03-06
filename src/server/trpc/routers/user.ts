import { z } from "zod"
import { protectedProcedure, router } from "../trpc"
import { shipments, deliveryShipments, users } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { and, count, eq, inArray, isNull, like } from "drizzle-orm"
import { createUser, getUserByEmail, updateProfile } from "@/server/auth"
import { getStorage } from "firebase-admin/storage"
import { clientEnv } from "@/utils/env.mjs"
import type { Gender, UserRole } from "@/utils/constants"
import { SUPPORTED_GENDERS, SUPPORTED_USER_ROLES } from "@/utils/constants"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"

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
  create: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1),
        contactNumber: z.string().min(1),
        emailAddress: z.string().min(1).max(100).email(),
        password: z.string().min(8),
        gender: z.custom<Gender>((val) =>
          SUPPORTED_GENDERS.includes(val as Gender),
        ),
        role: z.custom<UserRole>((val) =>
          SUPPORTED_USER_ROLES.includes(val as UserRole),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()

      try {
        const userFromFirebase = await getUserByEmail(input.emailAddress)
        if (userFromFirebase) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A user with this email already exists.",
          })
        }
      } catch {
        // Firebase will throw an error if no user is found,
        // which we can ignore because this is what we want.
      }

      const usersFromDb = await ctx.db
        .select()
        .from(users)
        .where(like(users.emailAddress, `%${input.emailAddress}%`))

      if (usersFromDb.length !== 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user with this email already exists.",
        })
      }

      const userRecord = await createUser({
        options: {
          displayName: input.displayName,
          email: input.emailAddress,
          password: input.password,
        },
        role: input.role,
      })

      await ctx.db.insert(users).values({
        id: userRecord.uid,
        displayName: input.displayName,
        contactNumber: input.contactNumber,
        emailAddress: input.emailAddress,
        gender: input.gender,
        role: input.role,
        createdAt,
      })
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
      const createdAt = DateTime.now().toISO()

      await updateProfile(ctx.user, {
        displayName: input.displayName,
        email: input.emailAddress,
      })

      const result = await ctx.db.insert(users).values({
        id: ctx.user.uid,
        displayName: input.displayName,
        contactNumber: input.contactNumber,
        emailAddress: input.emailAddress,
        gender: input.gender,
        role: input.role,
        createdAt,
      })

      await createLog(ctx.db, {
        verb: "CREATE",
        entity: "USER",
        createdById: ctx.user.uid,
      })

      return result
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
      const result = await ctx.db
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

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "USER",
        createdById: ctx.user.uid,
      })

      return result
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

      const result = await ctx.db
        .update(users)
        .set({
          photoUrl: input.photoUrl,
        })
        .where(eq(users.id, ctx.user.uid))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "USER",
        createdById: ctx.user.uid,
      })

      return result
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

    const result = await ctx.db
      .update(users)
      .set({
        photoUrl: null,
      })
      .where(eq(users.id, ctx.user.uid))

    await createLog(ctx.db, {
      verb: "UPDATE",
      entity: "USER",
      createdById: ctx.user.uid,
    })

    return result
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
      const result = await ctx.db
        .update(users)
        .set({
          role: input.role,
          isEnabled: input.isEnabled ? 1 : 0,
        })
        .where(eq(users.id, input.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "USER",
        createdById: ctx.user.uid,
      })

      return result
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

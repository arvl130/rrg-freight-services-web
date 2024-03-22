import { z } from "zod"
import { protectedProcedure, router } from "../trpc"
import {
  shipments,
  deliveryShipments,
  users,
  warehouseStaffs,
  drivers,
  overseasAgents,
  domesticAgents,
} from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { and, count, eq, inArray, isNull, like } from "drizzle-orm"
import { getStorage } from "firebase-admin/storage"
import { clientEnv } from "@/utils/env.mjs"
import type { Gender, UserRole } from "@/utils/constants"
import {
  MYSQL_TEXT_COLUMN_DEFAULT_LIMIT,
  REGEX_HTML_INPUT_DATESTR,
  SUPPORTED_GENDERS,
  SUPPORTED_USER_ROLES,
} from "@/utils/constants"
import { createLog } from "@/utils/logging"
import { DateTime } from "luxon"
import { Scrypt } from "lucia"
import { generateUserId } from "@/utils/uuid"

const createInputSchema = z.object({
  displayName: z.string().min(1),
  contactNumber: z.string().min(1),
  emailAddress: z.string().min(1).max(100).email(),
  password: z.string().min(8),
  gender: z.custom<Gender>((val) => SUPPORTED_GENDERS.includes(val as Gender)),
})

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
      z.discriminatedUnion("role", [
        createInputSchema.extend({ role: z.literal("ADMIN") }),
        createInputSchema.extend({
          role: z.literal("WAREHOUSE"),
          warehouseId: z.number(),
        }),
        createInputSchema.extend({
          role: z.literal("DRIVER"),
          licenseNumber: z.string().min(1).max(100),
          licenseRegistrationDate: z.string().regex(REGEX_HTML_INPUT_DATESTR),
        }),
        createInputSchema.extend({
          role: z.literal("OVERSEAS_AGENT"),
          companyName: z.string().min(1).max(100),
        }),
        createInputSchema.extend({
          role: z.literal("DOMESTIC_AGENT"),
          companyName: z.string().min(1).max(100),
        }),
      ]),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()

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

      const scrypt = new Scrypt()
      const hashedPassword = await scrypt.hash(input.password)
      const userId = generateUserId()

      await ctx.db.transaction(async (tx) => {
        await tx.insert(users).values({
          id: userId,
          displayName: input.displayName,
          contactNumber: input.contactNumber,
          emailAddress: input.emailAddress,
          hashedPassword,
          gender: input.gender,
          role: input.role,
          createdAt,
        })

        if (input.role === "WAREHOUSE") {
          await tx.insert(warehouseStaffs).values({
            userId,
            warehouseId: input.warehouseId,
          })
        } else if (input.role === "DRIVER") {
          await tx.insert(drivers).values({
            userId,
            licenseNumber: input.licenseNumber,
            licenseRegistrationDate: input.licenseRegistrationDate,
          })
        } else if (input.role === "OVERSEAS_AGENT") {
          await tx.insert(overseasAgents).values({
            userId,
            companyName: input.companyName,
          })
        } else if (input.role === "DOMESTIC_AGENT") {
          await tx.insert(domesticAgents).values({
            userId,
            companyName: input.companyName,
          })
        }
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
      const result = await ctx.db
        .update(users)
        .set({
          displayName: input.displayName,
          contactNumber: input.contactNumber,
          emailAddress: input.emailAddress,
          gender: input.gender,
        })
        .where(eq(users.id, ctx.user.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "USER",
        createdById: ctx.user.id,
      })

      return result
    }),
  updatePhotoUrl: protectedProcedure
    .input(
      z.object({
        photoUrl: z.string().min(1).url().max(MYSQL_TEXT_COLUMN_DEFAULT_LIMIT),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(users)
        .set({
          photoUrl: input.photoUrl,
        })
        .where(eq(users.id, ctx.user.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "USER",
        createdById: ctx.user.id,
      })

      return result
    }),
  updatePhotoUrlById: protectedProcedure
    .input(
      z.object({
        id: z.string().length(28),
        photoUrl: z.string().min(1).url().max(MYSQL_TEXT_COLUMN_DEFAULT_LIMIT),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(users)
        .set({
          photoUrl: input.photoUrl,
        })
        .where(eq(users.id, input.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "USER",
        createdById: ctx.user.id,
      })

      return result
    }),
  removePhotoUrl: protectedProcedure.mutation(async ({ ctx }) => {
    const storage = getStorage()
    await storage
      .bucket(clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
      .file(`profile-photos/${ctx.user.id}`)
      .delete()

    const result = await ctx.db
      .update(users)
      .set({
        photoUrl: null,
      })
      .where(eq(users.id, ctx.user.id))

    await createLog(ctx.db, {
      verb: "UPDATE",
      entity: "USER",
      createdById: ctx.user.id,
    })

    return result
  }),
  removePhotoUrlById: protectedProcedure
    .input(
      z.object({
        id: z.string().length(28),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const storage = getStorage()
      await storage
        .bucket(clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
        .file(`profile-photos/${input.id}`)
        .delete()

      const result = await ctx.db
        .update(users)
        .set({
          photoUrl: null,
        })
        .where(eq(users.id, input.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "USER",
        createdById: ctx.user.id,
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
        createdById: ctx.user.id,
      })

      return result
    }),
  updatePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const scrypt = new Scrypt()
      const userRecords = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))

      if (userRecords.length !== 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No such user.",
        })
      }

      const [userRecord] = userRecords
      const passwordIsCorrect = await scrypt.verify(
        userRecord.hashedPassword,
        input.currentPassword,
      )

      if (!passwordIsCorrect) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Incorrect password.",
        })
      }

      const hashedPassword = await scrypt.hash(input.newPassword)
      const result = await ctx.db
        .update(users)
        .set({
          hashedPassword,
        })
        .where(eq(users.id, ctx.user.id))

      await createLog(ctx.db, {
        verb: "UPDATE",
        entity: "USER",
        createdById: ctx.user.id,
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

import { eq } from "drizzle-orm"
import { publicProcedure, router } from "../trpc"
import { passwordResetTokens, users } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { generatePasswordResetToken } from "@/utils/uuid"
import { stringToSha256Hash } from "@/utils/hash"
import { DateTime } from "luxon"
import { invalidateAllSessionsByUserIdWithoutCookie } from "@/server/auth"
import { Scrypt } from "lucia"
import { notifyByEmail } from "@/server/notification"
import { serverEnv } from "@/server/env.mjs"

export const passwordResetRouter = router({
  generateToken: publicProcedure
    .input(
      z.object({
        email: z
          .string()
          .trim()
          .min(1, {
            message: "Please enter your email.",
          })
          .email({
            message: "This email has an invalid format.",
          }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(users)
        .where(eq(users.emailAddress, input.email))

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email is not recognized.",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      const now = DateTime.now()
      const nowPlusOneHour = now.plus({
        hour: 1,
      })

      const [userRecord] = results
      const token = generatePasswordResetToken()
      const tokenHashed = stringToSha256Hash(token)

      await ctx.db.insert(passwordResetTokens).values({
        userId: userRecord.id,
        tokenHashed,
        expireAt: nowPlusOneHour.toISO(),
      })

      await notifyByEmail({
        to: userRecord.emailAddress,
        subject: "Change password for RRG Freight Services",
        htmlBody: `<p>A password change has been requested for your account. If this was you, please use the link to reset your password. Click <a href="${serverEnv.APP_ORIGIN}/forgot-password/${token}">here</a>.</p>`,
      })
    }),
  updatePasswordWithToken: publicProcedure
    .input(
      z.object({
        token: z.string().min(1),
        newPassword: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tokenHashed = stringToSha256Hash(input.token)
      const tokenResults = await ctx.db
        .select()
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.tokenHashed, tokenHashed))

      if (tokenResults.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No such token.",
        })

      if (tokenResults.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      const [token] = tokenResults
      if (token.isValid !== 1)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token is no longer valid.",
        })

      const tokenExpiration = DateTime.fromISO(token.expireAt)
      if (!tokenExpiration.isValid)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Generated expiration date is invalid.",
        })

      const now = DateTime.now()
      if (tokenExpiration.toMillis() < now.toMillis())
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token expired.",
        })

      const scrypt = new Scrypt()
      const hashedPassword = await scrypt.hash(input.newPassword)

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            hashedPassword,
          })
          .where(eq(users.id, token.userId))

        await ctx.db
          .update(passwordResetTokens)
          .set({
            isValid: 0,
          })
          .where(eq(passwordResetTokens.tokenHashed, tokenHashed))
      })

      await invalidateAllSessionsByUserIdWithoutCookie(token.userId)
    }),
})

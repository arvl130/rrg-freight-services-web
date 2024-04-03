import { protectedProcedure, publicProcedure, router } from "../trpc"
import {
  users,
  webauthnChallenges,
  webauthnCredentials,
} from "@/server/db/schema"
import { z } from "zod"
import { eq } from "drizzle-orm"
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server"
import { TRPCError } from "@trpc/server"
import { serverEnv } from "@/server/env.mjs"
import { DateTime } from "luxon"
import { isoUint8Array } from "@simplewebauthn/server/helpers"

export const webauthnRouter = router({
  getCredentials: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(webauthnCredentials)
      .where(eq(webauthnCredentials.userId, ctx.user.id))
  }),
  deleteCredentialById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(webauthnCredentials)
        .where(eq(webauthnCredentials.id, input.id))
    }),
  updateCredentialDeviceNameById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        deviceName: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(webauthnCredentials)
        .set({
          deviceName: input.deviceName,
        })
        .where(eq(webauthnCredentials.id, input.id))
    }),
  generateRegistrationOptions: protectedProcedure.mutation(async ({ ctx }) => {
    const createdAt = DateTime.now().toISO()
    const credentials = await ctx.db
      .select()
      .from(webauthnCredentials)
      .where(eq(webauthnCredentials.userId, ctx.user.id))

    const url = new URL(serverEnv.APP_ORIGIN)
    const options = await generateRegistrationOptions({
      rpID: url.hostname,
      rpName: serverEnv.APP_NAME,
      userID: ctx.user.id,
      userName: ctx.user.id,
      attestationType: "none",
      authenticatorSelection: {
        userVerification: "preferred",
      },
      excludeCredentials: credentials.map((credential) => ({
        id: isoUint8Array.fromHex(credential.id),
        type: "public-key",
        transports: JSON.parse(credential.transports),
      })),
    })

    try {
      await ctx.db
        .insert(webauthnChallenges)
        .values({
          userId: ctx.user.id,
          challenge: options.challenge,
          createdAt,
        })
        .onDuplicateKeyUpdate({ set: { challenge: options.challenge } })
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not setup challenge.",
        cause: e,
      })
    }

    return options
  }),
  verifyRegistrationResponse: protectedProcedure
    .input(
      z.object({
        response: z.any(),
        deviceName: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()
      const challenge = await ctx.db.query.webauthnChallenges.findFirst({
        where: eq(webauthnChallenges.userId, ctx.user.id),
      })

      if (!challenge) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Pre-registration is required.",
        })
      }

      const url = new URL(serverEnv.APP_ORIGIN)
      const { verified, registrationInfo: info } =
        await verifyRegistrationResponse({
          response: input.response,
          expectedRPID: url.hostname,
          expectedOrigin: url.origin,
          expectedChallenge: challenge.challenge,
          requireUserVerification: false,
        })

      if (!verified || !info)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Missing verified or info from registration response.",
        })

      await ctx.db.insert(webauthnCredentials).values({
        id: isoUint8Array.toHex(info.credentialID),
        userId: ctx.user.id,
        deviceName: input.deviceName,
        key: Buffer.from(info.credentialPublicKey).toString("hex"),
        counter: info.counter,
        transports: JSON.stringify(
          input.response.response.transports ?? ["internal"],
        ),
        createdAt,
      })
    }),
  generateAuthenticationOptions: publicProcedure
    .input(
      z.object({
        email: z.string().min(1).email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdAt = DateTime.now().toISO()
      const userRecords = await ctx.db
        .select()
        .from(users)
        .where(eq(users.emailAddress, input.email))

      if (userRecords.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
        })

      if (userRecords.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      const [userRecord] = userRecords
      const credentials = await ctx.db
        .select()
        .from(webauthnCredentials)
        .where(eq(webauthnCredentials.userId, userRecord.id))

      if (credentials.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No credential found for user.",
        })

      const options = await generateAuthenticationOptions({
        userVerification: "preferred",
        allowCredentials: credentials.map((credential) => ({
          id: isoUint8Array.fromHex(credential.id),
          type: "public-key",
          transports: JSON.parse(credential.transports),
        })),
      })

      try {
        await ctx.db
          .insert(webauthnChallenges)
          .values({
            userId: userRecord.id,
            challenge: options.challenge,
            createdAt,
          })
          .onDuplicateKeyUpdate({ set: { challenge: options.challenge } })
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not setup challenge.",
          cause: e,
        })
      }

      return options
    }),
})

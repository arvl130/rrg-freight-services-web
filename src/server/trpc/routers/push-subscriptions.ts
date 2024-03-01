import { serverEnv } from "@/server/env.mjs"
import { protectedProcedure, router } from "../trpc"
import { pushSubscriptions } from "@/server/db/schema"
import { clientEnv } from "@/utils/env.mjs"
import { sendNotification, setVapidDetails } from "web-push"
import { z } from "zod"
import { eq, inArray } from "drizzle-orm"
import { stringToSha256Hash } from "@/utils/hash"

setVapidDetails(
  "mailto:test@example.com",
  clientEnv.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  serverEnv.WEB_PUSH_PRIVATE_KEY,
)

export const pushSubscriptionsRouter = router({
  testPublish: protectedProcedure
    .input(
      z.object({
        endpoint: z.string().min(1).url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const subscriptions = await ctx.db
        .select()
        .from(pushSubscriptions)
        .where(eq(pushSubscriptions.id, stringToSha256Hash(input.endpoint)))

      const sendPromises = subscriptions.map((s) => {
        const payload = JSON.stringify({
          title: "Hi there!",
          body: "This is a test notification.",
        })

        return sendNotification(
          {
            endpoint: s.endpoint,
            keys: {
              auth: s.keyAuth,
              p256dh: s.keyP256dh,
            },
          },
          payload,
        )
      })

      const results = await Promise.allSettled(sendPromises)
      const failedEndpoints = results
        .filter(
          (result): result is PromiseRejectedResult =>
            result.status === "rejected" && result.reason.statusCode === 410,
        )
        .map((result) => stringToSha256Hash(result.reason.endpoint))

      if (failedEndpoints.length > 0)
        await ctx.db
          .delete(pushSubscriptions)
          .where(inArray(pushSubscriptions.id, failedEndpoints))

      return results
    }),
  create: protectedProcedure
    .input(
      z.object({
        endpoint: z.string().min(1).url(),
        expirationTime: z.number().nullable(),
        keys: z.object({
          auth: z.string().min(1),
          p256dh: z.string().min(1),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(pushSubscriptions).values({
        id: stringToSha256Hash(input.endpoint),
        endpoint: input.endpoint,
        expirationTime: input.expirationTime,
        keyAuth: input.keys.auth,
        keyP256dh: input.keys.p256dh,
      })
    }),
  delete: protectedProcedure
    .input(
      z.object({
        endpoint: z.string().min(1).url(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, input.endpoint))
    }),
})

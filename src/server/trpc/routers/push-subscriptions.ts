import { serverEnv } from "@/server/env.mjs"
import { protectedProcedure, router } from "../trpc"
import { pushSubscriptions } from "@/server/db/schema"
import { clientEnv } from "@/utils/env.mjs"
import { sendNotification, setVapidDetails } from "web-push"
import { z } from "zod"

setVapidDetails(
  "mailto:test@example.com",
  clientEnv.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  serverEnv.WEB_PUSH_PRIVATE_KEY,
)

export const pushSubscriptionsRouter = router({
  testPublish: protectedProcedure.mutation(async ({ ctx }) => {
    const subscriptions = await ctx.db.select().from(pushSubscriptions)
    const sendPromises = subscriptions.map((s) => {
      const payload = JSON.stringify({
        title: "WebPush Notification!",
        body: "Hi there",
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

    return await Promise.all(sendPromises)
  }),
  create: protectedProcedure
    .input(
      z.object({
        endpoint: z.string().min(1),
        expirationTime: z.number().nullable(),
        keys: z.object({
          auth: z.string().min(1),
          p256dh: z.string().min(1),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(pushSubscriptions).values({
        endpoint: input.endpoint,
        expirationTime: input.expirationTime,
        keyAuth: input.keys.auth,
        keyP256dh: input.keys.p256dh,
      })
    }),
})

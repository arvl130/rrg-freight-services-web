import { serverEnv } from "@/server/env.mjs"
import { protectedProcedure, router } from "../trpc"
import { pushSubscriptions } from "@/server/db/schema"
import { clientEnv } from "@/utils/env.mjs"
import { sendNotification, setVapidDetails } from "web-push"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { createHash } from "crypto"

setVapidDetails(
  "mailto:test@example.com",
  clientEnv.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  serverEnv.WEB_PUSH_PRIVATE_KEY,
)

export const pushSubscriptionsRouter = router({
  testPublish: protectedProcedure
    .input(
      z.object({
        endpoint: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const subscriptions = await ctx.db
        .select()
        .from(pushSubscriptions)
        .where(
          eq(
            pushSubscriptions.id,
            createHash("sha256").update(input.endpoint).digest("hex"),
          ),
        )

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

      // TODO: Stale URLs should be recorded and later removed.
      return await Promise.allSettled(sendPromises)
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
        id: createHash("sha256").update(input.endpoint).digest("hex"),
        endpoint: input.endpoint,
        expirationTime: input.expirationTime,
        keyAuth: input.keys.auth,
        keyP256dh: input.keys.p256dh,
      })
    }),
  delete: protectedProcedure
    .input(
      z.object({
        endpoint: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, input.endpoint))
    }),
})

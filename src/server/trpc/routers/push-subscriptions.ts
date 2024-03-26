import { protectedProcedure, router } from "../trpc"
import { webpushSubscriptions } from "@/server/db/schema"
import { z } from "zod"
import { eq, inArray } from "drizzle-orm"
import { stringToSha256Hash } from "@/utils/hash"
import { DateTime } from "luxon"
import { notifyByWebPush } from "@/server/notification"

export const webpushSubscriptionRouter = router({
  testPublish: protectedProcedure
    .input(
      z.object({
        endpoint: z.string().min(1).url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const subscriptions = await ctx.db
        .select()
        .from(webpushSubscriptions)
        .where(
          eq(
            webpushSubscriptions.endpointHashed,
            stringToSha256Hash(input.endpoint),
          ),
        )

      const results = await notifyByWebPush({
        subscriptions,
        title: "Hi there!",
        body: "This is a test notification.",
      })

      const failedEndpoints = results
        .filter(
          (result): result is PromiseRejectedResult =>
            result.status === "rejected" && result.reason.statusCode === 410,
        )
        .map((result) => stringToSha256Hash(result.reason.endpoint))

      if (failedEndpoints.length > 0)
        await ctx.db
          .delete(webpushSubscriptions)
          .where(inArray(webpushSubscriptions.endpointHashed, failedEndpoints))

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
      const createdAt = DateTime.now().toISO()

      return ctx.db.insert(webpushSubscriptions).values({
        userId: ctx.user.id,
        endpointHashed: stringToSha256Hash(input.endpoint),
        endpoint: input.endpoint,
        expirationTime: input.expirationTime,
        keyAuth: input.keys.auth,
        keyP256dh: input.keys.p256dh,
        createdAt,
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
        .delete(webpushSubscriptions)
        .where(eq(webpushSubscriptions.endpoint, input.endpoint))
    }),
})

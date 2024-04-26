import { eq } from "drizzle-orm"
import { publicProcedure, router } from "../trpc"
import { packageMonitoringAccessKeys, packages } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { notifyByEmailWithHtmlifiedComponent } from "@/server/notification"
import { DateTime } from "luxon"
import MonitoringLinkEmail from "@/utils/email-templates/monitoring-link-email"

export const monitoringLinkRouter = router({
  sendEmail: publicProcedure
    .input(
      z.object({
        packageId: z.string(),
        requestedBy: z.literal("SENDER").or(z.literal("RECEIVER")),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(packages)
        .where(eq(packages.id, input.packageId))

      if (results.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No such package.",
        })

      if (results.length > 1)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Expected 1 result, but got multiple.",
        })

      const [{ senderEmailAddress, receiverEmailAddress }] = results
      const now = DateTime.now()
      const accessKey = crypto.randomUUID()

      await ctx.db.insert(packageMonitoringAccessKeys).values({
        packageId: input.packageId,
        accessKey,
        createdAt: now.toISO(),
      })

      await notifyByEmailWithHtmlifiedComponent({
        to:
          input.requestedBy === "SENDER"
            ? senderEmailAddress
            : receiverEmailAddress,
        subject: "Monitoring link requested for your package",
        component: (
          <MonitoringLinkEmail
            packageId={input.packageId}
            accessKey={accessKey}
          />
        ),
      })
    }),
})

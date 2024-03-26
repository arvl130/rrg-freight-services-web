import { serverEnv } from "@/server/env.mjs"
import { Resend } from "resend"
import type { WebpushSubscription } from "./db/entities"
import { sendNotification, setVapidDetails } from "web-push"
import { clientEnv } from "@/utils/env.mjs"

const resend = new Resend(serverEnv.RESEND_API_KEY)

export async function notifyByEmail({
  to,
  subject,
  htmlBody,
}: {
  to: string
  subject: string
  htmlBody: string
}) {
  if (serverEnv.OFFLINE_MODE === "1") return
  if (serverEnv.IS_EMAIL_ENABLED === "1") {
    await resend.emails.send({
      from: `RRG Freight Services Updates <noreply@${serverEnv.MAIL_FROM_URL}>`,
      to,
      subject,
      html: htmlBody,
    })
  }
}

export async function notifyBySms({ to, body }: { to: string; body: string }) {
  if (serverEnv.OFFLINE_MODE === "1") return
  if (serverEnv.IS_SMS_ENABLED === "1") {
    await fetch(
      `${serverEnv.SMS_API_URL}/sms?apiKey=${serverEnv.SMS_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          body,
        }),
      },
    )
  }
}

setVapidDetails(
  "mailto:test@example.com",
  clientEnv.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  serverEnv.WEB_PUSH_PRIVATE_KEY,
)

export async function notifyByWebPush(options: {
  subscriptions: WebpushSubscription[]
  title: string
  body: string
}) {
  if (serverEnv.OFFLINE_MODE === "1") return []

  const sendPromises = options.subscriptions.map((s) => {
    const payload = JSON.stringify({
      title: options.title,
      body: options.body,
      userId: s.userId,
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

  return await Promise.allSettled(sendPromises)
}

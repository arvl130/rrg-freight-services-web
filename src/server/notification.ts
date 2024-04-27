import { serverEnv } from "@/server/env.mjs"
import { Resend } from "resend"
import type { WebpushSubscription } from "./db/entities"
import { sendNotification, setVapidDetails } from "web-push"
import { clientEnv } from "@/utils/env.mjs"
import type { ExpoPushMessage } from "expo-server-sdk"
import { Expo } from "expo-server-sdk"
import type { JSXElementConstructor, ReactElement } from "react"
import { render } from "@react-email/render"
import { chunkArray } from "@/utils/array-transform"
import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs"

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

export async function notifyByEmailWithHtmlifiedComponent({
  to,
  subject,
  component,
}: {
  to: string
  subject: string
  component: ReactElement<any, string | JSXElementConstructor<any>>
}) {
  if (serverEnv.OFFLINE_MODE === "1") return
  if (serverEnv.IS_EMAIL_ENABLED === "1") {
    const componentTextVersion = render(component, {
      plainText: true,
    })

    await resend.emails.send({
      from: `RRG Freight Services Updates <noreply@${serverEnv.MAIL_FROM_URL}>`,
      to,
      subject,
      react: component,
      text: componentTextVersion,
    })
  }
}

const AWS_SQS_BATCH_SIZE_LIMIT = 10

const sqsClient = new SQSClient({
  credentials: {
    accessKeyId: serverEnv.AWS_ACCESS_KEY_ID,
    secretAccessKey: serverEnv.AWS_ACCESS_KEY_SECRET,
  },
})

type PackageStatusUpdateEmailComponentProps = {
  type: "package-status-update"
  body: string
  callToAction: {
    label: string
    href: string
  }
}

type OtpEmailComponentProps = {
  type: "otp"
  otp: string
  validityMessage?: string
}

type ComponentProps =
  | PackageStatusUpdateEmailComponentProps
  | OtpEmailComponentProps

export async function batchNotifyByEmailWithComponentProps(options: {
  messages: {
    to: string
    subject: string
    componentProps: ComponentProps
  }[]
}) {
  if (serverEnv.OFFLINE_MODE === "1") return
  if (serverEnv.IS_EMAIL_ENABLED === "1") {
    const timerLabel = `Sent ${options.messages.length} emails in`
    console.time(timerLabel)

    const chunkedMessages = chunkArray(
      options.messages,
      AWS_SQS_BATCH_SIZE_LIMIT,
    )

    await Promise.allSettled(
      chunkedMessages.map((chunk) => {
        const command = new SendMessageBatchCommand({
          QueueUrl: serverEnv.AWS_SQS_EMAIL_QUEUE_URL,
          Entries: chunk.map((message) => ({
            Id: crypto.randomUUID(),
            MessageBody: JSON.stringify(message),
          })),
        })

        return sqsClient.send(command)
      }),
    )
    console.timeEnd(timerLabel)
  }
}

const RESEND_BATCH_EMAIL_LIMIT = 100

export async function batchNotifyByEmailWithHtmlifiedComponent(options: {
  messages: {
    to: string
    subject: string
    component: ReactElement<any, string | JSXElementConstructor<any>>
  }[]
}) {
  if (serverEnv.OFFLINE_MODE === "1") return
  if (serverEnv.IS_EMAIL_ENABLED === "1") {
    const messagesWithTextVersion = options.messages.map((message) => ({
      from: `RRG Freight Services Updates <noreply@${serverEnv.MAIL_FROM_URL}>`,
      to: message.to,
      subject: message.subject,
      react: message.component,
      text: "Please check the HTML version of this email.",
    }))

    const chunkedMessages = chunkArray(
      messagesWithTextVersion,
      RESEND_BATCH_EMAIL_LIMIT,
    )

    await Promise.allSettled(
      chunkedMessages.map((chunk) => resend.batch.send(chunk)),
    )
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

export async function batchNotifyBySms(options: {
  messages: {
    to: string
    body: string
  }[]
}) {
  if (serverEnv.OFFLINE_MODE === "1") return
  if (serverEnv.IS_SMS_ENABLED === "1") {
    const timerLabel = `Sent ${options.messages.length} SMS messages in`
    console.time(timerLabel)
    const chunkedMessages = chunkArray(
      options.messages,
      AWS_SQS_BATCH_SIZE_LIMIT,
    )

    await Promise.allSettled(
      chunkedMessages.map((chunk) => {
        const command = new SendMessageBatchCommand({
          QueueUrl: serverEnv.AWS_SQS_SMS_QUEUE_URL,
          Entries: chunk.map((message) => ({
            Id: crypto.randomUUID(),
            MessageBody: JSON.stringify(message),
          })),
        })

        return sqsClient.send(command)
      }),
    )
    console.timeEnd(timerLabel)
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

const expo = new Expo({
  accessToken: serverEnv.EXPO_ACCESS_TOKEN,
  useFcmV1: true,
})

export async function notifyByExpoPush(message: ExpoPushMessage) {
  if (serverEnv.OFFLINE_MODE === "1") return null

  const [ticket] = await expo.sendPushNotificationsAsync([message])
  return ticket
}

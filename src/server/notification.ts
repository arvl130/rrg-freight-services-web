import { serverEnv } from "@/server/env.mjs"
import { Resend } from "resend"

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
  if (serverEnv.IS_EMAIL_ENABLED === "1") {
    await resend.emails.send({
      from: `RRG Freight Services Updates <noreply@${serverEnv.MAIL_FROM_URL}>`,
      to,
      subject,
      html: htmlBody,
    })
  }
}

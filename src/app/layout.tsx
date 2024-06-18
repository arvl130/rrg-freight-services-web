import "@/styles/globals.css"
import { Toaster } from "react-hot-toast"
import { Providers } from "@/providers/providers"
import type { ReactNode } from "react"
import { DM_Sans } from "next/font/google"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata = {
  title: "RRG Freight Services",
  description:
    "RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body className={`text-brand-black ${dmSans.className}`}>
          <Toaster position="top-center" />
          {children}
        </body>
      </Providers>
    </html>
  )
}

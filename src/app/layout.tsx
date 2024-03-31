import "@/styles/globals.css"
import { Fonts } from "./fonts"
import { Toaster } from "react-hot-toast"
import { Providers } from "@/providers/providers"
import type { ReactNode } from "react"

export const metadata = {
  title: "RRG Freight Services",
  description:
    "RRG Freight Services is an international freight forwarding company. Contact us at +632 8461 6027 for any of your cargo needs.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Fonts />
      <Providers>
        <body className="text-brand-black">
          <Toaster position="top-center" />
          {children}
        </body>
      </Providers>
    </html>
  )
}

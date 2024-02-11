import "@/styles/globals.css"
import { Fonts } from "./fonts"
import { AuthProvider } from "@/utils/auth"
import { Toaster } from "react-hot-toast"
import { ApiProvider } from "./api-provider"

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Fonts />
      <AuthProvider>
        <ApiProvider>
          <body className="text-brand-black">
            <Toaster position="top-center" />
            {children}
          </body>
        </ApiProvider>
      </AuthProvider>
    </html>
  )
}

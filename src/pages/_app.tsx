import "@/styles/globals.css"
import { api } from "@/utils/api"
import { AuthProvider } from "@/utils/auth"
import type { AppProps } from "next/app"
import { DM_Sans } from "next/font/google"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export default api.withTRPC(({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <div className={`${dmSans.variable} font-sans text-brand-black`}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  )
})

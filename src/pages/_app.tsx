import "@/styles/globals.css"
import { api } from "@/utils/api"
import { AuthProvider } from "@/utils/auth"
import type { AppProps } from "next/app"

export default api.withTRPC(({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
})

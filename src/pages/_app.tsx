import "@/styles/globals.css"
import { api } from "@/utils/api"
import { AuthProvider } from "@/utils/auth"
import { Toaster } from "react-hot-toast"
import type { AppProps } from "next/app"
import { DM_Sans } from "next/font/google"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
})

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
)

export default api.withTRPC(({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <style jsx global>
        {`
          :root {
            --font-dm-sans: ${dmSans.style.fontFamily};
          }
        `}
      </style>
      <div className={`${dmSans.variable} font-sans text-brand-black`}>
        <Toaster position="top-center" />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  )
})

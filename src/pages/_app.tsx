import "@/styles/globals.css"
import { api } from "@/utils/api"
import { AuthProvider } from "@/providers/auth"
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
      {process.env.NODE_ENV === "development" ? (
        <style jsx global>
          {`
            @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400;1,9..40,500;1,9..40,600;1,9..40,700;1,9..40,800;1,9..40,900&display=swap");
          `}
        </style>
      ) : (
        <style jsx global>
          {`
            :root {
              --font-dm-sans: ${dmSans.style.fontFamily};
            }
          `}
        </style>
      )}
      <div className="text-brand-black">
        <Toaster position="top-center" />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  )
})

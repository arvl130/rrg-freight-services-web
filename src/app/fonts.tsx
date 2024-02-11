"use client"

import { DM_Sans } from "next/font/google"
import { useServerInsertedHTML } from "next/navigation"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export function Fonts() {
  useServerInsertedHTML(() => {
    if (process.env.NODE_ENV === "development")
      return (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400;1,9..40,500;1,9..40,600;1,9..40,700;1,9..40,800;1,9..40,900&display=swap');
            `,
          }}
        />
      )

    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-dm-sans: ${dmSans.style.fontFamily};
            }
          `,
        }}
      />
    )
  })

  return <></>
}

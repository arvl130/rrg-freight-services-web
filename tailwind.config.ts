import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/colors.ts",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "brand-black": "#1e1e1e",
        "brand-gray": {
          "500": "#373737",
          "400": "#777777",
        },
        "brand-red": "#ff9e9e",
        "brand-cyan": {
          "100": "#eff8f8",
          "350": "#a9dbe2",
          "450": "#acdee2",
          "500": "#79cfdc",
          "600": "#6BB6C1",
        },
        "brand-teal": "#a4d8d8",
      },
      fontFamily: {
        sans: [
          process.env.NODE_ENV === "development"
            ? "DM Sans"
            : "var(--font-dm-sans)",
          ...fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
}
export default config

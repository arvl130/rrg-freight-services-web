import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
        "brand-cyan": "#acdee2",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", ...fontFamily.sans],
        
      },
    },
  },
  plugins: [],
}
export default config

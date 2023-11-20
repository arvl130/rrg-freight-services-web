import "./src/server/env.mjs"
import "./src/utils/env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      // Domain used by profile pictures of users
      // signing in for the first time with Google.
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
}

export default nextConfig

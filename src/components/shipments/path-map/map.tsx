import dynamic from "next/dynamic"

// Leaflet doesn't work with SSR, so we need to tell
// Next.js to skip rendering it on the server.
//
// Source: https://jan-mueller.at/blog/react-leaflet/#nextjs
export const PathMap = dynamic(() => import("./bare-map"), {
  ssr: false,
})

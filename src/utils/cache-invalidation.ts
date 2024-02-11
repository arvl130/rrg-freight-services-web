import { revalidatePath } from "next/cache"

export function invalidateFullCache() {
  // Invalidate the caller's entire cache.
  //
  // NOTE: The router cache of other users will remain
  // stale for 30 seconds on dynamic pages, and 5 minutes
  // on static pages. Only the caller's cache is immediately
  // invalidated. This stale time will be configurable later.
  //
  // For more info, see: https://github.com/vercel/next.js/discussions/54075#discussioncomment-8373791
  revalidatePath("/", "layout")
}

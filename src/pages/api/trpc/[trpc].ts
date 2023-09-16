import { rootRouter } from "@/server/trpc/routers"
import { createContext } from "@/server/trpc/trpc"
import { createNextApiHandler } from "@trpc/server/adapters/next"

export default createNextApiHandler({
  router: rootRouter,
  createContext,
})
